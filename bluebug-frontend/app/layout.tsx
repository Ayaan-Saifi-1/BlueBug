import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SiteLoader } from "@/components/layout/SiteLoader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "BlueBug | Tech Consultancy & Software Engineering", template: "%s | BlueBug" },
  description: "BlueBug builds custom websites, apps, PWAs, and AI/ML systems for startups and institutions.",
  keywords: ["tech consultancy", "custom software", "web development", "AI/ML", "Django", "Next.js"],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/favicon.ico" },
    ],
    apple: "/icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SiteLoader />
        <Navbar />
        <main className="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
