"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PATTERNS } from "@/content/patterns";
import { CATEGORIES, getCategory } from "@/content/categories";
import { ContentCard } from "./ContentCard";

export function PatternsBrowser({ initialCategory }: { initialCategory?: string }) {
  const [active, setActive] = useState<string>(initialCategory ?? "all");

  const filtered = useMemo(
    () => (active === "all" ? PATTERNS : PATTERNS.filter((p) => p.category === active)),
    [active],
  );

  const chips = [{ slug: "all", name: "All" }, ...CATEGORIES.map((c) => ({ slug: c.slug, name: c.name }))];

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {chips.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActive(c.slug)}
            className={`relative rounded-full border px-4 py-1.5 text-sm transition ${
              active === c.slug ? "border-transparent text-ink" : "border-line text-white/60 hover:text-white"
            }`}
          >
            {active === c.slug && (
              <motion.span layoutId="patternChip" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
            <span className="relative z-10">{c.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ContentCard
            key={p.slug}
            href={`/patterns/${p.slug}`}
            eyebrow={getCategory(p.category)?.name}
            title={p.title}
            description={p.description}
            meta={[p.difficulty]}
            tags={p.tags}
            accent={getCategory(p.category)?.accent}
          />
        ))}
      </div>
    </div>
  );
}
