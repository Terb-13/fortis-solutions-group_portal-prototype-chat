"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

type TeamLoginDialogProps = {
  /** Controlled dialog (header owns trigger buttons) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When false, only the modal is rendered — use with controlled `open` */
  showTrigger?: boolean;
};

export function TeamLoginDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  showTrigger = true,
}: TeamLoginDialogProps) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled =
    controlledOpen !== undefined && controlledOnOpenChange !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? controlledOnOpenChange : setInternalOpen;

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
      setPassword("");
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
          className="bg-[#00A651] font-semibold text-white shadow-sm transition hover:bg-[#00A651]/90"
          onClick={() => setOpen(true)}
        >
          Team Login
        </Button>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg text-[#003087]">
              Team access
            </DialogTitle>
            <DialogDescription>
              Sign in to the {FORTIS.productName} dashboard (demo password).
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <div className="grid gap-2">
              <Label htmlFor="team-password">Password</Label>
              <Input
                id="team-password"
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
              {busy ? "Signing in…" : "Enter dashboard"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
