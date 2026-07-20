/** Deterministic landing-page "roast" scoring (no paid LLM required). */

const OUTCOME = ["save", "grow", "faster", "without", "never", "instantly", "automatically", "stop", "more", "less"];
const BUZZ = ["powered", "platform", "solution", "leverage", "seamless", "robust", "cutting-edge", "innovative", "next-gen"];
const CTA = ["start", "get", "try", "book", "build", "join", "see", "claim"];
const TRUST = ["trusted", "used by", "customers", "rated", "guarantee", "free", "no card", "%", "+"];

const clamp = (n: number) => Math.max(10, Math.min(100, Math.round(n)));

export function roast(hero: string, category = "", target = "") {
  const text = hero.toLowerCase();
  const words = hero.trim().split(/\s+/).filter(Boolean);
  const len = words.length;
  const count = (arr: string[]) => arr.filter((w) => text.includes(w)).length;
  const hasNum = /\d/.test(hero);

  const outcome = count(OUTCOME), buzz = count(BUZZ), cta = count(CTA), trust = count(TRUST);
  const scores = {
    clarity: clamp(70 + (len >= 4 && len <= 14 ? 15 : -15) + outcome * 6 - buzz * 8),
    trust: clamp(45 + trust * 12 + (hasNum ? 12 : 0) + (target ? 6 : 0)),
    cta: clamp(40 + cta * 18 + (cta ? 10 : -10)),
    differentiation: clamp(55 + outcome * 7 - buzz * 10 + (target ? 8 : 0)),
  };

  const issues: string[] = [];
  if (len > 14) issues.push("Headline too long — aim for 4–10 words.");
  if (len < 3) issues.push("Headline too sparse — state what changes for the user.");
  if (buzz) issues.push("Buzzwords detected — replace jargon with a concrete outcome.");
  if (!outcome) issues.push("No outcome language — say what it does for me, not what it is.");
  if (!cta) issues.push("No clear action verb — add one primary CTA.");
  if (!hasNum && trust < 2) issues.push("No proof above the fold — add a number, logo, or quote.");
  if (!issues.length) issues.push("Solid hero — lead even harder with the single best outcome.");

  return {
    scores,
    issues,
    fixes: [
      "Lead with the outcome, not the category or tech.",
      "One primary CTA with a verb; one secondary at most.",
      "Add one proof element under the headline.",
      "Cut buzzwords; use your user's words.",
    ],
    heroPrompt: `Rewrite this hero for a ${category || "product"} aimed at ${target || "its user"}: "${hero}". Lead with the single most valuable OUTCOME (4–10 words, no buzzwords), add a subhead naming who it's for + the benefit, one verb-first primary CTA, and a proof element. Give 3 ranked options.`,
  };
}
