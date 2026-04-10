"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FORTIS } from "@/lib/constants";

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
        setError("Invalid password.");
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
      <div className="w-full max-w-md rounded-2xl border border-border/80 bg-card p-8 shadow-card md:p-10">
        <p className="text-xs font-bold uppercase tracking-wide text-[#00A651]">
          Team
        </p>
        <h1 className="mt-2 font-heading text-2xl font-semibold text-[#003087]">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {FORTIS.productName} dashboard (demo).
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            disabled={busy}
            className="h-11 w-full bg-[#003087] font-semibold text-white hover:bg-[#003087]/90"
          >
            {busy ? "Signing in…" : "Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
}
