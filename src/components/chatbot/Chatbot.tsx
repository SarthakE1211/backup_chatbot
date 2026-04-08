"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatApiService } from "@/services/chatApiService";
import { ChatMessage } from "@/services/chatbot.models";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const initialChips = [
    'My laptop is slow',
    'Printer not working',
    'WiFi is weak',
    'How much does it cost?',
    'Book a service',
    'What areas do you cover?'
];

const langMap: Record<string, string> = {
    English: "en-IN",
    Hindi: "hi-IN",
    Tamil: "ta-IN",
    Telugu: "te-IN",
};

const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const GREETING =
    "Hi there! I'm Chip, your personal tech assistant. What device needs attention today? Pick a quick option above or describe your issue.";

const THEMES = {
    dark: "dark-gradient",
    light: "light-corporate"
};

// ── WebSocket enabled flag (mirrors service) ──────────────────────────────────
const WS_ENABLED = process.env.NEXT_PUBLIC_WS_ENABLED === 'true';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [hasOpened, setHasOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const [inputText, setInputText] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [followUpChips, setFollowUpChips] = useState<string[]>([]);
    const [lang] = useState("English");
    const [greetTime] = useState(() => getTime());
    const [expanded, setExpanded] = useState(false);
    const [theme, setTheme] = useState(THEMES.light);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    // ── WebSocket state ────────────────────────────────────────────────────────
    const [wsConnected, setWsConnected] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    /**
     * Streaming text accumulator — appended via onToken callbacks.
     * When onDone fires we move this into the messages array.
     */
    const [streamingText, setStreamingText] = useState<string>("");
    const isStreamingRef = useRef(false); // avoids stale closure issues

    const messagesAreaRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const cancelWsRef = useRef<(() => void) | null>(null);

    // ── History ref — kept in sync so sendMessage closure always has latest ───
    const messagesRef = useRef<ChatMessage[]>([]);
    useEffect(() => { messagesRef.current = messages; }, [messages]);

    // ── Mount / resize ─────────────────────────────────────────────────────────
    useEffect(() => {
        setMounted(true);
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // ── Theme observer ─────────────────────────────────────────────────────────
    useEffect(() => {
        if (typeof window === "undefined") return;
        const saved = localStorage.getItem("pockit-theme");
        const initialTheme = saved || document.documentElement.getAttribute("data-theme") || THEMES.light;
        document.documentElement.setAttribute("data-theme", initialTheme);
        setTheme(initialTheme);

        const obs = new MutationObserver(() => {
            setTheme(document.documentElement.getAttribute("data-theme") || THEMES.dark);
        });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => obs.disconnect();
    }, []);

    // ── Speech recognition support ─────────────────────────────────────────────
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            setSpeechSupported(!!SR);
        }
    }, []);

    // ── Auto-scroll ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
        }
    }, [messages, isLoading, followUpChips, streamingText]);

    // ── Cleanup recognition on unmount ─────────────────────────────────────────
    useEffect(() => {
        return () => { recognitionRef.current?.stop?.(); };
    }, []);

    // ── WebSocket: connect when chat opens, disconnect when it closes ──────────
    useEffect(() => {
        if (!WS_ENABLED) return;

        if (isOpen) {
            const clientId = ChatApiService.getClientId();

            ChatApiService.connectWebSocket(clientId, {
                onOpen: () => setWsConnected(true),

                onClose: () => setWsConnected(false),

                onSession: (sid) => {
                    console.log('[Chatbot] Session ID:', sid);
                    setSessionId(sid);
                },

                // ── Streaming partial token ────────────────────────────────
                onToken: (token) => {
                    if (!isStreamingRef.current) {
                        // First token — create a placeholder bot message
                        isStreamingRef.current = true;
                        setMessages(prev => [
                            ...prev,
                            {
                                type: 'bot',
                                text: '',
                                isStreaming: true,
                                time: getTime(),
                            },
                        ]);
                    }
                    setStreamingText(prev => prev + token);
                    // Also update the last message in the array live
                    setMessages(prev => {
                        const updated = [...prev];
                        const last = updated[updated.length - 1];
                        if (last?.isStreaming) {
                            updated[updated.length - 1] = {
                                ...last,
                                text: last.text + token,
                            };
                        }
                        return updated;
                    });
                },

                // ── Streaming complete / non-streaming message ─────────────
                onDone: (resp) => {
                    isStreamingRef.current = false;
                    setStreamingText("");
                    setIsLoading(false);

                    setMessages(prev => {
                        const updated = [...prev];
                        const lastIdx = updated.length - 1;

                        // If we have a streaming placeholder, finalise it
                        if (lastIdx >= 0 && updated[lastIdx].isStreaming) {
                            updated[lastIdx] = {
                                type: 'bot',
                                text: resp.message || updated[lastIdx].text || 'Sorry, I couldn\'t get a response.',
                                service: resp.service ?? null,
                                showHumanHandoff: !!resp.showHumanHandoff,
                                isError: false,
                                isStreaming: false,
                                time: getTime(),
                            };
                            return updated;
                        }

                        // No placeholder (e.g., backend sent done without tokens)
                        return [
                            ...updated,
                            {
                                type: 'bot',
                                text: resp.message || 'Sorry, I couldn\'t get a response.',
                                service: resp.service ?? null,
                                showHumanHandoff: !!resp.showHumanHandoff,
                                isError: false,
                                isStreaming: false,
                                time: getTime(),
                            },
                        ];
                    });

                    setFollowUpChips(resp.followUpChips ?? []);
                },

                onError: (err) => {
                    console.error('[Chatbot] WS error:', err);
                    isStreamingRef.current = false;
                    setStreamingText("");
                    setIsLoading(false);

                    setMessages(prev => {
                        const updated = [...prev];
                        const last = updated[updated.length - 1];
                        // If there's a streaming placeholder, replace it with error
                        if (last?.isStreaming) {
                            updated[updated.length - 1] = {
                                type: 'bot',
                                text: '',
                                isError: true,
                                isStreaming: false,
                                time: getTime(),
                            };
                            return updated;
                        }
                        return [
                            ...updated,
                            { type: 'bot', text: '', isError: true, isStreaming: false, time: getTime() },
                        ];
                    });

                    setFollowUpChips(["Call support", "Send email", "Try again"]);
                },
            }).then(cancel => {
                cancelWsRef.current = cancel;
            });
        } else {
            // Chat closed — clean up socket
            cancelWsRef.current?.();
            cancelWsRef.current = null;
            setWsConnected(false);
        }

        return () => {
            cancelWsRef.current?.();
            cancelWsRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // ── Reset ──────────────────────────────────────────────────────────────────
    const resetChat = () => {
        setMessages([]);
        setInputText("");
        setFollowUpChips([]);
        setIsLoading(false);
        setIsListening(false);
        setHasOpened(false);
        setStreamingText("");
        isStreamingRef.current = false;
    };

    // ── Toggle open/close ──────────────────────────────────────────────────────
    const toggleChat = () => {
        if (!isOpen) setHasOpened(true);
        setIsOpen(prev => {
            const next = !prev;
            if (next) setExpanded(false);
            return next;
        });
    };

    // ── Voice recognition ──────────────────────────────────────────────────────
    const toggleListening = () => {
        if (isListening) { recognitionRef.current?.stop?.(); setIsListening(false); return; }
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) return;
        const recognition = new SR();
        recognition.lang = langMap[lang] || "en-IN";
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (e: any) => {
            setInputText(Array.from(e.results).map((r: any) => r[0].transcript).join(""));
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();
        recognitionRef.current = recognition;
    };

    console.log("message", messages)
    // ── Send message ───────────────────────────────────────────────────────────
    const sendMessage = useCallback(async (overrideText?: string) => {
        console.log("sendMessage called", inputText)
        const text = (overrideText !== undefined ? overrideText : inputText).trim();
        if (!text || isLoading) return;

        const userMsg: ChatMessage = { type: "user", text, time: getTime() };
        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setFollowUpChips([]);
        setIsLoading(true);

        // Build history from ref (always fresh)
        const history = [...messagesRef.current, userMsg]
            .slice(-6)
            .map(m => ({ type: m.type, text: m.text }));

        // ── WebSocket path ─────────────────────────────────────────────────────
        if (WS_ENABLED && ChatApiService.isWebSocketOpen()) {
            // Streaming response will come through onToken / onDone callbacks
            ChatApiService.sendWebSocketMessage(text, lang, history);
            return; // isLoading will be cleared by onDone/onError
        }

        // ── REST fallback ──────────────────────────────────────────────────────
        try {
            const parsed = await ChatApiService.getResponse(text, lang, history);
            console.log("parsed", parsed)
            setMessages(prev => [...prev, {
                type: "bot",
                text: parsed.message || "Sorry, I couldn't get a response.",
                service: parsed.service ?? null,
                showHumanHandoff: !!parsed.showHumanHandoff,
                isError: false,
                time: getTime(),
            }]);
            setFollowUpChips(parsed.followUpChips ?? []);
        } catch {
            setMessages(prev => [...prev, { type: "bot", text: "", isError: true, time: getTime() }]);
            setFollowUpChips(["Call support", "Send email", "Try again"]);
        } finally {
            setIsLoading(false);
        }
    }, [inputText, lang, isLoading]);

    // ── Logo component ─────────────────────────────────────────────────────────
    const PELogo = ({ size = 20 }: { size?: number }) => (
        <Image
            src={theme === THEMES.dark ? "/svg/orange_chat_icon.svg" : "/svg/Blue_chat_icon.svg"}
            alt="Pockit Engineers"
            width={30}
            height={30}
            priority
        />
    );

    // ── WS connection indicator ────────────────────────────────────────────────
    const WsIndicator = () => {
        if (!WS_ENABLED) return null;
        return (
            <span
                title={wsConnected ? "Live connection active" : "Connecting…"}
                style={{
                    display: 'inline-block',
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: wsConnected ? '#22c55e' : '#f59e0b',
                    marginLeft: 4,
                    verticalAlign: 'middle',
                    transition: 'background 0.3s',
                }}
            />
        );
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className={`cbot-wrap ${isOpen ? "is-open" : ""}`}>

            {isOpen && (
                <div className="cbot-window">

                    {/* ── Header ── */}
                    <div
                        className="cbot-header"
                        style={{ background: theme === THEMES.dark ? "#ea580c" : "#3b3fa8" }}
                    >
                        <div className="cbot-header-left">
                            <div className="cbot-av-outer">
                                <Image
                                    src={theme === THEMES.dark ? "/svg/orange_chat_icon.svg" : "/svg/Blue_chat_icon.svg"}
                                    alt="Pockit Engineers"
                                    width={600}
                                    height={168}
                                    className="w-full h-auto"
                                    priority
                                />
                                <span className="cbot-online" />
                            </div>
                            <div>
                                <p className="cbot-name">chip.ai <WsIndicator /></p>
                                <p className="cbot-sub">Your Personal Tech Assistant</p>
                            </div>
                        </div>
                        <div className="flex flexdirection-row gap-3">
                            <button className="cbot-close-btn" onClick={resetChat} aria-label="Reset">
                                <svg width="12" height="12" viewBox="0 0 22 22" fill="none">
                                    <path d="M21 12a9 9 0 1 1-3-6.7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                                    <polyline points="21 3 21 9 15 9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button className="cbot-close-btn" onClick={toggleChat} aria-label="Close">
                                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* ── Messages ── */}
                    <div className="cbot-messages" ref={messagesAreaRef}>

                        {messages.length === 0 && (
                            <>
                                <div className="cbot-chips-grid">
                                    {initialChips.map(chip => (
                                        <button key={chip} className="cbot-chip" type="button" onClick={() => sendMessage(chip)}>
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                                <hr className="cbot-divider" />
                                <div className="cbot-row">
                                    <div className="cbot-msg-av"><PELogo size={15} /></div>
                                    <div className="cbot-body">
                                        <div className="cbot-bubble cbot-bot-bubble">{GREETING}</div>
                                        <span className="cbot-time">{greetTime}</span>
                                    </div>
                                </div>
                            </>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`cbot-row ${msg.type === "user" ? "cbot-user-row" : ""}`}>
                                {msg.type === "bot" && (
                                    <div className="cbot-msg-av"><PELogo size={15} /></div>
                                )}
                                <div className="cbot-body">
                                    {msg.isError ? (
                                        <div className="cbot-error">
                                            <p className="cbot-err-title">⚠️ Something went wrong</p>
                                            <p className="cbot-err-sub">Our AI is temporarily unavailable.</p>
                                            <div className="cbot-err-actions">
                                                <a href="tel:+919240251266" className="cbot-err-call">📞 +91 92402 51266</a>
                                                <a href="mailto:itsupport@pockitengineers.com" className="cbot-err-email">✉ Email</a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className={`cbot-bubble ${msg.type === "user" ? "cbot-user-bubble" : "cbot-bot-bubble"}`}
                                            style={{
                                                background:
                                                    msg.type === "user"
                                                        ? theme === THEMES.dark ? "#ea580c" : "#3b3fa8"
                                                        : "#f3f4f6",
                                            }}
                                        >
                                            {msg.text}
                                            {/* Blinking cursor while token-streaming */}
                                            {msg.isStreaming && (
                                                <span
                                                    aria-hidden
                                                    style={{
                                                        display: 'inline-block',
                                                        width: 2,
                                                        height: '1em',
                                                        background: '#6b7280',
                                                        marginLeft: 2,
                                                        verticalAlign: 'middle',
                                                        animation: 'cbot-blink 0.8s step-start infinite',
                                                    }}
                                                />
                                            )}
                                        </div>
                                    )}

                                    {/* Service card */}
                                    {msg.type === "bot" && !msg.isError && msg.service && (
                                        <div className="cbot-service-card">
                                            <div className="cbot-sc-head">
                                                <span>{msg.service.name}</span>
                                                <span>ID #{msg.service.id}</span>
                                            </div>
                                            <div className="cbot-sc-body">
                                                {msg.service.price && <span className="cbot-sc-price">{msg.service.price}</span>}
                                                {msg.service.duration && <span className="cbot-tag cbot-tag-blue">⏱ {msg.service.duration}</span>}
                                                {msg.service.mode && <span className={`cbot-tag ${msg.service.mode.includes("Remote") ? "cbot-tag-blue" : "cbot-tag-orange"}`}>{msg.service.mode}</span>}
                                                {msg.service.warranty && <span className="cbot-tag cbot-tag-green">✓ {msg.service.warranty}</span>}
                                            </div>
                                            <div className="cbot-sc-foot">
                                                <a className="cbot-book-btn" href={`/book?serviceId=${msg.service.id}`}>Book Now →</a>
                                            </div>
                                        </div>
                                    )}

                                    {/* Human handoff */}
                                    {msg.type === "bot" && !msg.isError && msg.showHumanHandoff && (
                                        <div className="cbot-handoff">
                                            <div>
                                                <p className="cbot-ho-title">Need a human? We are here!</p>
                                                <p className="cbot-ho-hours">Mon–Sun · 10 AM–7 PM</p>
                                            </div>
                                            <div className="cbot-ho-btns">
                                                <a href="tel:+919240251266" className="cbot-ho-call">📞 Call</a>
                                                <a href="mailto:itsupport@pockitengineers.com" className="cbot-ho-email">✉ Email</a>
                                            </div>
                                        </div>
                                    )}

                                    <span className={`cbot-time ${msg.type === "user" ? "cbot-time-r" : ""}`}>{msg.time}</span>
                                </div>

                                {msg.type === "user" && (
                                    <div
                                        className="cbot-msg-av cbot-user-av"
                                        style={{
                                            background: theme === THEMES.dark ? "#ea580c" : "#3b3fa8",
                                            color: "white",
                                        }}
                                    >
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Loading indicator (REST path or pre-first-token) */}
                        {isLoading && !isStreamingRef.current && (
                            <div className="cbot-row">
                                <div className="cbot-msg-av"><PELogo size={15} /></div>
                                <div className="cbot-body">
                                    <div className="cbot-bubble cbot-bot-bubble">
                                        <div className="cbot-typing"><span /><span /><span /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Follow-up chips */}
                        {!isLoading && followUpChips.length > 0 && (
                            <div className="cbot-followup">
                                {followUpChips.map(chip => (
                                    <button key={chip} className="cbot-chip cbot-chip-sm" type="button" onClick={() => sendMessage(chip)}>
                                        {chip}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Input ── */}
                    <div className="cbot-input-area">
                        {isListening && (
                            <div className="cbot-listening">
                                <span className="cbot-l-dot" /> Listening...
                            </div>
                        )}
                        <div className="cbot-input-row">
                            <input
                                className="cbot-input"
                                type="text"
                                value={inputText}
                                onChange={e => setInputText(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && !isLoading && sendMessage()}
                                placeholder={isListening ? "Listening..." : "Describe your issue..."}
                                disabled={isLoading}
                            />
                            <div className="cbot-input-btns">
                                {speechSupported && (
                                    <button
                                        className={`cbot-icon-btn cbot-mic ${isListening ? "active" : ""}`}
                                        type="button"
                                        onClick={toggleListening}
                                        disabled={isLoading}
                                    >
                                        {isListening
                                            ? <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2" /></svg>
                                            : <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm7 10a1 1 0 0 1 1 1 8 8 0 0 1-7 7.938V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-1.062A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 1 0 12 0 1 1 0 0 1 1-1z" /></svg>
                                        }
                                    </button>
                                )}
                                <button
                                    className="cbot-icon-btn cbot-send"
                                    type="button"
                                    onClick={() => sendMessage()}
                                    disabled={isLoading || !inputText.trim()}
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Footer ── */}
                    <div className="cbot-footer">
                        <Image
                            src={theme === THEMES.dark ? "/svg/orange_chat_icon.svg" : "/svg/Blue_chat_icon.svg"}
                            alt="Pockit Engineers"
                            width={30}
                            height={30}
                            priority
                        />
                        <span className="cbot-footer-txt">chip.ai by Pockit · Powered by AI</span>
                    </div>
                </div>
            )}

            {/* ── FAB ── */}
            {!isOpen && mounted && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    onMouseEnter={() => setExpanded(true)}
                    onMouseLeave={() => setExpanded(false)}
                    className="fixed bottom-20 right-6 z-50"
                >
                    <button
                        onClick={toggleChat}
                        className="flex items-center gap-0 text-white font-semibold shadow-2xl transition-all duration-300"
                        style={{
                            padding: isMobile ? "0px 0px" : expanded ? "0px 8px" : "0px 1px",
                            borderRadius: 9999,
                            background: theme === THEMES.dark
                                ? "linear-gradient(135deg, #ed793a, #ea580c)"
                                : "linear-gradient(135deg, #0d129c, #3b3fa8)",
                            boxShadow: theme === THEMES.dark
                                ? "0 8px 32px rgba(237, 121, 58, 0.45), 0 0 0 4px rgba(237, 121, 58, 0.08)"
                                : "0 8px 32px rgba(13, 18, 156, 0.45), 0 0 0 4px rgba(13, 18, 156, 0.08)"
                        }}
                    >
                        <Image
                            src={theme === THEMES.dark ? "/svg/orange_chat_icon.svg" : "/svg/Blue_chat_icon.svg"}
                            alt="chip.ai"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                        <AnimatePresence mode="wait">
                            {(expanded && !isMobile) && (
                                <motion.span
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[14px] whitespace-nowrap overflow-hidden"
                                >
                                    Chat with chip.ai
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </button>
                </motion.div>
            )}

            {/* ── Global keyframe for streaming cursor ── */}
            <style>{`
                @keyframes cbot-blink {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0; }
                }
            `}</style>
        </div>
    );
}