import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "GraphLens — Engineering Knowledge Graph",
  description:
    "GraphLens connects your documentation into a live knowledge graph so your team can query architectural relationships in plain English.",
  keywords: ["knowledge graph", "RAG", "documentation", "microservices", "dependency mapping"],
  openGraph: {
    title: "GraphLens — Engineering Knowledge Graph",
    description: "Understand your system dependencies instantly.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* JetBrains Mono — not available in next/font/google, load via link */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${geist.variable} ${inter.variable} bg-surface text-on-surface antialiased min-h-screen`}
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
