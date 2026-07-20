import { ArrowRight, Check, X } from "lucide-react";
import { Reveal } from "@/components/Reveal";

const oldFlow = ["Brief", "Design", "Build", "QA", "Launch"];
const newFlow = ["Signal", "Decision", "Working slice", "Evidence", "Learning"];

export function ProductShift() {
  return (
    <section className="section-rule mx-auto max-w-6xl px-6 py-20 sm:py-24">
      <Reveal>
        <p className="eyebrow">The team changed</p>
        <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">
            Building became faster. Choosing became more important.
          </h2>
          <p className="text-base leading-relaxed text-white/58">
            AI did not erase product roles. It collapsed the cost of producing options. The scarce work is deciding what deserves to cross the gate, then staying accountable when reality answers back.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-[1.75rem] border border-line bg-white/[0.018] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm text-white/42"><X className="h-4 w-4" /> Handoff-shaped delivery</div>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {oldFlow.map((item, index) => (
                <span key={item} className="contents">
                  <span className="rounded-full border border-line px-3 py-2 text-xs text-white/52">{item}</span>
                  {index < oldFlow.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-white/18" />}
                </span>
              ))}
            </div>
            <p className="mt-8 max-w-lg text-sm leading-relaxed text-white/48">
              Work moves between specialists. Context thins out. Output becomes the proxy for progress, and no one fully owns the product decision.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="h-full rounded-[1.75rem] border border-loop/35 bg-loop/[0.055] p-6 sm:p-8">
            <div className="flex items-center gap-2 text-sm text-loop"><Check className="h-4 w-4" /> Outcome-shaped ownership</div>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              {newFlow.map((item, index) => (
                <span key={item} className="contents">
                  <span className="rounded-full border border-loop/25 bg-loop/[0.06] px-3 py-2 text-xs text-white/82">{item}</span>
                  {index < newFlow.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-loop/60" />}
                </span>
              ))}
            </div>
            <p className="mt-8 max-w-lg text-sm leading-relaxed text-white/67">
              Roles remain. Handoffs weaken. Agents accelerate the making; experienced humans own the judgment; evidence decides what happens next.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
