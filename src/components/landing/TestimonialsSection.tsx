"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionPill from "./SectionPill";
import TestimonialSlider from "./TestimonialSlider";
import { TESTIMONIALS_SECTION, REVIEWS } from "@/constants/copy";

export default function TestimonialsSection() {
    const heroReview = REVIEWS[0];
    const sliderReviews = REVIEWS.slice(1);

    return (
        <section
            id="testimonials"
            className="relative py-24 sm:py-32"
            style={{ background: "linear-gradient(180deg, rgb(var(--bg-primary)) 0%, rgb(var(--bg-secondary)) 50%, rgb(var(--bg-primary)) 100%)" }}
        >
            <div
                className="absolute top-0 inset-x-0 h-20 pointer-events-none"
                style={{ background: "linear-gradient(to bottom, rgb(var(--bg-secondary)), transparent)" }}
            />

            <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
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

                <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="rounded-3xl overflow-hidden border"
                        style={{
                            background: "rgb(var(--card-bg))",
                            borderColor: "rgb(var(--card-border))",
                        }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr]">
                            <div className="relative min-h-[220px] sm:min-h-full">
                                <Image
                                    src="/images/tanya.jpg"
                                    alt={`${heroReview.name} testimonial`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 100vw, 220px"
                                    unoptimized
                                />
                            </div>
                            <div className="p-6 sm:p-7 flex flex-col">
                                <p className="text-[16px] sm:text-[18px] font-medium leading-relaxed text-theme-text">
                                    {heroReview.text}
                                </p>
                                <div className="mt-5 pt-4 border-t" style={{ borderColor: "rgb(var(--card-border))" }}>
                                    <p className="text-[15px] font-bold text-theme-text">{heroReview.name}</p>
                                    <p className="text-[13px] text-theme-text/60">{heroReview.city}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.08 }}
                        className="relative rounded-3xl border p-5 sm:p-6 overflow-hidden shadow-[0_16px_42px_rgb(var(--bg-primary)/0.18)]"
                        style={{
                            background: "rgb(var(--card-bg))",
                            borderColor: "rgb(var(--card-border))",
                        }}
                    >
                        <div
                            className="pointer-events-none absolute inset-0"
                            style={{
                                background:
                                    "radial-gradient(circle at 92% 10%, rgb(var(--accent-primary) / 0.14), transparent 48%)",
                            }}
                        />
                        <div className="relative z-10 mb-4 pb-4 border-b flex items-start justify-between gap-3" style={{ borderColor: "rgb(var(--card-border))" }}>
                            <div>
                                <p className="text-lg sm:text-xl font-extrabold text-theme-text mt-1">
                                    More customer stories
                                </p>
                            </div>
                        </div>
                        <TestimonialSlider reviews={sliderReviews} />
                    </motion.div>
                </div>
            </div>

            <div
                className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgb(var(--bg-secondary)), transparent)" }}
            />
        </section>
    );
}
