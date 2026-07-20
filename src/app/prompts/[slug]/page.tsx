import { allCombos, getCombo, buildPrompt, STYLES, TOOLS } from "@/data/pseo";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Check } from "lucide-react";
import { CopyBlock } from "@/components/CopyBlock";
import { Reveal } from "@/components/Reveal";

export function generateStaticParams() {
  return allCombos().map((c) => ({ slug: c.slug }));
}

type ComboPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ComboPageProps): Promise<Metadata> {
  const { slug } = await params;
  const combo = getCombo(slug);
  if (!combo) return { title: "Not found" };
  const title = `The best ${combo.style.name} prompt for ${combo.tool.name}`;
  return {
    title: `${title} | TasteLoop`,
    description: `A copy-paste ${combo.style.name} prompt tuned for ${combo.tool.name}: ${combo.style.blurb} Make ${combo.tool.name} output a premium, on-style UI instead of the default template.`,
  };
}

export default async function ComboPage({ params }: ComboPageProps) {
  const { slug } = await params;
  const combo = getCombo(slug);
  if (!combo) notFound();
  const { style, tool } = combo;
  const prompt = buildPrompt(style, tool);

  const relatedTools = TOOLS.filter((t) => t.slug !== tool.slug).slice(0, 5);
  const relatedStyles = STYLES.filter((s) => s.slug !== style.slug).slice(0, 6);

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link href="/prompts" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All style prompts
      </Link>

      <Reveal>
        <p className="mt-6 text-sm font-medium text-accent2">{style.name} · {tool.name}</p>
        <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          The best {style.name} prompt for {tool.name}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-white/60">
          {style.blurb} This prompt encodes the full design DNA so {tool.name} stops handing you the
          generic default and ships something that actually looks {style.name.toLowerCase()}.
        </p>
      </Reveal>

      <div className="mt-8">
        <CopyBlock text={prompt} label={`${style.name} prompt for ${tool.name}`} />
      </div>

      <div className="mt-6 rounded-xl border border-line bg-white/[0.02] p-4 text-sm text-white/70">
        <span className="font-medium text-white">How to use it in {tool.name}:</span> {tool.note}
      </div>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">What makes it read as {style.name}</h2>
      <ul className="mt-4 space-y-2">
        {style.dna.map((d) => (
          <li key={d} className="flex items-start gap-2 text-sm text-white/75">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent2" /> {d}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-white/60">
        The one move that sells the style: <span className="text-white">{style.signature}</span>. If you only get
        one detail right, get that one.
      </p>

      <div className="mt-12 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-accent/12 to-accent2/10 p-5">
        <Sparkles className="h-5 w-5 text-accent2" />
        <p className="flex-1 text-sm text-white/75">
          Need to decide whether this direction belongs in your real product?
        </p>
        <Link href="/work#intake" className="shrink-0 rounded-full bg-loop px-4 py-2 text-sm font-semibold text-ink transition hover:bg-loop/90">
          Get a Taste Review
        </Link>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/50">{style.name} for other tools</h3>
          <div className="mt-3 flex flex-col gap-1.5">
            {relatedTools.map((t) => (
              <Link key={t.slug} href={`/prompts/${style.slug}-for-${t.slug}`} className="text-sm text-white/70 transition hover:text-accent2">
                {style.name} for {t.name} →
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wider text-white/50">Other styles for {tool.name}</h3>
          <div className="mt-3 flex flex-col gap-1.5">
            {relatedStyles.map((s) => (
              <Link key={s.slug} href={`/prompts/${s.slug}-for-${tool.slug}`} className="text-sm text-white/70 transition hover:text-accent2">
                {s.name} for {tool.name} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
