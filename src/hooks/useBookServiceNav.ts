"use client";

import { useCallback, type MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/constants/appStores";

const MOBILE_MAX = 767;

function mobileStoreTarget(): "ios" | "android" | null {
    if (typeof navigator === "undefined") return null;
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
    // iPadOS 13+ often reports as MacIntel with touch
    if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return "ios";
    if (/android/i.test(ua)) return "android";
    return null;
}

function scrollToDownloadSection() {
    const el = document.getElementById("download");
    const scroller = document.querySelector(".app-scrollbar") as HTMLElement | null;
    if (el && scroller) {
        const top = el.offsetTop - 80;
        scroller.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        return;
    }
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

/**
 * “Book a Service” / primary app CTA:
 * - On mobile Safari / Chrome: open the correct app store (iOS vs Android).
 * - Otherwise: smooth-scroll to #download on home, or navigate to /#download.
 */
export function useBookServiceNav() {
    const pathname = usePathname();

    return useCallback(
        (e?: MouseEvent) => {
            e?.preventDefault();

            const isMobile =
                typeof window !== "undefined" &&
                window.matchMedia(`(max-width: ${MOBILE_MAX}px)`).matches;

            if (isMobile) {
                const store = mobileStoreTarget();
                if (store === "ios") {
                    window.location.href = APP_STORE_URL;
                    return;
                }
                if (store === "android") {
                    window.location.href = PLAY_STORE_URL;
                    return;
                }
            }

            if (pathname === "/") {
                scrollToDownloadSection();
            } else {
                window.location.href = "/#download";
            }
        },
        [pathname]
    );
}
