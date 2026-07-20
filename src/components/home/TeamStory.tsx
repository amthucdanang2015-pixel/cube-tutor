import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BRAND } from "@/config/brand";
import { PRINCIPLES } from "@/content/site";
import { Reveal } from "@/components/Reveal";
import { Wordmark } from "@/components/brand/Wordmark";

export function TeamStory() {
  return (
    <>
      <section className="section-rule mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="eyebrow">Approximately ten years, shared</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.045em] sm:text-5xl">Experience compounds when the handoffs disappear.</h2>
            </div>
            <div>
              <p className="text-xl leading-relaxed text-white/76 sm:text-2xl">
                TasteLoop comes from roughly a decade across product, design, engineering, QA, launch, and growth with real users—not a new label placed on an old agency model.
              </p>
              <p className="mt-5 text-base leading-relaxed text-white/52">
                Agents give that experience more leverage. They do not replace the judgment built by seeing what survives contact with customers, production, and the market. We keep roles and specialist depth; we remove the gaps where context and accountability used to leak away.
              </p>
              <div className="mt-8 grid gap-2 sm:grid-cols-2">
                {PRINCIPLES.map((principle) => <p key={principle} className="rounded-xl border border-line bg-white/[0.02] px-4 py-3 text-sm text-white/66">{principle}</p>)}
              </div>
              <Link href="/about" className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-loop hover:text-loop/80">Read the team story <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-28 pt-4 sm:pb-32">
        <Reveal>
          <div className="grain relative overflow-hidden rounded-[2rem] border border-loop/30 bg-[radial-gradient(circle_at_78%_20%,rgba(217,255,99,.16),transparent_28%),radial-gradient(circle_at_15%_90%,rgba(255,122,89,.12),transparent_30%),#151512] p-8 sm:p-12 lg:p-16">
            <Wordmark />
            <h2 className="mt-8 max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">A better product starts with a better decision.</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/58 sm:text-lg">Tell us the decision you are trying to make. We’ll start there, choose the smallest useful loop, and tell you when the evidence says stop.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/work#intake" className="inline-flex items-center gap-2 rounded-full bg-loop px-6 py-3 text-sm font-semibold text-ink transition hover:bg-loop/90">Get a Taste Review <ArrowRight className="h-4 w-4" /></Link>
              <a href={`mailto:${BRAND.email}`} className="rounded-full border border-line px-6 py-3 text-sm text-white/78 transition hover:border-white/30 hover:text-white">Email {BRAND.email}</a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
