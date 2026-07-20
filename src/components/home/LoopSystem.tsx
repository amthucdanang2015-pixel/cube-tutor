"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LOOP_STAGES } from "@/content/site";

export function LoopSystem() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const stage = LOOP_STAGES[active];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-line bg-surface/75">
      <div className="scroll-slim flex overflow-x-auto border-b border-line p-2" aria-label="TasteLoop stages">
        {LOOP_STAGES.map((item, index) => (
          <button
            key={item.name}
            type="button"
            aria-pressed={active === index}
            onClick={() => setActive(index)}
            className={`group flex min-w-[132px] flex-1 items-center justify-between gap-2 rounded-2xl px-3 py-3 text-left text-sm transition ${
              active === index ? "bg-loop text-ink" : "text-white/55 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span><span className="mr-1.5 font-mono text-[10px] opacity-55">{String(index + 1).padStart(2, "0")}</span>{item.name}</span>
            {index < LOOP_STAGES.length - 1 && <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-45" />}
          </button>
        ))}
      </div>

      <motion.div
        key={stage.name}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.75fr_1.25fr] lg:p-10"
      >
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal">Stage {String(active + 1).padStart(2, "0")}</p>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{stage.name}</h3>
          <p className="mt-2 text-lg text-white/55">{stage.verb}</p>
        </div>
        <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <LoopDefinition label="Humans own" value={stage.human} />
          <LoopDefinition label="Agents accelerate" value={stage.agent} />
          <LoopDefinition label="Evidence required" value={stage.evidence} />
          <LoopDefinition label="Output" value={stage.output} />
        </dl>
      </motion.div>
    </div>
  );
}

function LoopDefinition({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-white/10 pt-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/35">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed text-white/72">{value}</dd>
    </div>
  );
}
