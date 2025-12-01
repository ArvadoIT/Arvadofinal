import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import type { ReactNode } from "react";

// Optimize font loading - reduced to 2 essential fonts for better performance
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-frozen",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Arvado — Premium Digital Growth Studio",
  description:
    "Arvado blends high-end design, AI automation, and performance marketing to help local businesses grow.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-slate-950 text-white antialiased w-full overflow-x-hidden touch-pan-y">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Scroll to top on page refresh/load before React hydrates
              (function() {
                if (typeof window !== 'undefined') {
                  window.history.scrollRestoration = 'manual';
                  window.scrollTo(0, 0);
                }
              })();
            `,
          }}
        />
        <main className="relative z-10 w-full">{children}</main>
      </body>
    </html>
  );
}
