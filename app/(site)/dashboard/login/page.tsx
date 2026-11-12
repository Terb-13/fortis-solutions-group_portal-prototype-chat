"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function DashboardLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("That password is incorrect. Try again.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16 md:px-6">
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-white/10 bg-[#101010] p-8 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.7)] ring-1 ring-white/[0.06] md:p-10",
        )}
      >
        <p className="text-xs font-bold uppercase tracking-wide text-[#4ade80]">
          Fortis Edge
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-white">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          {FORTIS.productName} dashboard — enter your admin password.
        </p>
        <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-zinc-300">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 border-white/12 bg-white/[0.06] text-zinc-100 placeholder:text-zinc-600 focus-visible:border-[#00A651]/50 focus-visible:ring-[#00A651]/25"
            />
          </div>
          {error && (
            <p
              className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-sm text-red-200"
              role="alert"
            >
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full bg-[#00A651] font-semibold text-white shadow-md shadow-[#00A651]/20 hover:bg-[#00A651]/90"
          >
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
