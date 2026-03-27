"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import { EXPERT_HERO, EXPERT_BELOW, EXPERT_PAGE_UC } from "@/constants/copy";

export default function ExpertHero() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleJoinClick = () => {
        const message = "Hi, I want to connect and know more about Pockit Engineers";
        const encoded = encodeURIComponent(message);
        const url = `${EXPERT_HERO.ctaHref}?text=${encoded}`;
        window.open(url, "_blank");
    };

    const { hero, stats, sectionNav, categories, howItWorks, howToJoin, ctaBand, faqs } = EXPERT_PAGE_UC;

    const pockitIdx = hero.headline.indexOf("Pockit");
    const headlineParts =
        pockitIdx >= 0
            ? {
                  before: hero.headline.slice(0, pockitIdx + 4),
                  it: hero.headline.slice(pockitIdx + 4, pockitIdx + 6),
                  after: hero.headline.slice(pockitIdx + 6),
              }
            : null;

    return (
        <div
            className="relative"
            style={{
                background: "rgb(var(--bg-secondary))",
            }}
        >
            {/* ── Hero: UC-style split (light band + headline left / visual right) ── */}
            <section
                className="relative overflow-hidden border-b pt-[5.25rem] pb-14 sm:pt-28 sm:pb-16 lg:pt-32 lg:pb-20"
                style={{
                    borderColor: "rgb(var(--text-muted) / 0.08)",
                    background: "linear-gradient(180deg, rgb(var(--bg-primary)) 0%, rgb(var(--bg-secondary)) 100%)",
                }}
            >
                <div className="relative mx-auto grid w-[92%] max-w-6xl gap-12 lg:w-[88%] lg:grid-cols-2 lg:items-center lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45 }}
                        className="text-center lg:text-left"
                    >
                        <h1
                            className="text-balance text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem] xl:leading-[1.05]"
                            style={{
                                fontFamily: "'Plus Jakarta Sans', sans-serif",
                                color: "rgb(var(--text-primary) / 0.95)",
                            }}
                        >
                            {headlineParts ? (
                                <>
                                    {headlineParts.before}
                                    <span className="text-theme-accent">{headlineParts.it}</span>
                                    {headlineParts.after}
                                </>
                            ) : (
                                hero.headline
                            )}
                        </h1>
                        <p
                            className="mx-auto mt-6 max-w-xl text-xl font-semibold leading-snug sm:text-2xl lg:mx-0"
                            style={{ color: "rgb(var(--text-primary) / 0.88)" }}
                        >
                            {hero.tagline}
                        </p>
                        <p
                            className="mx-auto mt-5 max-w-xl text-base leading-relaxed sm:text-lg lg:mx-0"
                            style={{ color: "rgb(var(--text-primary) / 0.72)" }}
                        >
                            {hero.body}
                        </p>
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start">
                            {["No chasing", "No uncertainty", "No middlemen"].map((item) => (
                                <span
                                    key={item}
                                    className="rounded-full border px-3.5 py-1.5 text-xs font-semibold sm:text-sm"
                                    style={{
                                        borderColor: "rgb(var(--card-border) / 0.45)",
                                        background: "rgb(var(--bg-primary) / 0.9)",
                                        color: "rgb(var(--text-primary) / 0.78)",
                                    }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row lg:items-center lg:justify-start">
                            <div className="flex items-center">
                                {[
                                    { src: "/avatars/cartoon-1.svg", alt: "Cartoon expert avatar 1" },
                                    { src: "/avatars/cartoon-2.svg", alt: "Cartoon expert avatar 2" },
                                    { src: "/avatars/cartoon-3.svg", alt: "Cartoon expert avatar 3" },
                                ].map((avatar, idx) => (
                                    <div
                                        key={avatar.alt}
                                        className={`relative h-11 w-11 overflow-hidden rounded-full border-2 ${idx === 0 ? "" : "-ml-2.5"}`}
                                        style={{
                                            borderColor: "rgb(var(--bg-primary))",
                                            boxShadow: "0 4px 14px rgb(0 0 0 / 0.15)",
                                        }}
                                    >
                                        <Image
                                            src={avatar.src}
                                            alt={avatar.alt}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-center sm:text-left">
                                <div className="flex items-center justify-center gap-1 sm:justify-start">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-4 w-4"
                                            style={{ color: "#FACC15", fill: "#FACC15" }}
                                            strokeWidth={1.8}
                                        />
                                    ))}
                                </div>
                                <p
                                    className="mt-1 text-sm font-medium sm:text-[15px]"
                                    style={{ color: "rgb(var(--text-primary) / 0.8)" }}
                                >
                                    4.75 from 300+ professionals
                                </p>
                            </div>
                        </div>
                        <div className="mt-8 flex justify-center lg:justify-start">
                            <button
                                type="button"
                                onClick={handleJoinClick}
                                className="rounded-2xl px-10 py-3.5 text-base font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99]"
                                style={{
                                    background:
                                        "linear-gradient(135deg, rgb(var(--accent-primary)) 0%, rgb(var(--accent-secondary)) 100%)",
                                    boxShadow: "0 10px 28px rgb(var(--accent-primary) / 0.35)",
                                }}
                            >
                                {hero.cta}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.05 }}
                        className="relative mx-auto w-full max-w-md lg:max-w-none"
                    >
                        <div
                            className="absolute left-1/2 top-[52%] h-[min(100%,420px)] w-[min(92%,380px)] -translate-x-1/2 -translate-y-1/2 rounded-full sm:h-[420px] sm:w-[380px]"
                            style={{
                                background:
                                    "linear-gradient(160deg, rgb(var(--accent-primary) / 0.42) 0%, rgb(var(--accent-secondary) / 0.68) 52%, rgb(var(--accent-primary)) 100%)",
                            }}
                        />
                        <Image
                            src="/images/join_us_illustration.png"
                            alt="IT expert working at dual monitors"
                            width={1024}
                            height={768}
                            className="relative z-[1] mx-auto h-auto w-full max-w-[420px] object-contain object-bottom"
                            priority
                        />
                    </motion.div>
                </div>
            </section>

            {/* ── Stats strip (UC-style 3 KPIs) ── */}
            <section
                className="border-b py-8 sm:py-10"
                style={{
                    borderColor: "rgb(var(--text-muted) / 0.08)",
                    background: "rgb(var(--bg-secondary))",
                }}
            >
                <div className="mx-auto grid w-[92%] max-w-6xl gap-8 sm:grid-cols-3 lg:w-[88%]">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p
                                className="text-2xl font-bold sm:text-3xl"
                                style={{ color: "rgb(var(--text-primary))" }}
                            >
                                {s.value}
                            </p>
                            <p
                                className="mt-1 text-sm sm:text-base"
                                style={{ color: "rgb(var(--text-primary) / 0.65)" }}
                            >
                                {s.label}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── In-page section nav (How it works / How to join / FAQs) ── */}
            <section
                className="sticky top-[68px] z-20 border-b py-3 backdrop-blur-md sm:py-4"
                style={{
                    borderColor: "rgb(var(--text-muted) / 0.08)",
                    background: "rgb(var(--bg-secondary) / 0.92)",
                }}
            >
                <div className="mx-auto flex w-[92%] max-w-6xl flex-wrap items-center justify-center gap-2 sm:gap-3 lg:w-[88%]">
                    {sectionNav.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => scrollTo(item.id)}
                            className="rounded-full border px-4 py-2 text-sm font-semibold transition hover:brightness-110"
                            style={{
                                borderColor: "rgb(var(--card-border) / 0.5)",
                                background: "rgb(var(--bg-primary) / 0.95)",
                                color: "rgb(var(--text-primary) / 0.8)",
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </section>

            {/* ── Categories (UC “Join us in following categories”) ── */}
            <section
                id="categories"
                className="scroll-mt-28 border-b py-14 sm:py-16 lg:py-20"
                style={{
                    borderColor: "rgb(var(--text-muted) / 0.08)",
                    background: "rgb(var(--bg-secondary))",
                }}
            >
                <div className="mx-auto w-[92%] max-w-6xl lg:w-[88%]">
                    <h2
                        className="text-center text-2xl font-bold sm:text-3xl"
                        style={{ color: "rgb(var(--text-primary))" }}
                    >
                        {categories.title}
                    </h2>
                    <div className="mx-auto mt-10 max-w-6xl">
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            {categories.items.map((it) => (
                                <div
                                    key={it.title}
                                    className="rounded-2xl border p-5 sm:p-6"
                                    style={{
                                        borderColor: "rgb(var(--card-border) / 0.45)",
                                        background: "rgb(var(--bg-primary) / 0.96)",
                                    }}
                                >
                                    <h3
                                        className="text-base font-semibold sm:text-lg"
                                        style={{ color: "rgb(var(--text-primary))" }}
                                    >
                                        {it.title}
                                    </h3>
                                    <p
                                        className="mt-2 text-xs leading-relaxed sm:text-sm"
                                        style={{ color: "rgb(var(--text-primary) / 0.72)" }}
                                    >
                                        {it.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── How it works (UC “How Urban Company Works”) ── */}
            <section
                id="how-it-works"
                className="scroll-mt-28 border-b py-14 sm:py-16 lg:py-20"
                style={{
                    borderColor: "rgb(var(--text-muted) / 0.08)",
                    background: "rgb(var(--bg-primary))",
                }}
            >
                <div className="mx-auto w-[92%] max-w-6xl lg:w-[88%]">
                    <h2
                        className="text-center text-2xl font-bold sm:text-3xl"
                        style={{ color: "rgb(var(--text-primary))" }}
                    >
                        {howItWorks.title}
                    </h2>
                    <div className="mt-10 grid gap-5 sm:grid-cols-2">
                        {howItWorks.steps.map((step, i) => (
                            <div
                                key={step.title}
                                className="rounded-2xl border p-6 sm:p-7"
                                style={{
                                    borderColor: "rgb(var(--card-border) / 0.45)",
                                    background: "rgb(var(--bg-secondary) / 0.6)",
                                }}
                            >
                                <span
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgb(var(--accent-primary)) 0%, rgb(var(--accent-secondary)) 100%)",
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <h3
                                    className="mt-4 text-lg font-bold"
                                    style={{ color: "rgb(var(--text-primary))" }}
                                >
                                    {step.title}
                                </h3>
                                <p
                                    className="mt-2 text-sm leading-relaxed sm:text-base"
                                    style={{ color: "rgb(var(--text-primary) / 0.7)" }}
                                >
                                    {step.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How to join (UC “Join UC in 3 easy steps”) ── */}
            <section
                id="how-to-join"
                className="scroll-mt-28 border-b py-14 sm:py-16 lg:py-20"
                style={{
                    borderColor: "rgb(var(--text-muted) / 0.08)",
                    background: "rgb(var(--bg-secondary))",
                }}
            >
                <div className="mx-auto w-[92%] max-w-6xl lg:w-[88%]">
                    <h2
                        className="text-center text-2xl font-bold sm:text-3xl"
                        style={{ color: "rgb(var(--text-primary))" }}
                    >
                        {howToJoin.title}
                    </h2>
                    <div className="mx-auto mt-10 max-w-3xl space-y-6">
                        {howToJoin.steps.map((step, i) => (
                            <div
                                key={step.title}
                                className="flex gap-4 rounded-2xl border p-6 sm:p-7"
                                style={{
                                    borderColor: "rgb(var(--card-border) / 0.45)",
                                    background: "rgb(var(--bg-primary) / 0.95)",
                                }}
                            >
                                <div
                                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg font-bold text-white"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgb(var(--accent-primary)) 0%, rgb(var(--accent-secondary)) 100%)",
                                    }}
                                >
                                    {i + 1}
                                </div>
                                <div>
                                    <h3
                                        className="text-lg font-bold"
                                        style={{ color: "rgb(var(--text-primary))" }}
                                    >
                                        {step.title}
                                    </h3>
                                    <p
                                        className="mt-1 text-sm leading-relaxed sm:text-base"
                                        style={{ color: "rgb(var(--text-primary) / 0.7)" }}
                                    >
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mid-page CTA band (UC “Join 50,000+ other partners”) ── */}
            <section
                className="border-b py-14 sm:py-16"
                style={{
                    borderColor: "rgb(var(--text-muted) / 0.08)",
                    background: "linear-gradient(180deg, rgb(var(--bg-primary)) 0%, rgb(var(--bg-secondary)) 100%)",
                }}
            >
                <div className="mx-auto grid w-[92%] max-w-6xl gap-8 text-center lg:w-[88%] lg:grid-cols-[1fr_auto] lg:items-center lg:text-left">
                    <div>
                        <h2
                            className="text-2xl font-bold sm:text-3xl"
                            style={{ color: "rgb(var(--text-primary))" }}
                        >
                            {ctaBand.title}
                        </h2>
                        <div className="mt-4">
                            <span
                                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold sm:text-base"
                                style={{
                                    borderColor: "rgb(var(--accent-primary) / 0.35)",
                                    background: "rgb(var(--accent-primary) / 0.12)",
                                    color: "rgb(var(--accent-primary))",
                                }}
                            >
                                <span
                                    className="h-2.5 w-2.5 rounded-full"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgb(var(--accent-primary)) 0%, rgb(var(--accent-secondary)) 100%)",
                                        boxShadow: "0 0 0 4px rgb(var(--accent-primary) / 0.16)",
                                    }}
                                />
                                {ctaBand.sub}
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-center lg:justify-end">
                        <button
                            type="button"
                            onClick={handleJoinClick}
                            className="rounded-2xl px-10 py-3.5 text-base font-bold text-white shadow-lg transition hover:brightness-110"
                            style={{
                                background:
                                    "linear-gradient(135deg, rgb(var(--accent-primary)) 0%, rgb(var(--accent-secondary)) 100%)",
                                boxShadow: "0 10px 28px rgb(var(--accent-primary) / 0.35)",
                            }}
                        >
                            {ctaBand.cta}
                        </button>
                    </div>
                </div>
            </section>

            {/* ── FAQs (UC-style accordion) ── */}
            <section
                id="expert-faqs"
                className="scroll-mt-28 py-14 sm:py-16 lg:py-20"
                style={{ background: "rgb(var(--bg-secondary))" }}
            >
                <div className="mx-auto w-[92%] max-w-3xl lg:w-[88%]">
                    <h2
                        className="text-center text-2xl font-bold sm:text-3xl"
                        style={{ color: "rgb(var(--text-primary))" }}
                    >
                        FAQs
                    </h2>
                    <div className="mt-8 space-y-3">
                        {faqs.map((item, i) => {
                            const open = openFaq === i;
                            return (
                                <div
                                    key={item.q}
                                    className="overflow-hidden rounded-2xl border"
                                    style={{
                                        borderColor: "rgb(var(--card-border) / 0.45)",
                                        background: "rgb(var(--bg-primary) / 0.95)",
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(open ? null : i)}
                                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6 sm:py-5"
                                    >
                                        <span
                                            className="text-base font-semibold sm:text-lg"
                                            style={{ color: "rgb(var(--text-primary))" }}
                                        >
                                            {item.q}
                                        </span>
                                        <ChevronDown
                                            className={`h-5 w-5 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
                                            style={{ color: "rgb(var(--text-primary) / 0.55)" }}
                                        />
                                    </button>
                                    <AnimatePresence initial={false}>
                                        {open && (
                                            <motion.div
                                                key="faq-answer"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{
                                                    height: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
                                                    opacity: { duration: 0.22 },
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div
                                                    className="border-t px-5 pb-5 pt-0 sm:px-6 sm:pb-6"
                                                    style={{
                                                        borderColor: "rgb(var(--card-border) / 0.35)",
                                                    }}
                                                >
                                                    <p
                                                        className="pt-4 text-sm leading-relaxed sm:text-base"
                                                        style={{ color: "rgb(var(--text-primary) / 0.72)" }}
                                                    >
                                                        {item.a}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Closing (existing brand line) ── */}
            <section
                className="border-t pb-20 pt-6 sm:pb-24 sm:pt-8"
                style={{
                    borderColor: "rgb(var(--text-muted) / 0.08)",
                    background: "rgb(var(--bg-secondary))",
                }}
            >
                <div className="mx-auto max-w-2xl px-4 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45 }}
                        className="mb-4 text-2xl font-bold sm:text-3xl"
                        style={{ color: "rgb(var(--text-primary))" }}
                    >
                        {EXPERT_BELOW.heading}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.45, delay: 0.05 }}
                        className="text-base leading-relaxed sm:text-lg"
                        style={{ color: "rgb(var(--text-primary) / 0.75)" }}
                    >
                        {EXPERT_BELOW.subheading}
                    </motion.p>
                </div>
            </section>
        </div>
    );
}
