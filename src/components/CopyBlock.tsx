"use client";

import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { copyText } from "@/lib/copyText";

export function CopyBlock({ text, label = "Copy-paste prompt" }: { text: string; label?: string }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  useEffect(() => { setCopyStatus("idle"); }, [text]);

  async function copy() {
    setCopyStatus((await copyText(text)) ? "success" : "error");
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/50">{label}</span>
        <button
          type="button"
          onClick={copy}
          aria-label={copyStatus === "success" ? "Text copied. Copy again" : copyStatus === "error" ? "Copy failed. Try again" : `Copy ${label.toLowerCase()}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white/5 px-3 py-1.5 text-xs font-medium transition hover:border-white/30"
        >
          {copyStatus === "success" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : copyStatus === "error" ? <X className="h-3.5 w-3.5 text-rose-400" /> : <Copy className="h-3.5 w-3.5" />}
          {copyStatus === "success" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy"}
        </button>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {copyStatus === "success" ? "Text copied to the clipboard." : copyStatus === "error" ? "Could not copy the text. Try again." : ""}
        </span>
      </div>
      <pre className="whitespace-pre-wrap rounded-xl border border-line bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed text-white/80">
        {text}
      </pre>
    </div>
  );
}
