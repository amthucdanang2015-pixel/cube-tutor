"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { AlertCircle, Check, Copy, Sparkles, X } from "lucide-react";
import Link from "next/link";
import type { ShowcaseSite } from "@/data/showcase";
import { copyText } from "@/lib/copyText";

export function PromptModal({ site, onClose }: { site: ShowcaseSite | null; onClose: () => void }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "ok" | "error">("idle");
  const reduce = useReducedMotion();

  useEffect(() => setCopyStatus("idle"), [site]);
  useEffect(() => {
    function onKey(event: KeyboardEvent) { if (event.key === "Escape") onClose(); }
    if (site) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [site, onClose]);

  if (!site) return null;

  async function copy() {
    if (!site) return;
    const ok = await copyText(site.prompt);
    setCopyStatus(ok ? "ok" : "error");
    if (ok) window.setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <AnimatePresence>
      <motion.div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <button type="button" aria-label="Close prompt" className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="showcase-prompt-title"
          initial={reduce ? false : { y: 40, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 30, scale: 0.98, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-h-[92svh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-line bg-surface sm:rounded-3xl"
        >
          <div className={`relative h-28 bg-gradient-to-br ${site.accent}`}>
            <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:20px_20px] opacity-10" />
            <button type="button" onClick={onClose} className="absolute right-4 top-4 rounded-full border border-line bg-black/40 p-2 text-white/80 backdrop-blur transition hover:text-white" aria-label="Close prompt"><X className="h-4 w-4" /></button>
          </div>

          <div className="p-6 sm:p-7">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="rounded-full border border-line px-2 py-0.5">{site.category}</span>
              <span className="rounded-full border border-loop/25 bg-loop/[0.06] px-2 py-0.5 text-loop">Open Loop</span>
              {site.stack.map((stack) => <span key={stack} className="text-white/40">· {stack}</span>)}
            </div>
            <h2 id="showcase-prompt-title" className="mt-3 text-2xl font-semibold tracking-tight">{site.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{site.concept}</p>
            <p className="mt-3 text-xs text-muted"><span className="text-white/50">Inspiration:</span> {site.reference}</p>

            <div className="relative mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wider text-white/50">Copyable direction</span>
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:border-white/30">
                  {copyStatus === "ok" ? <Check className="h-3.5 w-3.5 text-loop" /> : copyStatus === "error" ? <AlertCircle className="h-3.5 w-3.5 text-signal" /> : <Copy className="h-3.5 w-3.5" />}
                  {copyStatus === "ok" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy"}
                </button>
              </div>
              <pre className="whitespace-pre-wrap rounded-xl border border-line bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed text-white/80">{site.prompt}</pre>
              <p className="sr-only" aria-live="polite">{copyStatus === "ok" ? "Prompt copied." : copyStatus === "error" ? "Copy failed. Select the prompt text manually." : ""}</p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-white/[0.02] p-4">
              <Sparkles className="h-4 w-4 text-signal" />
              <p className="flex-1 text-sm text-white/70">Need to decide which direction belongs in your product?</p>
              <Link href="/work#intake" className="rounded-full bg-loop px-4 py-2 text-xs font-semibold text-ink transition hover:bg-loop/90">Get a Taste Review</Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
