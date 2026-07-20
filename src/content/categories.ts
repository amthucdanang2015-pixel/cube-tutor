import type { Category } from "./types";

export const CATEGORIES: Category[] = [
  { slug: "text-motion", name: "Text Motion", blurb: "Headlines and copy that reveal, kinetic type, scramble and mask effects.", accent: "from-violet-500/25 to-fuchsia-500/15" },
  { slug: "gradient-backgrounds", name: "Gradient Backgrounds", blurb: "Living meshes, grain, aurora and noise that read as crafted, not default.", accent: "from-indigo-500/25 to-cyan-400/15" },
  { slug: "transitions", name: "Essential Transitions", blurb: "Page, route, modal and shared-element motion that feels native-app smooth.", accent: "from-rose-400/25 to-orange-500/15" },
  { slug: "micro-interactions", name: "Micro-interactions", blurb: "Hovers, toggles, copy-feedback and the tiny moments that signal quality.", accent: "from-emerald-400/25 to-teal-500/15" },
  { slug: "saas-landing", name: "AI SaaS Landing Sections", blurb: "Heros, feature bentos, pricing, social proof — the sections that convert.", accent: "from-sky-400/25 to-blue-600/15" },
  { slug: "dashboards", name: "Dashboards", blurb: "Data density done right: hierarchy, charts, tables, command surfaces.", accent: "from-cyan-300/25 to-indigo-600/15" },
  { slug: "onboarding", name: "Onboarding Flows", blurb: "First-run, empty states, checklists and activation moments that stick.", accent: "from-amber-400/25 to-yellow-600/15" },
  { slug: "agent-ui", name: "Agent / AI App UI", blurb: "Chat, streaming, tool-calls, citations, command palettes for AI products.", accent: "from-fuchsia-400/25 to-purple-600/15" },
  { slug: "spatial-3d", name: "3D / Spatial UI", blurb: "Depth, parallax, product spins and tasteful WebGL that doesn't tank perf.", accent: "from-orange-400/25 to-red-500/15" },
  { slug: "brand-systems", name: "Logo / Brand Systems", blurb: "Wordmarks, motion logos, color and type systems that make a product feel real.", accent: "from-zinc-300/20 to-violet-600/15" },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}
