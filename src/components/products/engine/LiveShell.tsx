"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { STAGE_BG } from "./contract";

/* ============================================================================
 * LiveShell (D-029) — /playground/<slug>/live, for any product.
 *
 * The product sits in the SAME centred stage container the studio uses, so the
 * showcase really is a preview of this page. Live mode has NO style UI: the
 * design language arrived fixed through the URL codec. Every control in the
 * dock belongs to the product.
 * ==========================================================================*/

export function LiveShell({ backHref, backLabel, styleName, topCenter, dock, children }: {
  backHref: string;
  backLabel: string;
  /** the resolved design language, named in the corner chip */
  styleName: string;
  /** optional top-centre control (flowtime's device switcher) */
  topCenter?: React.ReactNode;
  /** optional bottom control dock — product actions only */
  dock?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[55]" style={{ background: STAGE_BG }}>
      <div className="relative flex h-full w-full items-center justify-center">{children}</div>

      <Link href={backHref} className="fixed left-4 top-4 z-[70] flex items-center gap-1.5 rounded-full border border-white/10 bg-black/60 px-3.5 py-2 text-sm text-white/85 shadow-2xl backdrop-blur-xl transition hover:border-white/25">
        <ArrowLeft className="h-3.5 w-3.5" /> {backLabel}
      </Link>

      {topCenter && <div className="fixed left-1/2 top-4 z-[70] -translate-x-1/2">{topCenter}</div>}

      <span className="pointer-events-none fixed right-4 top-4 z-[70] rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[11px] text-white/50 backdrop-blur-xl">
        Live demo · {styleName}
      </span>

      {dock && (
        <div className="fixed inset-x-0 bottom-0 z-[70] flex justify-center p-4">
          <div className="flex max-w-full flex-wrap items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/60 px-3 py-2 shadow-2xl backdrop-blur-xl">
            {dock}
          </div>
        </div>
      )}
    </div>
  );
}
