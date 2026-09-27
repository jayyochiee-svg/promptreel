import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PromptReel — AI film studio",
  description:
    "Turn a single sentence into a cinematic, shot-by-shot storyboard reel. PromptReel directs your concept into a playable film.",
  keywords: [
    "AI film",
    "storyboard",
    "video generation",
    "PromptReel",
    "cinematic",
  ],
  openGraph: {
    title: "PromptReel — AI film studio",
    description:
      "Turn a single sentence into a cinematic, shot-by-shot storyboard reel.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
