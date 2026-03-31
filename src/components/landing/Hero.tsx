"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useTransform, useAnimation, useMotionValue, type Variants } from "framer-motion";
import { useScrollTop } from "@/hooks/useScrollTop";
import { Laptop, Check, Tv } from "lucide-react";
import { HERO } from "@/constants/copy";

const wordVariants: Variants = {
    hidden: { opacity: 0, y: 40, rotateX: -30, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 150,
            damping: 20,
            delay: 0.1 + i * 0.08,
        },
    }),
};

const phoneFloatVariants: Variants = {
    idle: { y: 0 },
    animate: { y: [0, -6, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } },
};
const card0Variants: Variants = {
    idle: { y: 0, x: 0, rotate: 0 },
    animate: {
        y: [0, -6, 0, -3, 0], x: [0, 2, 0, -1, 0], rotate: [0, -1, 0, 0.5, 0],
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0 },
    },
};
const card1Variants: Variants = {
    idle: { y: 0, x: 0, rotate: 0 },
    animate: {
        y: [0, -7, 0, -4, 0], x: [0, -2, 0, 1, 0], rotate: [0, 1, 0, -0.5, 0],
        transition: { duration: 6.4, repeat: Infinity, ease: "easeInOut", delay: 0.3 },
    },
};
const card2Variants: Variants = {
    idle: { y: 0, x: 0, rotate: 0 },
    animate: {
        y: [0, -5, 0, -2, 0], x: [0, -1, 0, 2, 0], rotate: [0, 0.5, 0, -0.5, 0],
        transition: { duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 },
    },
};

const headline = [HERO.headlineLine1, HERO.headlineLine2];

// Shared viewport config for all text-section whileInView elements
const TEXT_VIEWPORT = { once: true, margin: "-10% 0px" } as const;

