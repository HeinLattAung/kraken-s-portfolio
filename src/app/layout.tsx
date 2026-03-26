import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { MagneticCursor } from "@/components/MagneticCursor";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#06060a",
};

export const metadata: Metadata = {
  title: "Hein Latt Aung | Full Stack Developer",
  description:
    "Portfolio of Hein Latt Aung — Full Stack Developer specializing in modern web applications with Next.js, React, and TypeScript.",
  keywords: [
    "Full Stack Developer",
    "Next.js",
    "React",
    "TypeScript",
    "Portfolio",
  ],
  openGraph: {
    title: "Hein Latt Aung | Full Stack Developer",
    description:
      "Portfolio of Hein Latt Aung — Full Stack Developer specializing in modern web applications.",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Hein Latt Aung",
  jobTitle: "Full Stack Developer",
  url: "",
  sameAs: [],
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Full Stack Development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <div className="mesh-gradient" aria-hidden="true" />
        <MagneticCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
