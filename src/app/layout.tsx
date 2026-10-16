import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { theBeach } from "@/content/venues/the-beach";

const display = localFont({
  src: [
    { path: "../fonts/instrument-serif-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/instrument-serif-latin-400-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-display",
  display: "swap",
});

const body = localFont({
  src: "../fonts/hanken-grotesk-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${theBeach.name} ${theBeach.byline}, Uthandi, Chennai (design concept)`,
  description: `${theBeach.tagline}. ${theBeach.description}`,
  // Concept build: keep out of search results until the venue approves it.
  robots: { index: false, follow: false },
  openGraph: {
    title: `${theBeach.name} ${theBeach.byline}`,
    description: theBeach.tagline,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A1C2A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
