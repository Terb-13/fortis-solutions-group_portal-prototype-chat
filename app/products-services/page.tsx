import Image from "next/image";
import Link from "next/link";
import { RenewBadge } from "@/components/renew-badge";
import { buttonVariants } from "@/components/ui/button";
import { FORTIS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata = {
  title: `Products & Services | ${FORTIS.productName}`,
  description:
    "Fortis Edge portal scope — digital HP labels in Orem & Marietta; full catalog via Fortis teams.",
};

const catalogNote = [
  "Shrink sleeves",
  "Flexible packaging",
  "Folding cartons",
  "Label applicators (e.g., Gold Seal, CTM)",
  "RFID / booklets / extended content programs",
];

export default function ProductsServicesPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 md:px-6">
      <h1 className="font-heading text-3xl font-semibold text-[#003087] md:text-4xl">
        Products &amp; Services
      </h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Fortis Edge begins with pressure-sensitive labels on digital HP presses in
        Orem and Marietta. Additional Fortis formats remain available through
        your Fortis team—even when not yet self-service on the portal.
      </p>

      <section className="mt-10 rounded-2xl border border-border bg-card p-8">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="font-heading text-xl font-semibold text-[#003087]">
            Initial Fortis Edge portal scope
          </h2>
          <RenewBadge />
        </div>
        <p className="mt-4 text-muted-foreground">
          Digital HP press production for pressure-sensitive labels, tuned for
          Tier 3 &amp; 4 order profiles and rapid changeovers.
        </p>
        <div className="relative mt-8 grid gap-6 md:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
            <Image
              src="/images/pressure-sensitive-labels.jpg"
              alt="Pressure sensitive label examples placeholder"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl border bg-muted">
            <Image
              src="/images/renew-badge.png"
              alt="RENEW placeholder"
              fill
              className="object-contain p-8"
            />
          </div>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold text-[#003087]">
          Full Fortis catalog (reference)
        </h2>
        <p className="mt-2 text-muted-foreground">
          Fortis Solutions Group delivers the full packaging portfolio referenced
          in the core story. For Fortis Edge,{" "}
          <strong>only pressure-sensitive labels are live on the portal</strong>{" "}
          at this phase—other formats follow program-by-program.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2">
          {catalogNote.map((x) => (
            <li
              key={x}
              className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground"
            >
              {x}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10">
        <Link
          href="/customer-portal"
          className={cn(
            buttonVariants(),
            "bg-[#003087] text-white hover:bg-[#003087]/90",
          )}
        >
          View portal roadmap &amp; status
        </Link>
      </div>
    </div>
  );
}