export default function Hero() {
    const sectionRef = useRef<HTMLElement>(null);
    const scrollProgress = useMotionValue(0);
    const textY = useTransform(scrollProgress, [0, 1], [0, -80]);
    const phoneY = useTransform(scrollProgress, [0, 1], [0, -40]);
    const bgScale = useTransform(scrollProgress, [0, 1], [1, 1.08]);
    const bgOpacity = useTransform(scrollProgress, [0, 0.9], [1, 0.6]);

    const phoneRef = useRef<HTMLDivElement>(null);
    const phoneControls = useAnimation();

    useScrollTop((scrollTop) => {
        const section = sectionRef.current;
        if (!section) return;
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight || 1;
        const raw = (scrollTop - sectionTop) / sectionHeight;
        scrollProgress.set(Math.max(0, Math.min(1, raw)));
    });

    useEffect(() => {
        const el = phoneRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    phoneControls.start("animate");
                } else {
                    phoneControls.stop();
                }
            },
            { rootMargin: "200px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [phoneControls]);

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen overflow-hidden flex items-center bg-theme-bg"
            style={{ background: "linear-gradient(135deg, rgb(var(--bg-primary)) 0%, rgb(var(--bg-secondary)) 50%, rgb(var(--bg-primary)) 100%)" }}
        >
            <motion.div
                style={{ scale: bgScale, opacity: bgOpacity }}
                className="absolute inset-0 pointer-events-none"
            >
                <div className="hidden sm:block absolute top-1/4 right-1/4 w-[700px] h-[700px] bg-theme-accent/5 rounded-full blur-[140px] mix-blend-screen" />
                <div className="hidden sm:block absolute -bottom-32 left-1/4 w-[500px] h-[500px] bg-theme-accent-end/10 rounded-full blur-[120px] mix-blend-screen" />
            </motion.div>

            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(circle at center, rgb(var(--accent-primary) / 0.05) 0%, transparent 60%)" }}
            />

            <div className="relative w-full max-w-[92rem] mx-auto px-6 sm:px-8 lg:px-10 py-20 sm:py-28 lg:py-32 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 lg:gap-24 items-center">
                <motion.div style={{ y: textY }} className="flex flex-col max-w-2xl z-10 mt-6 sm:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        viewport={TEXT_VIEWPORT}
                        transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                        className="inline-flex items-center gap-3 self-start rounded-full bg-theme-accent/10 border border-theme-accent/20 backdrop-blur-md px-4 py-2 mb-8 shadow-[0_0_24px_rgb(var(--accent-primary)/0.15)]"
                    >
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theme-accent opacity-60" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-theme-accent" />
                        </span>
                        <span className="text-xs font-bold text-theme-accent tracking-wide uppercase">{HERO.badge}</span>
                    </motion.div>

                    <h1 className="text-5xl sm:text-7xl lg:text-[88px] font-black tracking-tighter leading-[1.12] text-theme-text mb-6 drop-shadow-sm pb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                        {headline.map((line, li) => (
                            <span key={li} className="block">
                                {line.split(" ").map((word, wi) => (
                                    <motion.span
                                        key={wi}
                                        custom={li * 3 + wi}
                                        variants={wordVariants}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={TEXT_VIEWPORT}
                                        className={`inline-block mr-3 sm:mr-4 pr-1 ${li === 1 ? "text-transparent bg-clip-text bg-gradient-to-br from-theme-accent via-theme-accent to-theme-accent-end pb-1" : ""}`}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={TEXT_VIEWPORT}
                        transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
                        className="text-theme-text/70 text-[17px] sm:text-[20px] max-w-[540px] leading-[1.6] mb-10 sm:mb-12 font-medium"
                    >
                        {HERO.description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={TEXT_VIEWPORT}
                        transition={{ delay: 0.8, type: "spring", stiffness: 150, damping: 20 }}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-12"
                    >
                        <motion.a
                            href="https://play.google.com/store/apps/details?id=com.pockitcust"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3.5 rounded-2xl border border-theme-glass/10 bg-theme-glass/5 backdrop-blur-xl px-6 py-4 hover:border-theme-glass/30 hover:bg-theme-glass/10 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="none">
                                <path d="M3.61 1.814 13.793 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .61-.92Z" fill="#4285F4" />
                                <path d="M17.318 8.5 14.5 10.2 13.793 12l.707 1.8 2.818 1.7 3.186-1.89a1.005 1.005 0 0 0 0-1.72L17.318 8.5Z" fill="#FBBC04" />
                                <path d="m3.61 1.814 10.89 10.186L17.318 8.5 7.236.645A1.01 1.01 0 0 0 3.61 1.814Z" fill="#34A853" />
                                <path d="m3.61 22.186 3.626-1.169 10.082-6.517-2.818-2.5L3.61 22.186Z" fill="#EA4335" />
                            </svg>
                            <div className="flex flex-col leading-tight text-left">
                                <span className="text-[10px] font-semibold text-theme-text/50 uppercase tracking-widest">{HERO.googlePlaySuperLabel}</span>
                                <span className="text-[16px] font-bold text-theme-text mt-0.5">{HERO.googlePlayLabel}</span>
                            </div>
                        </motion.a>

                        <motion.a
                            href="https://apps.apple.com/in/app/pockit/id6745779480"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3.5 rounded-2xl border border-theme-glass/10 bg-theme-glass/5 backdrop-blur-xl px-6 py-4 hover:border-theme-glass/30 hover:bg-theme-glass/10 shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                            <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0" fill="rgb(var(--text-primary))">
                                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11Z" />
                            </svg>
                            <div className="flex flex-col leading-tight text-left">
                                <span className="text-[10px] font-semibold text-theme-text/50 uppercase tracking-widest">{HERO.appStoreSuperLabel}</span>
                                <span className="text-[16px] font-bold text-theme-text mt-0.5">{HERO.appStoreLabel}</span>
                            </div>
                        </motion.a>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={TEXT_VIEWPORT}
                        transition={{ delay: 1.1, duration: 0.8 }}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
                    >
                        <span className="text-[11px] font-bold text-theme-text/40 uppercase tracking-widest whitespace-nowrap">{HERO.nowLiveIn}</span>
                        <div className="flex flex-wrap gap-2">
                            {HERO.cities.map((city, i) => (
                                <motion.span
                                    key={city}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={TEXT_VIEWPORT}
                                    transition={{ delay: 1.2 + i * 0.05, type: "spring", stiffness: 200 }}
                                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-theme-text/80 bg-theme-text/5 border border-theme-text/10 rounded-full px-3 py-1.5 transition-colors hover:bg-theme-text/10"
                                >
                                    {city}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    ref={phoneRef}
                    initial={{ opacity: 0, scale: 0.9, rotateY: -20, y: 100 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                    className="relative isolate flex justify-center items-center z-10 mx-auto lg:mx-0 lg:-translate-x-8 w-[285px] sm:w-[323px] md:w-[361px] lg:w-[380px] mt-12 lg:mt-0 perspective-[1200px]"
                    style={{ y: phoneY, height: "auto" }}
                >
                    <div className="absolute inset-[10%] bg-blue-500/20 dark:bg-blue-400/20 rounded-full blur-[80px]" />
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-12 rounded-[100%] bg-black/40 blur-2xl" />

                    <motion.div
                        className="relative z-10 w-full"
                        animate={phoneControls}
                        variants={phoneFloatVariants}
                    >
                        <div className="relative w-full aspect-[417/845] drop-shadow-[0_32px_64px_rgba(0,0,0,0.15)] sm:drop-shadow-[0_48px_96px_rgba(0,0,0,0.25)]">
                            <Image
                                src="/images/hero_phone.png"
                                alt="Pockit Engineers App"
                                fill
                                priority
                                className="object-contain"
                                sizes="(max-width: 640px) 80vw, 380px"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={false}
                        animate={phoneControls}
                        variants={card0Variants}
                        whileHover={{ scale: 1.05 }}
                        className="absolute z-20 flex items-center gap-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl px-5 py-3.5 shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20 dark:border-white/5 top-[18%] -left-10 md:-left-6 scale-105"
                    >
                        <div className="bg-blue-100 dark:bg-blue-500/20 p-2 rounded-xl text-blue-600 dark:text-blue-400">
                            <Laptop className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-zinc-900 dark:text-white leading-tight">{HERO.floatingCard1Title}</span>
                            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{HERO.floatingCard1Price}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={false}
                        animate={phoneControls}
                        variants={card1Variants}
                        whileHover={{ scale: 1.05 }}
                        className="absolute z-20 flex items-center gap-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl px-5 py-3.5 shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20 dark:border-white/5 top-[30%] -right-8 md:-right-4 scale-105"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-inner">
                            <Check className="h-5 w-5" strokeWidth={3} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-zinc-900 dark:text-white leading-tight">{HERO.floatingCard2Title}</span>
                            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5">{HERO.floatingCard2Subtitle}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={false}
                        animate={phoneControls}
                        variants={card2Variants}
                        whileHover={{ scale: 1.05 }}
                        className="absolute z-20 flex items-center gap-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl px-5 py-3.5 shadow-[0_20px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/20 dark:border-white/5 bottom-[28%] -right-10 md:-right-6 scale-105"
                    >
                        <div className="bg-purple-100 dark:bg-purple-500/20 p-2 rounded-xl text-purple-600 dark:text-purple-400">
                            <Tv className="h-5 w-5" strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-zinc-900 dark:text-white leading-tight">{HERO.floatingCard3Title}</span>
                            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 mt-0.5">{HERO.floatingCard3Price}</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div className="absolute bottom-0 inset-x-0 h-40 pointer-events-none" style={{ background: "linear-gradient(to top, rgb(var(--bg-primary)), transparent)" }} />
        </section>
    );
}
