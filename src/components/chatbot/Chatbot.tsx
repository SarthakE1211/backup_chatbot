"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatApiService } from "@/services/chatApiService";
import { ChatApiResponse, ChatMessage } from "@/services/chatbot.models";


const initialChips = [
    "My laptop is slow",
    "Printer not working",
    "WiFi is weak",
    "How much does it cost?",
    "Book a service",
    "What areas do you cover?",
];

const langMap: Record<string, string> = {
    English: "en-IN",
    Hindi: "hi-IN",
    Tamil: "ta-IN",
    Telugu: "te-IN",
};

const normalizeLang = (lang: string) => {
    const map: Record<string, string> = {
        english: "en",
        hindi: "hi",
        tamil: "ta",
        telugu: "te",
    };
    return map[lang.toLowerCase()] || lang.toLowerCase();
};

const getTime = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const computeGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return { text: "Good Morning", emoji: "🌅" };
    if (h >= 12 && h < 17) return { text: "Good Afternoon", emoji: "☀️" };
    if (h >= 17 && h < 21) return { text: "Good Evening", emoji: "🌇" };
    return { text: "Good Night", emoji: "🌙" };
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
    const [lang, setLang] = useState("English");
    const [greeting] = useState(() => computeGreeting());

    const scrollToBottomRef = useRef(false);
    const messagesAreaRef = useRef<HTMLDivElement>(null);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        if (scrollToBottomRef.current && messagesAreaRef.current) {
            const el = messagesAreaRef.current;
            el.scrollTop = el.scrollHeight;
            scrollToBottomRef.current = false;
        }
    }, [messages]);

    useEffect(() => {
        return () => {
            if (recognitionRef.current) recognitionRef.current.stop?.();
        };
    }, []);

    const toggleChat = () => {
        if (!isOpen) setHasOpened(true);
        setIsOpen(prev => !prev);
        if (!isOpen) {
            scrollToBottomRef.current = true;
        }
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop?.();
            setIsListening(false);
            return;
        }

        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) return;

        const recognition = new SR();
        recognition.lang = langMap[lang] || "en-IN";
        recognition.interimResults = true;
        recognition.continuous = false;

        recognition.onstart = () => setIsListening(true);

        recognition.onresult = (e: any) => {
            const transcript = Array.from(e.results)
                .map((r: any) => r[0].transcript)
                .join("");
            setInputText(transcript);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognition.start();

        recognitionRef.current = recognition;
    };

    const sendMessage = useCallback(
        async (overrideText?: string) => {
            const text = (overrideText !== undefined ? overrideText : inputText).trim();
            if (!text) return;

            const userMessage: ChatMessage = {
                type: "user",
                text,
                time: getTime(),
            };

            setMessages(prev => [...prev, userMessage]);
            setInputText("");
            setFollowUpChips([]);
            setIsLoading(true);
            scrollToBottomRef.current = true;

            const currentHistory = [...messages, userMessage]
                .slice(-6)
                .map(m => ({ type: m.type, text: m.text }));

            try {
                const parsed = await ChatApiService.getResponse(text, lang, currentHistory);

                const botMessage: ChatMessage = {
                    type: "bot",
                    text: parsed.message || "Sorry, I couldn't get a response.",
                    service: parsed.service ?? null,
                    showHumanHandoff: !!parsed.showHumanHandoff,
                    isError: false,
                    time: getTime(),
                };

                setMessages(prev => [...prev, botMessage]);
                setFollowUpChips(parsed.followUpChips ?? []);
            } catch (err) {
                console.error("[Chatbot] error", err);
                setMessages(prev => [...prev, { type: "bot", text: "", isError: true, time: getTime() }]);
                setFollowUpChips(["Call support", "Send email", "Try again"]);
            } finally {
                setIsLoading(false);
                scrollToBottomRef.current = true;
            }
        },
        [inputText, lang, messages]
    );

    const controlLabel = isListening ? "Listening..." : "Describe your issue...";

    return (
        <div className="chatbot-wrapper" aria-live="polite">
            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-header-left">
                            <div className="avatar-wrap">
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 64 64" fill="currentColor">
                                    <rect x="30" y="2" width="4" height="8" rx="2" />
                                    <circle cx="32" cy="2" r="3" />
                                    <rect x="12" y="10" width="40" height="28" rx="8" />
                                    <circle cx="23" cy="24" r="5" fill="white" />
                                    <circle cx="41" cy="24" r="5" fill="white" />
                                    <circle cx="24" cy="24" r="2.5" fill="#3b82f6" />
                                    <circle cx="42" cy="24" r="2.5" fill="#3b82f6" />
                                    <rect x="22" y="32" width="20" height="3" rx="1.5" fill="white" opacity="0.8" />
                                    <rect x="28" y="38" width="8" height="5" rx="2" />
                                    <rect x="14" y="43" width="36" height="18" rx="6" />
                                    <rect x="20" y="49" width="8" height="6" rx="2" fill="white" opacity="0.3" />
                                    <rect x="36" y="49" width="8" height="6" rx="2" fill="white" opacity="0.3" />
                                </svg>
                                <span className="online-dot" />
                            </div>
                            <div>
                                <div className="brand-name">Pockit Engineers</div>
                                <div className="brand-badge">● Fast Fix Guaranteed</div>
                            </div>
                        </div>
                        <button className="btn-close" onClick={toggleChat} aria-label="Close chat">
                            ✕
                        </button>
                    </div>

                    <div className="messages-area" ref={messagesAreaRef}>
                        {messages.length === 0 && (
                            <div className="empty-state">
                                <div className="greeting-emoji">{greeting.emoji}</div>
                                <h2>{greeting.text}!</h2>
                                <p>I am your Pockit Engineers assistant. How can I help fix your tech today?</p>
                                <div className="chips-grid">
                                    {initialChips.map(chip => (
                                        <button key={chip} className="chip" type="button" onClick={() => sendMessage(chip)}>
                                            {chip}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.length > 0 && (
                            <>
                                {messages.map((msg, index) => (
                                    <div key={`${msg.type}-${index}-${msg.time}`} className={`msg-row ${msg.type === "user" ? "user-row" : ""}`}>
                                        {msg.type === "bot" && (
                                            <div className="msg-avatar bot-av" aria-hidden="true">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 64 64" fill="white">
                                                    <rect x="12" y="10" width="40" height="28" rx="8" />
                                                    <circle cx="23" cy="24" r="5" fill="rgba(255,255,255,0.8)" />
                                                    <circle cx="41" cy="24" r="5" fill="rgba(255,255,255,0.8)" />
                                                    <circle cx="24" cy="24" r="2.5" fill="#3b82f6" />
                                                    <circle cx="42" cy="24" r="2.5" fill="#3b82f6" />
                                                    <rect x="22" y="32" width="20" height="3" rx="1.5" fill="white" opacity="0.8" />
                                                    <rect x="28" y="38" width="8" height="5" rx="2" />
                                                    <rect x="14" y="43" width="36" height="18" rx="6" />
                                                </svg>
                                            </div>
                                        )}

                                        <div className="msg-body">
                                            {msg.isError && (
                                                <div className="error-banner">
                                                    <div className="err-title">⚠️ Something went wrong</div>
                                                    <div className="err-sub">Our AI is temporarily unavailable. Reach us directly:</div>
                                                    <div className="error-actions">
                                                        <a href="tel:+919240251266" className="btn-err-call">📞 +91 92402 51266</a>
                                                        <a href="mailto:itsupport@pockitengineers.com" className="btn-err-email">✉ Email us</a>
                                                    </div>
                                                </div>
                                            )}

                                            {!msg.isError && (
                                                <div className={`msg-bubble ${msg.type === "user" ? "user-bubble" : "bot-bubble"}`}>
                                                    {msg.text}
                                                </div>
                                            )}

                                            {msg.type === "bot" && !msg.isError && msg.service && (
                                                <div className="service-card">
                                                    <div className="service-card-header">
                                                        <span>{msg.service.name}</span>
                                                        <span>ID #{msg.service.id}</span>
                                                    </div>
                                                    <div className="service-card-body">
                                                        {msg.service.price && <span className="service-price">{msg.service.price}</span>}
                                                        {msg.service.duration && <span className="tag blue">⏱ {msg.service.duration}</span>}
                                                        {msg.service.mode && (
                                                            <span className={`tag ${msg.service.mode.includes("Remote") ? "blue" : "orange"}`}>
                                                                {msg.service.mode}
                                                            </span>
                                                        )}
                                                        {msg.service.warranty && <span className="tag green">✓ {msg.service.warranty}</span>}
                                                    </div>
                                                    <div className="service-card-footer">
                                                        <a className="book-btn" href={`/book?serviceId=${msg.service.id}`}>Book Now →</a>
                                                    </div>
                                                </div>
                                            )}

                                            {msg.type === "bot" && !msg.isError && msg.showHumanHandoff && (
                                                <div className="handoff-banner">
                                                    <div>
                                                        <p className="handoff-label">Need a human? We are here!</p>
                                                        <p className="handoff-hours">Mon–Sun · 10 AM–7 PM</p>
                                                    </div>
                                                    <div className="handoff-actions">
                                                        <a href="tel:+919240251266" className="btn-call">📞 Call</a>
                                                        <a href="mailto:itsupport@pockitengineers.com" className="btn-email">✉ Email</a>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="msg-time">{msg.time}</div>
                                        </div>

                                        {msg.type === "user" && <div className="msg-avatar user-av" aria-hidden="true">👤</div>}
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="msg-row">
                                        <div className="msg-avatar bot-av" aria-hidden="true">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 64 64" fill="white">
                                                <rect x="12" y="10" width="40" height="28" rx="8" />
                                                <rect x="14" y="43" width="36" height="18" rx="6" />
                                            </svg>
                                        </div>
                                        <div className="msg-body">
                                            <div className="msg-bubble bot-bubble">
                                                <div className="typing-dots">
                                                    <span />
                                                    <span />
                                                    <span />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {!isLoading && followUpChips.length > 0 && (
                                    <div className="chips-grid follow-up-chips">
                                        {followUpChips.map(chip => (
                                            <button key={chip} className="chip purple-chip" type="button" onClick={() => sendMessage(chip)}>
                                                {chip}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="input-area">
                        {isListening && (
                            <div className="listening-label">
                                <span className="listening-dot" /> Listening...
                            </div>
                        )}
                        <input
                            className="chat-input"
                            type="text"
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && sendMessage()}
                            placeholder={controlLabel}
                            disabled={isLoading}
                        />
                        <div className="input-actions">
                            {speechSupported && (
                                <button
                                    className={`btn-icon btn-mic ${isListening ? "listening" : ""}`}
                                    type="button"
                                    onClick={toggleListening}
                                    disabled={isLoading}
                                    title={isListening ? "Stop" : "Voice input"}
                                >
                                    {isListening ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <rect x="6" y="6" width="12" height="12" rx="2" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2zm7 8a1 1 0 0 1 1 1 8 8 0 0 1-7 7.938V21h2a1 1 0 1 1 0 2H9a1 1 0 1 1 0-2h2v-1.062A8 8 0 0 1 4 12a1 1 0 1 1 2 0 6 6 0 1 0 12 0 1 1 0 0 1 1-1z" />
                                        </svg>
                                    )}
                                </button>
                            )}
                            <button
                                className="btn-icon btn-send"
                                type="button"
                                onClick={() => sendMessage()}
                                disabled={isLoading || !inputText.trim()}
                            >
                                ➤
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="toggle-btn-wrap">
                {!isOpen && <span className="ping-ring" />}
                {!isOpen && <span className="ping-ring-2" />}
                {!isOpen && !hasOpened && <span className="notification-dot">1</span>}
                <button className={`btn-toggle ${isOpen ? "open" : ""}`} type="button" onClick={toggleChat} aria-label={isOpen ? "Close chatbot" : "Open chatbot"}>
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 64 64" fill="currentColor">
                            <rect x="30" y="2" width="4" height="8" rx="2" />
                            <circle cx="32" cy="2" r="3" />
                            <rect x="12" y="10" width="40" height="28" rx="8" />
                            <circle cx="23" cy="24" r="5" fill="white" />
                            <circle cx="41" cy="24" r="5" fill="white" />
                            <circle cx="24" cy="24" r="2.5" fill="#3b82f6" />
                            <circle cx="42" cy="24" r="2.5" fill="#3b82f6" />
                            <rect x="22" y="32" width="20" height="3" rx="1.5" fill="white" opacity="0.8" />
                            <rect x="28" y="38" width="8" height="5" rx="2" />
                            <rect x="14" y="43" width="36" height="18" rx="6" />
                            <rect x="20" y="49" width="8" height="6" rx="2" fill="white" opacity="0.3" />
                            <rect x="36" y="49" width="8" height="6" rx="2" fill="white" opacity="0.3" />
                        </svg>
                    )}
                </button>
            </div>
        </div>
    );
}
