"use client";

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";
import { Users, Clock, BadgeCheck } from "lucide-react";
import SectionPill from "./SectionPill";
import { KPI_STATS } from "@/constants/copy";

interface CounterProps {
    target: number;
    suffix: string;
    label: string;
    icon: React.ReactNode;
    delay: number;
    inView: boolean;
}

function Counter({ target, suffix, label, icon, delay, inView }: CounterProps) {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (v) => {
        if (target >= 1000) return Math.round(v).toLocaleString("en-IN");
        return Math.round(v).toString();
    });

    useEffect(() => {
        if (!inView) return;
        const controls = animate(count, target, {
            duration: 2,
            delay,
            ease: [0.22, 1, 0.36, 1],
        });
        return controls.stop;
    }, [inView, target, delay, count]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center text-center p-8 sm:p-10 rounded-3xl border border-dashed border-theme-accent/20 bg-theme-glass/[0.03] hover:border-theme-accent/40 hover:shadow-[0_0_30px_rgb(var(--accent-primary)/0.08)] transition-all duration-300"
        >
            <div className="w-12 h-12 rounded-2xl bg-theme-accent/10 border border-theme-accent/20 flex items-center justify-center text-theme-accent mb-5">
                {icon}
            </div>
            <div className="flex items-baseline gap-1 mb-2">
                <motion.span
                    className="text-4xl sm:text-5xl font-black tracking-tight"
                    style={{
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                        background: "linear-gradient(135deg, rgb(var(--accent-primary)), rgb(var(--accent-primary-end)))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {rounded}
                </motion.span>
                <span
                    className="text-2xl sm:text-3xl font-black"
                    style={{
                        background: "linear-gradient(135deg, rgb(var(--accent-primary)), rgb(var(--accent-primary-end)))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {suffix}
                </span>
            </div>
            <p className="text-[13px] sm:text-[14px] text-theme-text/50 font-medium">
                {label}
            </p>
        </motion.div>
    );
}

export default function KPIStats() {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });

    const ICON_COMPONENTS = [Users, Clock, BadgeCheck];
    const stats = KPI_STATS.stats.map((s, i) => {
        const Icon = ICON_COMPONENTS[i];
        return { ...s, icon: <Icon className="w-5 h-5" /> };
    });

    return (
        <section className="relative py-20 sm:py-24 bg-theme-bg">
            <div className="absolute top-0 inset-x-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgb(var(--bg-secondary)), transparent)" }} />



            <div ref={ref} className="relative max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
                <div className="text-center mb-14">
                    <SectionPill label={KPI_STATS.sectionPill} />
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-theme-text mb-4"
                        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                    >
                        {KPI_STATS.heading}{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-theme-accent to-theme-accent-end">
                            {KPI_STATS.headingHighlight}
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="text-theme-text/50 text-[15px] max-w-md mx-auto"
                    >
                        {KPI_STATS.subheading}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
                    {stats.map((stat, i) => (
                        <Counter key={stat.label} {...stat} delay={i * 0.15} inView={inView} />
                    ))}
                </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none" style={{ background: "linear-gradient(to top, rgb(var(--bg-secondary)), transparent)" }} />
        </section>
    );
}
