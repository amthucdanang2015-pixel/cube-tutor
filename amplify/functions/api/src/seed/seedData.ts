import type { Entity } from "../lib/types";

const ts = "2026-06-16T00:00:00.000Z";

/**
 * Representative seed so the GET content routes return data after POST /admin/seed.
 * The canonical, full content lives in web/src/content/*. A production sync script
 * can map those modules into these single-table items 1:1 (PK <TYPE>#<slug>, SK META,
 * GSI2PK TYPE#<TYPE>). This is intentionally small to keep the bundle lean.
 */
function entity(type: string, slug: string, title: string, description: string, extra: Record<string, unknown> = {}): Entity {
  return {
    PK: `${type}#${slug}`,
    SK: "META",
    GSI2PK: `TYPE#${type}`,
    GSI2SK: `100#${ts}`,
    id: slug,
    type,
    slug,
    title,
    description,
    status: "published",
    searchableText: `${title} ${description}`.toLowerCase(),
    createdAt: ts,
    updatedAt: ts,
    ...extra,
  };
}

export const SEED: Entity[] = [
  entity("CATEGORY", "text-motion", "Text Motion", "Headlines and copy that reveal, kinetic type, scramble effects."),
  entity("CATEGORY", "saas-landing", "AI SaaS Landing Sections", "Heros, bentos, pricing — the sections that convert."),
  entity("PATTERN", "scroll-word-reveal", "Scroll-Linked Word Reveal", "A manifesto that lights up word-by-word as you scroll.", {
    GSI1PK: "CATEGORY#text-motion",
    GSI1SK: `PATTERN#${ts}#scroll-word-reveal`,
    category: "text-motion",
    difficulty: "Intermediate",
    tags: ["scroll", "typography"],
  }),
  entity("PATTERN", "ai-saas-hero-bento", "AI SaaS Hero + Feature Bento", "A converting hero flowing into living feature tiles.", {
    GSI1PK: "CATEGORY#saas-landing",
    GSI1SK: `PATTERN#${ts}#ai-saas-hero-bento`,
    category: "saas-landing",
    difficulty: "Intermediate",
    tags: ["hero", "bento", "conversion"],
  }),
  entity("SKILL", "frontend-taste", "Frontend Taste Skill", "Paste-in instructions that give your agent senior design judgment.", { tags: ["frontend", "taste"] }),
  entity("TEARDOWN", "best-in-class-issue-tracker", "The Best-in-Class Issue Tracker", "Why the fastest tools feel fast: keyboard-first + optimistic UI.", { tags: ["productivity", "speed"] }),
];
