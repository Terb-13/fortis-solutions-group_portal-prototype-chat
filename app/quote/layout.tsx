import Image from "next/image";
import Link from "next/link";
import { FORTIS_IMAGES } from "@/lib/fortis-images";

export default function QuoteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 py-4 sm:px-6">
        <Link href="/" className="inline-flex rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#00A651]/50">
          <Image
            src={FORTIS_IMAGES.logoWhite}
            alt="Fortis Solutions Group"
            width={140}
            height={36}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
