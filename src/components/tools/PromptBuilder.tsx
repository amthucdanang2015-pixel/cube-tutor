"use client";

import { useMemo, useState } from "react";
import { CopyBlock } from "@/components/CopyBlock";
import { CtaBlock } from "@/components/CtaBlock";

const PRODUCT_TYPES = ["AI SaaS", "Marketplace", "Mobile app", "Dashboard", "Landing page", "Creator tool", "Agent product"];
const SECTIONS = ["Hero", "Pricing", "Onboarding", "Dashboard card", "Command menu", "Empty state", "Modal", "Sidebar", "Agent timeline"];
const STYLES = ["Premium dark", "Swiss minimal", "Neo-brutalist", "Soft gradient", "Editorial", "Terminal", "Playful", "Enterprise clean"];
const MOTIONS = ["None", "Subtle fade", "Text reveal", "Stagger list", "Layout transition", "Gradient movement", "Card hover", "Modal transition"];
const TOOLS = ["v0", "Cursor", "Claude Code", "Codex", "Lovable", "Bolt", "Figma Make"];

const STYLE_RULES: Record<string, string[]> = {
  "Premium dark": ["Near-black base (#0a0a0b), one jewel-tone accent used sparingly", "Hairline borders, soft glows, generous negative space", "Three type weights; tight tracking on display sizes"],
  "Swiss minimal": ["Strict grid, oversized type, mono-accent color", "Whitespace as the primary design element", "No decoration — hierarchy via size and space only"],
  "Neo-brutalist": ["Thick borders, hard offset shadows, raw grotesk type", "Primary/clashing colors; snap-on-hover interactions", "Confident, loud, but still usable"],
  "Soft gradient": ["Slow-drifting multi-stop gradient mesh with grain", "Frosted surfaces; restrained accent", "Never the default static diagonal"],
  Editorial: ["Large serif display type, multi-column rhythm", "Pull quotes, drop caps, composed whitespace", "A clear point of view in the copy"],
  Terminal: ["Monospace, phosphor glow, CRT-subtle texture", "Typewriter reveal with a caret; fake $ commands", "High contrast, retro-futuristic"],
  Playful: ["Rounded shapes, springy motion, warm pastels", "Friendly microcopy; delightful empty states", "Energetic but not childish"],
  "Enterprise clean": ["Calm neutral palette, dense but scannable", "Strict type scale, tabular numerals", "Trust over flash; clear states everywhere"],
};

const MOTION_RULES: Record<string, string[]> = {
  None: ["Ship instantly-rendered states; no entrance animation", "Still add eased hovers on interactive elements"],
  "Subtle fade": ["Fade + 16px rise on entrance, ease-out ~300ms", "Sequence elements ~60ms apart"],
  "Text reveal": ["Reveal words/lines tied to scroll or on enter", "Large type; keep read content lit"],
  "Stagger list": ["Stagger children ~60ms, fade + rise", "Trigger on scroll-into-view, pause off-screen"],
  "Layout transition": ["Animate size/position changes (layout), don't cut", "Spring or ease-out, 300–450ms"],
  "Gradient movement": ["Slow 15–20s drift loop, transform/opacity only", "Add grain to kill banding; reduced-motion static"],
  "Card hover": ["Lift + soft shadow + cursor-follow sheen", "Spring transition; cap displacement"],
  "Modal transition": ["Backdrop blur + scale-in from 0.98, trap focus", "Faster exit than enter; reduced-motion crossfade"],
};

function buildPrompt(p: string, section: string, style: string, motion: string, tool: string): string {
  const isFigma = tool === "Figma Make";
  const stack = isFigma ? "as an interactive prototype" : "in Next.js (App Router) + Tailwind, using Motion (motion.dev) for animation";
  const motionLine = motion === "None" ? "Keep it static on entrance, but ease all hover/interactive states." : `Motion: ${motion.toLowerCase()} — ${(MOTION_RULES[motion] || []).join("; ").toLowerCase()}.`;
  return [
    `Build a ${section} for a ${p} ${stack}, in a ${style} style.`,
    ``,
    `Style rules — make all of these unmistakable:`,
    ...(STYLE_RULES[style] || []).map((r) => `- ${r}`),
    ``,
    motionLine,
    ``,
    `Quality bar: hold this to a senior-designer standard. One clear focal point, a strict spacing scale, three type weights, one accent used only for meaning. Design the empty, loading, error, and success states — not just the happy path. 60fps, GPU transforms only, prefers-reduced-motion respected.`,
    ``,
    `Avoid the AI tells: centered-everything layouts, the default purple gradient, emoji bullets, one uniform drop-shadow, and feature-list headlines.`,
    isFigma ? `Deliver a clickable prototype with named components and states.` : `Output a single, self-contained, responsive component with no placeholder TODOs.`,
  ].join("\n");
}

export function PromptBuilder() {
  const [p, setP] = useState(PRODUCT_TYPES[0]);
  const [section, setSection] = useState(SECTIONS[0]);
  const [style, setStyle] = useState(STYLES[0]);
  const [motion, setMotion] = useState(MOTIONS[1]);
  const [tool, setTool] = useState(TOOLS[0]);

  const prompt = useMemo(() => buildPrompt(p, section, style, motion, tool), [p, section, style, motion, tool]);

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <Select label="Product type" value={p} onChange={setP} options={PRODUCT_TYPES} />
        <Select label="Section / component" value={section} onChange={setSection} options={SECTIONS} />
        <Select label="Style" value={style} onChange={setStyle} options={STYLES} />
        <Select label="Motion" value={motion} onChange={setMotion} options={MOTIONS} />
        <Select label="Tool target" value={tool} onChange={setTool} options={TOOLS} />
      </div>

      <div className="space-y-6">
        <CopyBlock text={prompt} label={`Prompt for ${tool}`} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel title="Design rules" items={STYLE_RULES[style] || []} />
          <Panel title="Motion rules" items={MOTION_RULES[motion] || []} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel title="Implementation checklist" items={["Single focal point declared before building", "Strict spacing scale (4/8/12/16/24/32/48/64)", "Three type weights with contrast", "Empty / loading / error / success states", "Responsive from 375px up"]} />
          <Panel title="QA checklist" items={["60fps on a throttled mobile CPU", "Keyboard accessible, visible focus ring", "Reduced-motion fallback", "No console errors, no placeholder copy"]} />
        </div>
        <Panel title="Common mistakes to avoid" items={["Accepting the first output as the design", "Feature-list headline instead of an outcome", "Animating layout properties (width/top) — jank", "Skipping empty/error states"]} tone="warn" />
        <CtaBlock text="Need this direction reviewed against your actual product?" />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-white/60">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg border border-line bg-black/40 px-3 py-2 text-sm text-white/90 outline-none transition focus:border-accent">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Panel({ title, items, tone }: { title: string; items: string[]; tone?: "warn" }) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</h3>
      <ul className="mt-3 space-y-1.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-white/70">
            <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${tone === "warn" ? "bg-amber-400" : "bg-accent2"}`} /> {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
