import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ChatWidget } from "@/components/chat-widget";
import { FortisChatProvider } from "@/components/chat-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${geistMono.variable} min-h-screen bg-[#0a0a0a] font-sans antialiased`}
      >
        <FortisChatProvider>
          <div className="flex min-h-screen flex-col">
            <SiteHeader />
            <main className="relative flex-1">{children}</main>
            <SiteFooter />
          </div>
          <ChatWidget />
          <Toaster
            theme="dark"
            position="top-center"
            toastOptions={{
              classNames: {
                toast: "glass-panel !border-white/10 !bg-[#141414] !text-foreground",
                description: "!text-zinc-400",
              },
            }}
          />
        </FortisChatProvider>
      </body>
    </html>
  );
}
