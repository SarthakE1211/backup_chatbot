"use client";

import { useEffect } from "react";

/**
 * Legacy URL `/expert` redirects to `/become-a-technician`.
 * Static export cannot rely on next.config redirects(); this page works on any static host.
 * Apache/cPanel: `public/.htaccess` also sends a 301 for SEO.
 */
export default function ExpertRedirectPage() {
    useEffect(() => {
        window.location.replace("/become-a-technician");
    }, []);

    return (
        <p className="p-6 text-center text-theme-muted">
            Redirecting to Become a Technician…
        </p>
    );
}
