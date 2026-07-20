"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { ShowcaseSite } from "@/data/showcase";
import { useRef } from "react";
import { Preview } from "./previews";

export function ShowcaseCard({
  site,
  index,
  onOpen,
}: {
  site: ShowcaseSite;
  index: number;
  onOpen: (s: ShowcaseSite) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onClick={() => onOpen(site)}
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (index % 9) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="card-sheen group relative overflow-hidden rounded-2xl border border-line bg-surface text-left"
    >
      {/* live preview panel */}
      <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-[#0b0b0e]">
        <Preview slug={site.slug} />
        <div className="pointer-events-none absolute inset-0 z-10 flex gap-2 p-3">
          <span className="self-start rounded-full border border-line bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
            {site.category}
          </span>
        </div>
        <div className="absolute right-3 top-3 z-10"><span className="rounded-full border border-loop/25 bg-black/50 px-2.5 py-1 text-[11px] font-medium text-loop backdrop-blur">Open Loop</span></div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-tight">{site.title}</h3>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-white/30 transition group-hover:text-white" />
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">
          {site.concept}
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {site.tags.slice(0, 3).map((t) => (
            <span key={t} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/45">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
