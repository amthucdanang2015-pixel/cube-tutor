"use client";

import { BRAND } from "@/config/brand";
import { isImmersive } from "@/lib/chrome";
import { usePathname } from "next/navigation";
import { Wordmark } from "@/components/brand/Wordmark";


export function Footer() {
  const pathname = usePathname();
  if (isImmersive(pathname ?? "")) return null;

  return (
    <footer className="relative border-t border-line px-6 py-14 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.35fr_1fr_1fr_1fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{BRAND.positioning}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/72">{BRAND.idea}</p>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-6xl flex-col items-start justify-between gap-3 border-t border-line pt-6 text-xs text-muted md:flex-row">
        <span>© {new Date().getFullYear()} {BRAND.name}.</span>
        <span>Agents make. Humans decide. Reality corrects the loop.</span>
      </div>
    </footer>
  );
}
