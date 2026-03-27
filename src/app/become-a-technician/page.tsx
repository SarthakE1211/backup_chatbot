"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import ExpertHero from "@/components/expert/ExpertHero";
import ThemeSync from "@/components/landing/ThemeSync";

export default function BecomeTechnicianPage() {
    useEffect(() => {
        const saved = localStorage.getItem("pockit-theme");
        if (saved) {
            document.documentElement.setAttribute("data-theme", saved);
        }
    }, []);

    return (
        <>
            <ThemeSync />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="relative min-h-screen app-scrollbar overflow-y-auto overflow-x-hidden"
            >
                <Header />
                <ExpertHero />
                <Footer />
            </motion.main>
        </>
    );
}
