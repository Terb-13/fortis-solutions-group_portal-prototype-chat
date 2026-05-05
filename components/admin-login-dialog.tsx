"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type AdminLoginDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showTrigger?: boolean;
};

export function AdminLoginDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  showTrigger = true,
}: AdminLoginDialogProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    controlledOpen !== undefined && controlledOnOpenChange !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

  useEffect(() => {
    if (!open) {
      setError(null);
      setPassword("");
    }
  }, [open]);

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
      setOpen(false);
      router.push("/dashboard");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {showTrigger && (
        <Button
          type="button"
          size="sm"
          className="bg-[#00A651] px-4 font-semibold text-white shadow-lg shadow-[#00A651]/18 transition hover:bg-[#00A651]/90"
          onClick={() => setOpen(true)}
        >
          Admin Login
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton
          className={cn(
            "sm:max-w-[400px] border-white/12 bg-[#101010] text-zinc-100 ring-1 ring-white/10",
            "[&_[data-slot=dialog-title]]:text-zinc-50",
            "[&_[data-slot=dialog-description]]:text-zinc-500",
          )}
        >
          <DialogHeader className="space-y-1 text-left">
            <p className="text-xs font-bold uppercase tracking-wide text-[#4ade80]">
              Fortis Edge
            </p>
            <DialogTitle className="font-heading text-xl font-semibold text-white">
              Admin sign in
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed">
              Enter the admin password to open the {FORTIS.productName} dashboard.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => void onSubmit(e)} className="space-y-4 pt-2">
            <div className="grid gap-2">
              <Label htmlFor="admin-password" className="text-zinc-300">
                Password
              </Label>
              <Input
                id="admin-password"
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
        </DialogContent>
      </Dialog>
    </>
  );
}
