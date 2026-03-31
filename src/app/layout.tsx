import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Pockit Engineers — Doorstep Tech Support in Mumbai",
  description:
    "Instant doorstep IT support for Laptops, WiFi, Printers, CCTV & Smart Homes. Book a tech expert in 60 minutes.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {/* Blocking script: runs before React hydration so CSS variables
            are correct on first paint — prevents theme colour flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('pockit-theme');if(t)document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','light-corporate');}catch(e){}`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
