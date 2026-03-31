"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useBookServiceNav } from "@/hooks/useBookServiceNav";

export default function StickyBookCTA() {
    const [visible, setVisible] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const isMobile = useIsMobile();
    const onBookService = useBookServiceNav();

    useScrollTop((scrollTop, el) => {
        const isNearBottom = el.scrollHeight - scrollTop - el.clientHeight < 300;
        setVisible(scrollTop > 600 && !isNearBottom);
    });

    const showLabel = expanded || isMobile;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    onMouseEnter={() => setExpanded(true)}
                    onMouseLeave={() => setExpanded(false)}
                    className="fixed bottom-6 right-6 z-50"
                >
                    <Link
                        href="/#download"
                        onClick={onBookService}
                        className="flex items-center gap-2 text-white font-semibold shadow-2xl transition-all duration-300"
                        style={{
                            padding: showLabel ? "12px 24px" : "14px",
                            borderRadius: 9999,
                            background: "linear-gradient(135deg, rgb(var(--accent-primary)), rgb(var(--accent-primary-end)))",
                            boxShadow: "0 8px 32px rgb(var(--accent-primary) / 0.45), 0 0 0 4px rgb(var(--accent-primary) / 0.08)",
                        }}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                        <AnimatePresence mode="wait">
                            {showLabel && (
                                <motion.span
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: "auto", opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-[14px] whitespace-nowrap overflow-hidden"
                                >
                                    Book a Service
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
