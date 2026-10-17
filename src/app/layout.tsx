import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { theBeach } from "@/content/venues/the-beach";
import { launched, siteUrl } from "@/lib/site";

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

const fullName = `${theBeach.name} ${theBeach.byline}`;
const description = theBeach.seoDescription;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: launched
      ? `${fullName} | Beachfront restaurant, ECR, Uthandi, Chennai`
      : `${fullName}, Uthandi, Chennai (design concept)`,
    template: `%s | ${fullName}`,
  },
  description,
  alternates: { canonical: "/" },
  // Private preview until NEXT_PUBLIC_LAUNCHED=true.
  robots: launched ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    title: fullName,
    description: theBeach.tagline,
    type: "website",
    siteName: fullName,
    locale: "en_IN",
    url: "/",
  },
  twitter: { card: "summary_large_image", title: fullName, description: theBeach.tagline },
};

export const viewport: Viewport = {
  themeColor: "#0A1C2A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        {/* Reads only. The intro component records the visit, so landing on another page first
            does not suppress the intro on the home page. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(sessionStorage.getItem("tb-intro"))document.documentElement.dataset.intro="seen"}catch(e){}',
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
