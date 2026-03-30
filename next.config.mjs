/** @type {import('next').NextConfig} */
const nextConfig = {
    // Avoid React Strict Mode remount replay in development, which can
    // re-run mount animations (like the branded loader) and look like a double load.
    reactStrictMode: process.env.NODE_ENV === "production",

    // Static HTML export: `out/` is plain HTML/CSS/JS — host on cPanel, S3, any static host (no Node).
    // See README and CPANEL_STATIC.md for deploy steps.
    output: "export",

    images: {
        // Required for `output: 'export'` — no Next.js image optimization server
        unoptimized: true,
    },

    // Note: `headers()` from next.config is not supported with static export.
    // Cache-Control for assets: use `public/.htaccess` on Apache/cPanel.

    // `/expert` → `/become-a-technician`: `src/app/expert/page.tsx` + `public/.htaccess` (301 on Apache)
};

export default nextConfig; // see https://nextjs.org/docs/app/api-reference/config/next-config-js
