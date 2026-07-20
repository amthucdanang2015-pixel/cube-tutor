"use client";

import { useState } from "react";
import { CopyBlock } from "@/components/CopyBlock";
import { CtaBlock } from "@/components/CtaBlock";

interface Result {
  scores: { label: string; score: number; note: string }[];
  issues: string[];
  fixes: string[];
  heroPrompt: string;
}

const OUTCOME_WORDS = ["save", "grow", "faster", "without", "never", "instantly", "automatically", "stop", "more", "less", "in minutes", "in seconds"];
const FEATURE_WORDS = ["powered", "platform", "solution", "leverage", "seamless", "robust", "cutting-edge", "innovative", "ai-powered", "next-gen"];
const CTA_WORDS = ["start", "get", "try", "book", "build", "join", "see", "claim", "download", "request"];
const TRUST_WORDS = ["trusted", "used by", "customers", "reviews", "rated", "backed", "guarantee", "free", "no card", "%", "+"];

function clamp(n: number) { return Math.max(10, Math.min(100, Math.round(n))); }

function analyze(hero: string, category: string, target: string): Result {
  const text = hero.toLowerCase();
  const words = hero.trim().split(/\s+/).filter(Boolean);
  const len = words.length;
  const has = (arr: string[]) => arr.filter((w) => text.includes(w)).length;
  const hasNumber = /\d/.test(hero);

  const outcome = has(OUTCOME_WORDS);
  const feature = has(FEATURE_WORDS);
  const cta = has(CTA_WORDS);
  const trust = has(TRUST_WORDS);

  const clarity = clamp(70 + (len >= 4 && len <= 14 ? 15 : -15) + outcome * 6 - feature * 8);
  const trustScore = clamp(45 + trust * 12 + (hasNumber ? 12 : 0) + (target ? 6 : 0));
  const ctaScore = clamp(40 + cta * 18 + (cta ? 10 : -10));
  const diff = clamp(55 + outcome * 7 - feature * 10 + (target ? 8 : 0) + (hasNumber ? 6 : 0));

  const issues: string[] = [];
  if (len > 14) issues.push("Headline is too long — the eye can't grab the promise in one beat. Aim for 4–10 words.");
  if (len < 3) issues.push("Headline is too sparse to communicate a promise. Say what changes for the user.");
  if (feature > 0) issues.push(`Buzzwords detected (${FEATURE_WORDS.filter((w) => text.includes(w)).join(", ")}). Replace jargon with a concrete outcome.`);
  if (outcome === 0) issues.push("No outcome language — it likely describes what the product *is*, not what it *does for me*.");
  if (cta === 0) issues.push("No clear action verb near the hero. Add one primary CTA with a verb (Start, Get, Try).");
  if (!hasNumber && trust < 2) issues.push("No proof above the fold. Add a number, logo, or testimonial to build trust fast.");
  if (issues.length === 0) issues.push("Solid hero. Tighten by leading even harder with the single most valuable outcome.");

  const fixes = [
    "Lead with the outcome ('what changes for me?'), not the category or the tech.",
    "One primary CTA with a verb; one low-commitment secondary at most.",
    "Add one piece of proof directly under the headline (metric, logo, or quote).",
    "Cut buzzwords; use the words your target user actually uses.",
  ];

  const heroPrompt = `Rewrite this landing-page hero for a ${category || "product"} aimed at ${target || "its target user"}.\n\nCurrent: "${hero}"\n\nRules: lead with the single most valuable OUTCOME for the user (not features or tech), 4–10 words, no buzzwords. Add a one-line subhead that names who it's for and the key benefit. Propose one primary CTA (verb-first) and one secondary. Then add one proof element (metric/logo/quote) to place under the headline. Give 3 headline options ranked by clarity.`;

  return {
    scores: [
      { label: "Clarity", score: clarity, note: "Can a stranger grasp the promise in 3 seconds?" },
      { label: "Trust", score: trustScore, note: "Is there proof above the fold?" },
      { label: "CTA", score: ctaScore, note: "Is the next action obvious and singular?" },
      { label: "Differentiation", score: diff, note: "Does it say why this, not just what?" },
    ],
    issues,
    fixes,
    heroPrompt,
  };
}

export function LandingRoast() {
  const [hero, setHero] = useState("");
  const [category, setCategory] = useState("");
  const [target, setTarget] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function run(e: React.FormEvent) {
    e.preventDefault();
    if (hero.trim().length < 3) return;
    setResult(analyze(hero, category, target));
  }

  return (
    <div className="space-y-8">
      <form onSubmit={run} className="space-y-4 rounded-2xl border border-line bg-surface p-5">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-white/60">Your hero copy (headline + subhead)</label>
          <textarea value={hero} onChange={(e) => setHero(e.target.value)} rows={3} placeholder="Paste your hero headline and subhead…" className="w-full rounded-lg border border-line bg-black/40 px-3 py-2 text-sm outline-none focus:border-accent" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Product category</label>
            <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. AI notetaker" className="w-full rounded-lg border border-line bg-black/40 px-3 py-2 text-sm outline-none focus:border-accent" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-white/60">Target user</label>
            <input value={target} onChange={(e) => setTarget(e.target.value)} placeholder="e.g. solo founders" className="w-full rounded-lg border border-line bg-black/40 px-3 py-2 text-sm outline-none focus:border-accent" />
          </div>
        </div>
        <button type="submit" className="rounded-full bg-white px-6 py-3 text-sm font-medium text-ink transition hover:bg-white/90">Roast my hero</button>
        <p className="text-xs text-muted">Runs locally with deterministic heuristics — nothing is sent anywhere. (Wire an LLM later for deeper analysis.)</p>
      </form>

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {result.scores.map((s) => (
              <div key={s.label} className="rounded-2xl border border-line bg-white/[0.02] p-4 text-center">
                <div className={`text-3xl font-bold ${s.score >= 70 ? "text-emerald-400" : s.score >= 45 ? "text-amber-400" : "text-rose-400"}`}>{s.score}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/60">{s.label}</div>
                <div className="mt-1 text-[11px] leading-snug text-white/35">{s.note}</div>
              </div>
            ))}
          </div>
          <Panel title="Above-the-fold issues" items={result.issues} tone="warn" />
          <Panel title="Recommended fixes" items={result.fixes} />
          <CopyBlock text={result.heroPrompt} label="Better hero prompt" />
          <CtaBlock text="Need a commercial and product decision, not another rewrite?" />
        </div>
      )}
    </div>
  );
}

function Panel({ title, items, tone }: { title: string; items: string[]; tone?: "warn" }) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-5">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</h3>
      <ul className="mt-3 space-y-2">
        {items.map((i) => <li key={i} className="flex gap-2 text-sm leading-relaxed text-white/75"><span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${tone === "warn" ? "bg-amber-400" : "bg-accent2"}`} /> {i}</li>)}
      </ul>
    </div>
  );
}
