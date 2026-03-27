/** @type {import('next').NextConfig} */
const nextConfig = {
    // Avoid React Strict Mode remount replay in development, which can
    // re-run mount animations (like the branded loader) and look like a double load.
    reactStrictMode: process.env.NODE_ENV === "production",

    images: {
        // Serve AVIF first (50% smaller than PNG), then WebP fallback
        formats: ["image/avif", "image/webp"],
        // Cache optimised images for 30 days (default is 60s)
        minimumCacheTTL: 2592000,
    },

    async redirects() {
        return [{ source: "/expert", destination: "/become-a-technician", permanent: true }];
    },

    async headers() {
        return [
            {
                // All images in /public/images — 7-day fresh, 30-day stale-while-revalidate
                // Covers SVG logos (unoptimized) and any direct image URL requests
                source: "/images/:path*",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=604800, stale-while-revalidate=2592000",
                    },
                ],
            },
            {
                // QR code in /public root
                source: "/qr-linktree.png",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=604800, stale-while-revalidate=2592000",
                    },
                ],
            },
            {
                // Favicon — shorter TTL in case it changes
                source: "/logo.png",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, max-age=86400, stale-while-revalidate=604800",
                    },
                ],
            },
        ];
    },
};

export default nextConfig; // see https://nextjs.org/docs/app/api-reference/config/next-config-js
