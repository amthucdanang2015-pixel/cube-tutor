"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dsPrompt, type DesignSystem } from "@/data/designSystems";
import { copyText } from "@/lib/copyText";
import { X, Check, Copy } from "lucide-react";

/* ============================================================================
 * PromptDrawer (D-029) — the copyable prompt for the CURRENT design language.
 *
 * It describes the style, not the product (`dsPrompt(ds)`), so it belongs to
 * the engine: every studio offers the same "Get prompt" affordance. This used
 * to live in flowtime's StyleStudio, which is why Card Studio had no way to
 * hand a visitor the thing they came for.
 * ==========================================================================*/

export function PromptDrawer({ open, onClose, ds }: { open: boolean; onClose: () => void; ds: DesignSystem }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const text = dsPrompt(ds);
  useEffect(() => { setCopyStatus("idle"); }, [ds, open]);
  async function copy() {
    setCopyStatus((await copyText(text)) ? "success" : "error");
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          {/* right drawer — anchored to the "Get prompt" trigger side (D-014) */}
          <motion.div initial={{ x: "105%" }} animate={{ x: 0 }} exit={{ x: "105%" }} transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="absolute inset-y-0 right-0 flex w-[480px] max-w-[94vw] flex-col border-l border-line bg-surface shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-line p-5">
              <div>
                <p className="text-xs uppercase tracking-widest text-accent2">Prompt</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{ds.name}</h3>
              </div>
              <button onClick={onClose} aria-label="Close prompt" className="rounded-full border border-line p-2 text-white/70 hover:text-white"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex items-center justify-between px-5 pt-4">
              <span className="text-xs font-medium uppercase tracking-wider text-white/45">Paste into v0 / Cursor / Claude / Lovable</span>
              <button
                type="button"
                onClick={copy}
                aria-label={copyStatus === "success" ? "Prompt copied. Copy again" : copyStatus === "error" ? "Copy failed. Try again" : "Copy prompt"}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:border-white/30"
              >
                {copyStatus === "success" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : copyStatus === "error" ? <X className="h-3.5 w-3.5 text-rose-400" /> : <Copy className="h-3.5 w-3.5" />}
                {copyStatus === "success" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy"}
              </button>
              <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                {copyStatus === "success" ? "Prompt copied to the clipboard." : copyStatus === "error" ? "Could not copy the prompt. Try again." : ""}
              </span>
            </div>
            <pre className="m-5 mt-2 min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap rounded-xl border border-line bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed text-white/80">{text}</pre>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
