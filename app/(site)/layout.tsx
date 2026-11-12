import { Toaster } from "sonner";
import { ChatWidget } from "@/components/chat-widget";
import { FortisChatProvider } from "@/components/chat-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
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
  );
}
