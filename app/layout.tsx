import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "IP-SAKTI Sahayak — Ayurveda IP & Regulatory Guidance",
  description:
    "AI-powered, source-cited guidance on patents, GI tags, ABS compliance, TKDL prior art and regulatory classification for Ayurvedic products. Built for the AYUSH community under Smart India Hackathon PS 26045.",
  keywords: [
    "Ayurveda IP",
    "TKDL",
    "ABS compliance",
    "patent Ayurveda",
    "GI tag",
    "AYUSH startup",
    "traditional knowledge",
    "IP-SAKTI",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${outfit.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
