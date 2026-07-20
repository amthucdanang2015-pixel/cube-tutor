import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { OFFERS } from "@/config/brand";
import { Reveal } from "@/components/Reveal";

export function OffersSection() {
  return (
    <section id="offers" className="section-rule mx-auto max-w-6xl scroll-mt-28 px-6 py-20 sm:py-24">
      <Reveal>
        <p className="eyebrow">Ways to work together</p>
        <div className="mt-3 grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <h2 className="max-w-3xl text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Start with the decision, then earn the next loop.</h2>
          <p className="text-base leading-relaxed text-white/58">No feature-request conveyor belt. Every engagement has a named decision, a working output, and evidence that determines what happens next.</p>
        </div>
      </Reveal>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {OFFERS.map((offer, index) => (
          <Reveal key={offer.id} delay={index * 0.06}>
            <article id={offer.id} className={`flex h-full scroll-mt-28 flex-col rounded-[1.75rem] border p-6 sm:p-7 ${offer.featured ? "border-loop/45 bg-loop/[0.065]" : "border-line bg-surface/65"}`}>
              <div className="flex items-start justify-between gap-3">
                <div><p className="font-mono text-[10px] uppercase tracking-[0.15em] text-signal">{offer.timeline}</p><h3 className="mt-2 text-2xl font-semibold tracking-tight">{offer.name}</h3></div>
                <span className="shrink-0 text-right text-lg font-semibold tracking-tight">{offer.price}</span>
              </div>
              <p className="mt-5 text-lg font-medium leading-snug text-white/88">{offer.promise}</p>
              <p className="mt-3 text-sm leading-relaxed text-white/52">{offer.purpose}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {offer.includes.map((item) => <li key={item} className="flex items-start gap-2 text-[13px] leading-relaxed text-white/67"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-loop" />{item}</li>)}
              </ul>
              <Link href={`/work#intake`} className={`mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${offer.featured ? "bg-loop text-ink hover:bg-loop/90" : "border border-line text-white/82 hover:border-loop/40 hover:text-white"}`}>
                {offer.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
