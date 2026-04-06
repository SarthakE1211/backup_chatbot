"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatApiService } from "@/services/chatApiService";
import { ChatMessage } from "@/services/chatbot.models";
import Image from "next/image";

const initialChips = [
    "Laptop is slow",
    "PC won't start",
    "Printer not working",
    "MacBook battery issue",
    "CCTV camera offline",

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

    const messagesAreaRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);
    const [theme, setTheme] = useState(THEMES.light);

    useEffect(() => {
        if (typeof window === "undefined") return;

        const saved = localStorage.getItem("pockit-theme");
        const initialTheme = saved || document.documentElement.getAttribute("data-theme") || THEMES.light;

        document.documentElement.setAttribute("data-theme", initialTheme);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme(initialTheme);

        const obs = new MutationObserver(() => {
            setTheme(document.documentElement.getAttribute("data-theme") || THEMES.dark);
        });
        obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        return () => obs.disconnect();
    }, []);


    useEffect(() => {
        if (typeof window !== "undefined") {
            const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            setSpeechSupported(!!SR);
        }
    }, []);

    useEffect(() => {
        if (messagesAreaRef.current) {
            messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
        }
    }, [messages, isLoading, followUpChips]);

    useEffect(() => {
        return () => { if (recognitionRef.current) recognitionRef.current.stop?.(); };
    }, []);

    const toggleChat = () => {
        if (!isOpen) setHasOpened(true);
        setIsOpen((prev) => !prev);
    };

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

    const sendMessage = useCallback(async (overrideText?: string) => {
        const text = (overrideText !== undefined ? overrideText : inputText).trim();
        if (!text) return;
        const userMsg: ChatMessage = { type: "user", text, time: getTime() };
        setMessages((prev) => [...prev, userMsg]);
        setInputText("");
        setFollowUpChips([]);
        setIsLoading(true);
        const history = [...messages, userMsg].slice(-6).map((m) => ({ type: m.type, text: m.text }));
        try {
            const parsed = await ChatApiService.getResponse(text, lang, history);
            setMessages((prev) => [...prev, {
                type: "bot",
                text: parsed.message || "Sorry, I couldn't get a response.",
                service: parsed.service ?? null,
                showHumanHandoff: !!parsed.showHumanHandoff,
                isError: false,
                time: getTime(),
            }]);
            setFollowUpChips(parsed.followUpChips ?? []);
        } catch {
            setMessages((prev) => [...prev, { type: "bot", text: "", isError: true, time: getTime() }]);
            setFollowUpChips(["Call support", "Send email", "Try again"]);
        } finally {
            setIsLoading(false);
        }
    }, [inputText, lang, messages]);

    const PELogo = ({ size = 20 }: { size?: number }) => (
        <Image
            src={
                theme === THEMES.dark
                    ? "/svg/orange_chat_icon.svg"
                    : "/svg/Blue_chat_icon.svg"
            }
            alt="Pockit Engineers"
            width={30}
            height={30}
            // className="w-full h-auto"
            priority
        />
    );

    return (
        <div className={`cbot-wrap ${isOpen ? "is-open" : ""}`}>

            {isOpen && (
                <div className="cbot-window">

                    {/* ── Header ── */}
                    <div
                        className="cbot-header"
                        style={{
                            background: theme === THEMES.dark ? "#ea580c" : "#3b3fa8",
                        }}
                    >                        <div className="cbot-header-left">
                            <div className="cbot-av-outer">
                                {/* <div className="cbot-av-inner"><PELogo size={22} /></div> */}
                                <Image
                                    src={
                                        theme === THEMES.dark
                                            ? "/svg/orange_chat_icon.svg"
                                            : "/svg/Blue_chat_icon.svg"
                                    }
                                    alt="Pockit Engineers"
                                    width={600}
                                    height={168}
                                    className="w-full h-auto"
                                    priority
                                />
                                <span className="cbot-online" />
                            </div>
                            <div>
                                <p className="cbot-name">Chip</p>
                                <p className="cbot-sub">Your Personal Tech Assistant</p>
                            </div>
                        </div>
                        <div className="flex flexdirection-row gap-3">
                            <button className="cbot-close-btn" onClick={() => window.location.reload()} aria-label="Reset">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M21 12a9 9 0 1 1-3-6.7"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                    <polyline
                                        points="21 3 21 9 15 9"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                            <button className="cbot-close-btn" onClick={toggleChat} aria-label="Close">
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
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
                                    {initialChips.map((chip) => (
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
                                            className={`cbot-bubble ${msg.type === "user" ? "cbot-user-bubble" : "cbot-bot-bubble"
                                                }`}
                                            style={{
                                                background:
                                                    msg.type === "user"
                                                        ? theme === THEMES.dark
                                                            ? "#ea580c"
                                                            : "#3b3fa8"
                                                        : theme === THEMES.dark
                                                            ? "#f3f4f6"
                                                            : "#f3f4f6",
                                            }}
                                        >                                            {msg.text}
                                        </div>
                                    )}
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
                                            background:
                                                theme === THEMES.dark ? "#ea580c" : "#3b3fa8",
                                            color: "white",
                                        }}
                                    >                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
                                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="cbot-row">
                                <div className="cbot-msg-av"><PELogo size={15} /></div>
                                <div className="cbot-body">
                                    <div className="cbot-bubble cbot-bot-bubble">
                                        <div className="cbot-typing"><span /><span /><span /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!isLoading && followUpChips.length > 0 && (
                            <div className="cbot-followup">
                                {followUpChips.map((chip) => (
                                    <button key={chip} className="cbot-chip cbot-chip-sm" type="button" onClick={() => sendMessage(chip)}>{chip}</button>
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
                                onChange={(e) => setInputText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
                            src={
                                theme === THEMES.dark
                                    ? "/svg/orange_chat_icon.svg"
                                    : "/svg/Blue_chat_icon.svg"

                            }
                            alt="Pockit Engineers"
                            width={30}
                            height={30}
                            // className="w-full h-auto"
                            priority
                        />
                        <span className="cbot-footer-txt">Chip by Pockit · Powered by AI</span>
                    </div>
                </div>
            )}

            {/* ── FAB ── */}
            <div className="cbot-fab-wrap">
                <div className={`cbot-trigger ${isOpen ? "is-open" : ""}`}>
                    {/* {!isOpen && <span className="cbot-ping" />}
                    {!isOpen && <span className="cbot-ping-2" />} */}
                    {!isOpen && <span className="cbot-fab-label" style={{
                        background: theme === THEMES.dark ? "#ed793a" : "#0d129c",
                        color: "white",
                    }}>Chat with Chip</span>}
                    <div className="cbot-fab-icon-wrap">
                        {!isOpen && <span className="cbot-ping" />}
                        {!isOpen && <span className="cbot-ping-2" />}
                        {!isOpen && !hasOpened && <span className="cbot-notif" style={{
                            background: theme === THEMES.dark ? "#ed793a" : "#0d129c",
                            color: "white",
                        }}>1</span>}
                        <button
                            className={`cbot-fab ${isOpen ? "is-open" : ""}`}
                            type="button"
                            onClick={toggleChat}
                            aria-label={isOpen ? "Close chatbot" : "Open chatbot"}
                            style={{
                                background: theme === THEMES.dark ? "#ed793a" : "#0d129c",
                                color: "white",
                                width: "48px",
                                height: "48px",
                            }}
                        >
                            {isOpen
                                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                : <Image
                                    src={
                                        theme === THEMES.dark
                                            ? "/svg/orange_chat_icon.svg"
                                            : "/svg/Blue_chat_icon.svg"
                                    }
                                    alt="Pockit Engineers"
                                    width={700}
                                    height={730}
                                    className="w-full h-auto"
                                    priority
                                />
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}