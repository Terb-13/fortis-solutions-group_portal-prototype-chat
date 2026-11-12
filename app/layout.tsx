import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { FORTIS } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${FORTIS.productName} | ${FORTIS.company}`,
  description: `${FORTIS.tagline} ${FORTIS.subhead}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark print:bg-white">
      <body
        className={`${inter.variable} ${geistMono.variable} min-h-screen bg-[#0a0a0a] print:bg-white font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
