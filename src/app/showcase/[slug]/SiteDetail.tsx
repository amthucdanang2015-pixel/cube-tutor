"use client";

import type { ShowcaseSite } from "@/data/showcase";
import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Check, Copy, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Preview } from "@/components/previews";
import { copyText } from "@/lib/copyText";

export function SiteDetail({ site }: { site: ShowcaseSite }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "ok" | "error">("idle");
  const reduce = useReducedMotion();

  async function copy() {
    const ok = await copyText(site.prompt);
    setCopyStatus(ok ? "ok" : "error");
    if (ok) window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link href="/showcase" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-white"><ArrowLeft className="h-4 w-4" /> All directions</Link>

      <div className="relative mt-6 h-72 overflow-hidden rounded-3xl border border-line bg-[#0b0b0e]">
        <Preview slug={site.slug} />
        <span className="pointer-events-none absolute bottom-3 right-4 z-10 rounded-full border border-line bg-black/40 px-2.5 py-1 text-[11px] text-white/60 backdrop-blur">Live preview · hover or move to interact</span>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="rounded-full border border-line px-2 py-0.5">{site.category}</span>
        <span className="rounded-full border border-loop/25 bg-loop/[0.06] px-2 py-0.5 text-loop">Open Loop</span>
        {site.stack.map((stack) => <span key={stack} className="text-white/40">· {stack}</span>)}
      </div>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{site.title}</h1>
      <p className="mt-3 text-white/65">{site.concept}</p>
      <p className="mt-2 text-sm text-muted"><span className="text-white/50">Inspiration:</span> {site.reference}</p>

      <div className="mt-8">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 className="text-xs font-medium uppercase tracking-wider text-white/50">Copyable direction</h2>
          <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:border-white/30">
            {copyStatus === "ok" ? <Check className="h-3.5 w-3.5 text-loop" /> : copyStatus === "error" ? <AlertCircle className="h-3.5 w-3.5 text-signal" /> : <Copy className="h-3.5 w-3.5" />}
            {copyStatus === "ok" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy prompt"}
          </button>
        </div>
        <pre className="whitespace-pre-wrap rounded-xl border border-line bg-black/40 p-5 font-mono text-[13px] leading-relaxed text-white/80">{site.prompt}</pre>
        <p className="sr-only" aria-live="polite">{copyStatus === "ok" ? "Prompt copied." : copyStatus === "error" ? "Copy failed. Select the prompt text manually." : ""}</p>
      </div>

      <motion.div initial={reduce ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-white/[0.02] p-5">
        <Sparkles className="h-5 w-5 text-signal" />
        <p className="flex-1 text-sm text-white/70">Need to decide which direction belongs in your actual product?</p>
        <Link href="/work#intake" className="rounded-full bg-loop px-4 py-2 text-sm font-semibold text-ink transition hover:bg-loop/90">Get a Taste Review</Link>
      </motion.div>
    </article>
  );
}
