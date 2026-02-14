import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universal Downloader - Download Video & Musik dari Semua Platform",
  description: "Download video, musik, dan gambar dari YouTube, Instagram, TikTok, Twitter, Facebook, Spotify, dan platform lainnya dengan mudah dan gratis.",
  keywords: ["download", "video downloader", "YouTube downloader", "Instagram downloader", "TikTok downloader", "musik downloader", "gratis"],
  authors: [{ name: "Universal Downloader Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Universal Downloader",
    description: "Download video & musik dari semua platform populer",
    url: "https://downloader.example.com",
    siteName: "Universal Downloader",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Downloader",
    description: "Download video & musik dari semua platform populer",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
