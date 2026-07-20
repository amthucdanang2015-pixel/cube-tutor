"use client";

import { useMemo, useState } from "react";
import { CopyBlock } from "@/components/CopyBlock";
import { CtaBlock } from "@/components/CtaBlock";

const TYPES = ["Text reveal", "Card hover", "Modal open", "Page transition", "Tab switch", "List stagger", "Loading state", "Success state"];
const FEELS = ["Calm", "Premium", "Fast", "Playful", "Cinematic", "Minimal"];
const FRAMEWORKS = ["CSS", "React", "Motion.dev React", "Tailwind"];

const FEEL_TIMING: Record<string, string> = {
  Calm: "500–700ms, ease-in-out, low amplitude",
  Premium: "300–450ms, ease-out (cubic-bezier(0.22,1,0.36,1)), weighty",
  Fast: "120–200ms, ease-out, snappy",
  Playful: "spring (stiffness ~260, damping ~18), slight overshoot",
  Cinematic: "700–1000ms, custom ease, staged sequence",
  Minimal: "200–300ms, ease, no overshoot",
};

function build(type: string, feel: string, fw: string): string {
  const impl =
    fw === "CSS" ? "vanilla CSS transitions/keyframes (transform + opacity only)" :
    fw === "Tailwind" ? "Tailwind utilities + a small keyframe in the config (transform + opacity only)" :
    fw === "Motion.dev React" ? "a Motion (motion.dev) React component with variants" :
    "a React component using CSS transitions or the Web Animations API";
  return [
    `Implement a "${type}" animation that feels ${feel.toLowerCase()}, using ${impl}.`,
    ``,
    `Timing & easing: ${FEEL_TIMING[feel]}.`,
    `Exits should be faster than entrances. Animate transform/opacity only (GPU). Target 60fps.`,
    `Accessibility: wrap in a prefers-reduced-motion check with a meaningful static fallback (no motion, but the state change still reads).`,
    `Performance: no layout-triggering properties; pause off-screen if it loops; keep it self-contained and typed.`,
    `Deliver a single reusable, well-named ${fw === "CSS" ? "stylesheet snippet" : "component"} with no placeholder TODOs.`,
  ].join("\n");
}

export function MotionPromptGenerator() {
  const [type, setType] = useState(TYPES[0]);
  const [feel, setFeel] = useState(FEELS[1]);
  const [fw, setFw] = useState(FRAMEWORKS[2]);
  const prompt = useMemo(() => build(type, feel, fw), [type, feel, fw]);

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div className="space-y-4">
        <Select label="Motion type" value={type} onChange={setType} options={TYPES} />
        <Select label="Feel" value={feel} onChange={setFeel} options={FEELS} />
        <Select label="Framework" value={fw} onChange={setFw} options={FRAMEWORKS} />
      </div>
      <div className="space-y-6">
        <CopyBlock text={prompt} label="Motion prompt" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Panel title="Timing & easing" items={[FEEL_TIMING[feel], "Exits faster than entrances", "Stay in the 200–450ms pocket unless cinematic"]} />
          <Panel title="Accessibility" items={["Honor prefers-reduced-motion", "State change must read without motion", "Don't trap focus during transitions"]} />
        </div>
        <Panel title="Performance notes" items={["Animate transform/opacity only — never width/top/margin", "Pause looping animations when off-screen", "Throttle pointer/scroll handlers; lerp toward targets"]} />
        <CtaBlock text="Need a motion system reviewed in the context of your whole product?" />
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
function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</h3>
      <ul className="mt-3 space-y-1.5">
        {items.map((i) => <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-white/70"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent2" /> {i}</li>)}
      </ul>
    </div>
  );
}
