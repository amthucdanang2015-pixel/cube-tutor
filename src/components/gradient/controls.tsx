"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function Slider({ label, value, min, max, step = 0.01, onChange, fmt }: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (v: number) => void; fmt?: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-white/55">{label}</span>
        {/* default readout is % of the knob's range — humans don't tune "1.10" (D-022) */}
        <span className="font-mono text-[11px] tabular-nums text-white/70">{fmt ? fmt(value) : `${Math.round(((value - min) / (max - min)) * 100)}%`}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1.5 h-1 w-full cursor-pointer appearance-none rounded-full bg-white/12 accent-[#ff5c33]
          [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff5c33] [&::-webkit-slider-thumb]:shadow"
      />
    </div>
  );
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} className={`flex-1 rounded-md px-2 py-1.5 text-[12px] font-medium transition ${value === o.value ? "bg-white/[0.12] text-white" : "text-white/45 hover:text-white/80"}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/8">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-2 px-4 py-3 text-left">
        <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition ${open ? "" : "-rotate-90"}`} />
        <span className="text-[11px] font-bold uppercase tracking-widest text-white/55">{title}</span>
      </button>
      {open && <div className="space-y-3.5 px-4 pb-5">{children}</div>}
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="mb-1.5 block text-[12px] text-white/55">{label}</span>
      {children}
    </div>
  );
}

export function Select({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full appearance-none rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-[12.5px] text-white/85 outline-none focus:border-white/25">
        {options.map((o) => <option key={o.value} value={o.value} className="bg-[#16161a]">{o.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/40" />
    </div>
  );
}
