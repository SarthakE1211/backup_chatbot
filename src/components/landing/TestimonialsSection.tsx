"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import SectionPill from "./SectionPill";
import { TESTIMONIALS_SECTION, REVIEWS, KPI_STATS } from "@/constants/copy";

// ─── Star Rating ─────────────────────────────────────────────────────────────
function Stars({ count = 5 }: { count?: number }) {
    return (
        <div className="flex gap-1">
            {[...Array(count)].map((_, i) => (
                <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-theme-accent">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, size = "md", imageSrc }: { name: string; size?: "sm" | "md"; imageSrc?: string }) {
    const dim = size === "sm" ? "w-9 h-9 text-[13px]" : "w-11 h-11 text-[15px]";
    const [showImage, setShowImage] = useState(Boolean(imageSrc));
    return (
        <>
            {showImage && imageSrc ? (
                <div className={`${dim} relative rounded-full overflow-hidden shrink-0 ring-2 ring-white/10`}>
                    <Image
                        src={imageSrc}
                        alt={name}
                        fill
                        className="object-cover"
                        onError={() => setShowImage(false)}
                        unoptimized
                    />
                </div>
            ) : (
                <div
                    className={`${dim} rounded-full flex items-center justify-center font-black text-white shrink-0 ring-2 ring-white/10`}
                    style={{ background: "linear-gradient(135deg, rgb(var(--accent-primary)), rgb(var(--accent-primary-end)))" }}
                >
                    {name.charAt(0)}
                </div>
            )}
        </>
    );
}

// ─── Large Quote Card (spans 2 rows on desktop) ────────────────────────────
function LargeQuoteCard({ review, delay }: { review: (typeof REVIEWS)[0]; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 md:col-span-5 md:row-span-2 flex flex-col rounded-3xl border p-7 sm:p-8 transition-all duration-300 hover:shadow-lg"
            style={{
                background: "rgb(var(--card-bg))",
                borderColor: "rgb(var(--card-border))",
            }}
        >
            {/* Stars */}
            <Stars />

            {/* Quote */}
            <blockquote
                className="flex-1 mt-6 text-[17px] sm:text-xl font-medium leading-relaxed"
                style={{ color: "rgb(var(--text-primary))" }}
            >
                &ldquo;{review.text}&rdquo;
            </blockquote>

            {/* Author */}
            <div className="flex items-center gap-3 mt-8 pt-6 border-t" style={{ borderColor: "rgb(var(--card-border))" }}>
                <Avatar name={review.name} imageSrc={review.avatar} />
                <div>
                    <p className="text-[14px] font-bold" style={{ color: "rgb(var(--text-primary))" }}>
                        {review.name}
                    </p>
                    <p className="text-[12px]" style={{ color: "rgb(var(--text-primary) / 0.45)" }}>
                        {review.city}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Image Card (spans 2 rows on desktop) ─────────────────────────────────
function ImageCard({ review, delay }: { review: (typeof REVIEWS)[0]; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 md:col-span-4 md:row-span-2 relative rounded-3xl overflow-hidden min-h-[320px] md:min-h-0"
        >
            {/* Background image */}
            <Image
                src="/images/tanya.jpg"
                alt="Happy customer"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Author overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center gap-3">
                <Avatar name={review.name} size="sm" imageSrc={review.avatar} />
                <div>
                    <p className="text-[14px] font-bold text-white">{review.name}</p>
                    <p className="text-[12px] text-white/60">{review.city}</p>
                </div>
            </div>
        </motion.div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
    value,
    suffix,
    label,
    delay,
    illustrationSrc,
    isDarkTheme,
}: {
    value: string;
    suffix: string;
    label: string;
    delay: number;
    illustrationSrc?: string;
    isDarkTheme: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden col-span-6 md:col-span-3 rounded-3xl border p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-md"
            style={{
                background: "rgb(var(--card-bg))",
                borderColor: "rgb(var(--card-border))",
            }}
        >
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background: isDarkTheme
                        ? "radial-gradient(circle at 84% 18%, rgb(var(--accent-primary) / 0.16), transparent 56%)"
                        : "radial-gradient(circle at 84% 18%, rgb(var(--accent-primary) / 0.09), transparent 58%)",
                }}
            />
            {illustrationSrc && (
                <div
                    className="pointer-events-none absolute -right-8 -bottom-8 h-[74%] w-[74%] transition-opacity duration-300"
                    style={{
                        opacity: isDarkTheme ? 0.36 : 0.22,
                        filter: isDarkTheme
                            ? "saturate(1.05) contrast(1.02)"
                            : "grayscale(0.1) saturate(0.9) brightness(0.96)",
                    }}
                    aria-hidden
                >
                    <Image
                        src={illustrationSrc}
                        alt=""
                        fill
                        className="object-contain"
                        unoptimized
                    />
                </div>
            )}
            <div className="relative z-10 flex items-baseline gap-0.5">
                <span
                    className="text-4xl sm:text-5xl font-black tracking-tight"
                    style={{
                        background: "linear-gradient(135deg, rgb(var(--accent-primary)), rgb(var(--accent-primary-end)))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {value}
                </span>
                <span
                    className="text-xl sm:text-2xl font-black"
                    style={{
                        background: "linear-gradient(135deg, rgb(var(--accent-primary)), rgb(var(--accent-primary-end)))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {suffix}
                </span>
            </div>
            <p className="relative z-10 text-[13px] font-medium mt-3" style={{ color: "rgb(var(--text-primary) / 0.5)" }}>
                {label}
            </p>
        </motion.div>
    );
}

// ─── Medium Quote Card (bottom row, spans 9 cols on desktop) ──────────────
function MediumQuoteCard({ review, delay }: { review: (typeof REVIEWS)[0]; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-12 md:col-span-9 rounded-3xl border p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-6 transition-all duration-300 hover:shadow-md"
            style={{
                background: "rgb(var(--card-bg))",
                borderColor: "rgb(var(--card-border))",
            }}
        >
            {/* Author */}
            <div className="flex items-center gap-3 sm:shrink-0">
                <Avatar name={review.name} imageSrc={review.avatar} />
                <div>
                    <p className="text-[14px] font-bold" style={{ color: "rgb(var(--text-primary))" }}>
                        {review.name}
                    </p>
                    <p className="text-[12px]" style={{ color: "rgb(var(--text-primary) / 0.45)" }}>
                        {review.city}
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div
                className="hidden sm:block w-px self-stretch"
                style={{ background: "rgb(var(--card-border))" }}
            />

            {/* Quote */}
            <blockquote
                className="text-[16px] font-medium leading-relaxed"
                style={{ color: "rgb(var(--text-primary))" }}
            >
                &ldquo;{review.text}&rdquo;
            </blockquote>
        </motion.div>
    );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    useEffect(() => {
        const syncTheme = () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "dark-gradient";
            setIsDarkTheme(currentTheme.startsWith("dark"));
        };

        syncTheme();
        const observer = new MutationObserver(syncTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        return () => observer.disconnect();
    }, []);

    // Stat data: pull from KPI_STATS but display as simple strings
    const stats = [
        { value: "10", suffix: " min", label: KPI_STATS.stats[1].label },   // Avg Response Time
        { value: "562", suffix: "", label: KPI_STATS.stats[2].label },      // Verified Technicians
        { value: "10,113", suffix: "", label: KPI_STATS.stats[0].label },   // Customers Served
    ];

    return (
        <section
            id="testimonials"
            className="relative py-24 sm:py-32"
            style={{ background: "linear-gradient(180deg, rgb(var(--bg-primary)) 0%, rgb(var(--bg-secondary)) 50%, rgb(var(--bg-primary)) 100%)" }}
        >
            {/* Top fade */}
            <div
                className="absolute top-0 inset-x-0 h-20 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, rgb(var(--bg-secondary)), transparent)" }}
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section header */}
                <div className="text-center mb-14">
                    <SectionPill label={TESTIMONIALS_SECTION.sectionPill} />
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", color: "rgb(var(--text-primary))" }}
                    >
                        {TESTIMONIALS_SECTION.heading}{" "}
                        <span
                            className="text-transparent bg-clip-text"
                            style={{ backgroundImage: "linear-gradient(135deg, rgb(var(--accent-primary)), rgb(var(--accent-primary-end)))" }}
                        >
                            {TESTIMONIALS_SECTION.headingHighlight}
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-[15px] mt-4 max-w-xl mx-auto"
                        style={{ color: "rgb(var(--text-primary) / 0.5)" }}
                    >
                        {TESTIMONIALS_SECTION.subheading}
                    </motion.p>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-12 grid-rows-[auto_auto] gap-4">
                    {/* Row 1 */}
                    {/* A: Large quote card — spans 5 cols, 2 rows */}
                    <LargeQuoteCard review={REVIEWS[0]} delay={0} />

                    {/* B: Image card — spans 4 cols, 2 rows */}
                    <ImageCard review={REVIEWS[0]} delay={0.1} />

                    {/* C: Stat — 10 min */}
                    <StatCard
                        value={stats[0].value}
                        suffix={stats[0].suffix}
                        label={stats[0].label}
                        delay={0.2}
                        illustrationSrc="/images/AvgResponse_Time.svg"
                        isDarkTheme={isDarkTheme}
                    />

                    {/* D: Stat — 562 */}
                    <StatCard
                        value={stats[1].value}
                        suffix={stats[1].suffix}
                        label={stats[1].label}
                        delay={0.3}
                        illustrationSrc="/images/Verified%20Technicians.svg"
                        isDarkTheme={isDarkTheme}
                    />

                    {/* Row 2 */}
                    {/* E: Stat — 10,113 (sits in right column, row 2, adjacent to image card bottom) */}
                    <StatCard
                        value={stats[2].value}
                        suffix={stats[2].suffix}
                        label={stats[2].label}
                        delay={0.35}
                        isDarkTheme={isDarkTheme}
                    />

                    {/* Empty filler for col alignment on desktop (handled by CSS) */}

                    {/* F: Medium quote card — spans all 12 cols (full width) on mobile, 9 cols on desktop
                        But since A & B occupy cols 1-9 across row 1+2, F fills beneath with span 12 */}
                    <MediumQuoteCard review={REVIEWS[7]} delay={0.4} />
                </div>
            </div>

            {/* Bottom fade */}
            <div
                className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgb(var(--bg-secondary)), transparent)" }}
            />
        </section>
    );
}
