import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OPEN_LOOP_AREAS } from "@/content/site";
import { Reveal } from "@/components/Reveal";

const visuals = {
  Playground: (
    <div className="grid h-full grid-cols-3 gap-2 p-5" aria-hidden="true">
      {["Aa", "◫", "↗"].map((item, index) => <span key={item} className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-xl font-semibold" style={{ transform: `translateY(${index * 8}px)` }}>{item}</span>)}
    </div>
  ),
  Animations: (
    <div className="relative h-full" aria-hidden="true">
      {[0, 1, 2, 3].map((item) => <span key={item} className="absolute left-[14%] h-2 rounded-full bg-loop/70" style={{ top: `${22 + item * 17}%`, width: `${70 - item * 10}%`, animationDelay: `${item * 120}ms` }} />)}
      <span className="absolute bottom-[18%] right-[13%] h-12 w-12 rounded-full border border-signal/50 bg-signal/15" />
    </div>
  ),
  AURORA: (
    <div className="h-full bg-[radial-gradient(circle_at_68%_32%,rgba(217,255,99,.65),transparent_28%),radial-gradient(circle_at_28%_68%,rgba(255,122,89,.7),transparent_35%),linear-gradient(145deg,#14241d,#161511)]" aria-hidden="true" />
  ),
};

export function OpenLoopSection() {
  return (
    <section id="open-loop" className="section-rule mx-auto max-w-6xl scroll-mt-28 px-6 py-20 sm:py-24">
      <Reveal>
        <p className="eyebrow">Open Loop</p>
        <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Free tools, standards, and experiments—with the machinery left on.</h2>
          <p className="text-base leading-relaxed text-white/58">Open Loop is where TasteLoop makes its taste inspectable: working interfaces, precise motion language, and creative engineering you can use.</p>
        </div>
      </Reveal>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {OPEN_LOOP_AREAS.map((area, index) => (
          <Reveal key={area.name} delay={index * 0.06}>
            <Link href={area.href} className="group block h-full overflow-hidden rounded-[1.75rem] border border-line bg-surface/65 transition hover:-translate-y-1 hover:border-loop/40">
              <div className="h-48 border-b border-line bg-black/20">{visuals[area.name]}</div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-signal">{area.label}</p><h3 className="mt-2 text-xl font-semibold tracking-tight">{area.name}</h3></div>
                  <ArrowUpRight className="h-5 w-5 text-white/25 transition group-hover:text-loop" />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted">{area.description}</p>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
