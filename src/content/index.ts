export * from "./types";
export { CATEGORIES, getCategory } from "./categories";
export { PATTERNS, getPattern, patternsByCategory } from "./patterns";
export { SKILLS, getSkill } from "./skills";
export { TEARDOWNS, getTeardown } from "./teardowns";

import { PATTERNS } from "./patterns";
import { SKILLS } from "./skills";
import { TEARDOWNS } from "./teardowns";
import type { BaseDoc } from "./types";

export type SearchKind = "pattern" | "skill" | "teardown";
export interface SearchHit { kind: SearchKind; slug: string; title: string; description: string; tags: string[]; }

/** Simple in-memory search across content. Swap for a real index later. */
export function searchContent(q: string): SearchHit[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  const score = (d: BaseDoc) => {
    const hay = `${d.title} ${d.description} ${d.tags.join(" ")}`.toLowerCase();
    return hay.includes(needle) ? (d.title.toLowerCase().includes(needle) ? 2 : 1) : 0;
  };
  const hits: SearchHit[] = [];
  for (const p of PATTERNS) if (score(p)) hits.push({ kind: "pattern", slug: p.slug, title: p.title, description: p.description, tags: p.tags });
  for (const s of SKILLS) if (score(s)) hits.push({ kind: "skill", slug: s.slug, title: s.title, description: s.description, tags: s.tags });
  for (const t of TEARDOWNS) if (score(t)) hits.push({ kind: "teardown", slug: t.slug, title: t.title, description: t.description, tags: t.tags });
  return hits;
}
