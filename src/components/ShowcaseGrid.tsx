"use client";

import { useMemo, useState } from "react";
import { SITES, CATEGORIES, type ShowcaseSite } from "@/data/showcase";
import { ShowcaseCard } from "./ShowcaseCard";
import { PromptModal } from "./PromptModal";
import { motion } from "framer-motion";

type Filter = "All" | string;

export function ShowcaseGrid({ limit }: { limit?: number }) {
  const [active, setActive] = useState<Filter>("All");
  const [selected, setSelected] = useState<ShowcaseSite | null>(null);

  const filtered = useMemo(() => {
    let list = SITES;
    if (active !== "All") list = list.filter((s) => s.category === active);
    return limit ? list.slice(0, limit) : list;
  }, [active, limit]);

  const chips: Filter[] = ["All", ...CATEGORIES];

  return (
    <div>
      {!limit && (
        <div className="mb-8 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`relative rounded-full border px-4 py-1.5 text-sm transition ${
                active === c
                  ? "border-transparent text-ink"
                  : "border-line text-white/60 hover:text-white"
              }`}
            >
              {active === c && (
                <motion.span
                  layoutId="chip"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((site, i) => (
          <ShowcaseCard key={site.id} site={site} index={i} onOpen={setSelected} />
        ))}
      </div>

      <PromptModal site={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
