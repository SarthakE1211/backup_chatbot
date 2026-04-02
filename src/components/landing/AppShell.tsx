"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import ScrollProgress from "@/components/landing/ScrollProgress";
import Chatbot from "@/components/chatbot/Chatbot";

const ServiceGrid = dynamic(() => import("@/components/landing/ServiceGrid"));
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"));
const PockITPromise = dynamic(() => import("@/components/landing/PockITPromise"));
const KPIStats = dynamic(() => import("@/components/landing/KPIStats"));
const TestimonialsSection = dynamic(() => import("@/components/landing/TestimonialsSection"));
const FAQ = dynamic(() => import("@/components/landing/FAQ"));
const DownloadBand = dynamic(() => import("@/components/landing/DownloadBand"));
const Footer = dynamic(() => import("@/components/landing/Footer"));
const FloatingStoreCTA = dynamic(() => import("@/components/landing/FloatingDownload"));
const StickyBookCTA = dynamic(() => import("@/components/landing/StickyBookCTA"));

export default function AppShell() {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="relative h-screen app-scrollbar overflow-y-auto overflow-x-hidden font-sans"
        >
            <ScrollProgress />
            <Header />
            <Hero />
            <ServiceGrid />
            <HowItWorks />
            <PockITPromise />
            <KPIStats />
            <TestimonialsSection />
            <FAQ />
            <DownloadBand />
            <Footer />
            <FloatingStoreCTA />
            <StickyBookCTA />
            <Chatbot />
        </motion.main>
    );
}
