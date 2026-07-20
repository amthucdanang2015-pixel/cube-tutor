"use client";

import { useState } from "react";
import { BRAND } from "@/config/brand";
import { copyText } from "@/lib/copyText";
import { Check, Copy, Twitter } from "lucide-react";

export function ArticleActions({ title, xHook, slug }: { title: string; xHook: string; slug: string }) {
  const [copyStatus, setCopyStatus] = useState<"idle" | "success" | "error">("idle");
  const url = `${BRAND.siteUrl}/blog/${slug}`;
  const tweet = `${xHook || title}\n\n${url}`;

  async function copy() {
    const ok = await copyText(tweet);
    setCopyStatus(ok ? "success" : "error");
    if (ok) setTimeout(() => setCopyStatus("idle"), 1800);
  }

  return (
    <div className="mt-12 rounded-2xl border border-line bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-white/50">
        <Twitter className="h-3.5 w-3.5 text-accent2" /> Repost this as an X / Substack note
      </div>
      <p className="mt-3 whitespace-pre-wrap rounded-xl border border-line bg-black/40 p-4 text-sm leading-relaxed text-white/80">
        {xHook || title}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-white/90"
        >
          <Twitter className="h-4 w-4" /> Post on X
        </a>
        <button
          type="button"
          onClick={copy}
          aria-label={copyStatus === "success" ? "Hook and link copied. Copy again" : copyStatus === "error" ? "Copy failed. Try again" : "Copy hook and link"}
          className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm text-white/85 transition hover:border-white/30"
        >
          {copyStatus === "success" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
          {copyStatus === "success" ? "Copied" : copyStatus === "error" ? "Copy failed" : "Copy hook + link"}
        </button>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {copyStatus === "success" ? "Hook and article link copied to the clipboard." : copyStatus === "error" ? "Could not copy the hook and article link. Select the text above to copy it manually." : ""}
        </span>
      </div>
    </div>
  );
}
