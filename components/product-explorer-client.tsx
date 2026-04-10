"use client";

import Image from "next/image";
import { useState } from "react";
import { RenewBadge } from "@/components/renew-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/products";
import { useQuote } from "@/lib/quote-context";

export function ProductExplorerClient({ products }: { products: Product[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const { addProduct } = useQuote();
  const active = products.find((p) => p.id === openId) ?? null;

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <Card
            key={p.id}
            className="flex flex-col overflow-hidden border-border/80 transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[4/3] w-full bg-muted">
              <Image
                src={p.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <CardHeader className="gap-2">
              {p.renewEligible && <RenewBadge />}
              <CardTitle className="text-lg text-[#003087]">{p.name}</CardTitle>
              <CardDescription>{p.shortDescription}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Highlights</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {p.includes.slice(0, 3).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex gap-2 border-t border-border/80 bg-muted/20">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setOpenId(p.id)}
              >
                Details
              </Button>
              <Button
                className="flex-1 bg-[#003087] text-white hover:bg-[#003087]/90"
                onClick={() => addProduct(p)}
              >
                Add to quote
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
          {active && (
            <>
              <DialogHeader>
                <div className="mb-2">
                  {active.renewEligible && <RenewBadge />}
                </div>
                <DialogTitle className="text-[#003087]">{active.name}</DialogTitle>
                <DialogDescription>{active.shortDescription}</DialogDescription>
              </DialogHeader>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={active.image}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
              <Separator />
              <div>
                <p className="text-sm font-semibold text-foreground">Includes</p>
                <ul className="mt-2 list-inside list-disc text-sm text-muted-foreground">
                  {active.includes.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Specifications
                </p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  {active.specs.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </div>
              {active.renewEligible && (
                <div className="rounded-lg border border-[#00A651]/30 bg-[#00A651]/5 p-3 text-sm text-[#00A651]">
                  RENEW™ options may be available for this format—ask Fortis
                  about wash-off and recyclable constructions aligned to your
                  sustainability goals.
                </div>
              )}
              <Button
                className="w-full bg-[#003087] text-white hover:bg-[#003087]/90"
                onClick={() => {
                  addProduct(active);
                  setOpenId(null);
                }}
              >
                Add to quote
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
