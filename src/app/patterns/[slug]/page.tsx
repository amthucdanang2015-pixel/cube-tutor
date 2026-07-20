import { PATTERNS, getPattern } from "@/content/patterns";
import { getCategory } from "@/content/categories";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, X, AlertTriangle } from "lucide-react";
import { CopyBlock } from "@/components/CopyBlock";
import { CtaBlock } from "@/components/CtaBlock";

export function generateStaticParams() {
  return PATTERNS.map((p) => ({ slug: p.slug }));
}

type PatternPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PatternPageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = getPattern(slug);
  if (!p) return { title: "Not found" };
  return {
    title: `${p.title} — pattern, prompts & checklists | TasteLoop`,
    description: p.description,
    openGraph: { title: p.title, description: p.description, type: "article" },
  };
}

export default async function PatternPage({ params }: PatternPageProps) {
  const { slug } = await params;
  const p = getPattern(slug);
  if (!p) notFound();
  const cat = getCategory(p.category);
  const related = p.related.map(getPattern).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: p.title,
    description: p.description,
    dateModified: p.updatedAt,
    keywords: p.tags.join(", "),
    articleSection: cat?.name,
  };

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/patterns" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All patterns
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted">
        {cat && <Link href={`/showcase`} className="rounded-full border border-line px-2.5 py-1 text-white/70">{cat.name}</Link>}
        <span className="rounded-full border border-line px-2.5 py-1 text-white/70">{p.difficulty}</span>
        {p.tags.map((t) => <span key={t} className="text-white/30">#{t}</span>)}
      </div>

      <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{p.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-white/60">{p.description}</p>

      {cat && (
        <div className={`mt-8 overflow-hidden rounded-2xl border border-line bg-gradient-to-br ${cat.accent} p-5`}>
          <p className="text-xs font-medium uppercase tracking-widest text-white/60">Visual reference</p>
          <p className="mt-2 text-sm leading-relaxed text-white/85">{p.visualReference}</p>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Mini title="Best used for" tone="good">{p.bestFor}</Mini>
        <Mini title="Avoid when" tone="bad">{p.avoidWhen}</Mini>
      </div>

      <Section title="Why it works"><p className="text-white/70">{p.whyItWorks}</p></Section>
      <Section title="UX principle"><p className="text-white/70">{p.uxPrinciple}</p></Section>
      {p.motionPrinciple && <Section title="Motion principle"><p className="text-white/70">{p.motionPrinciple}</p></Section>}

      <Section title="Copy-paste prompts">
        <div className="space-y-5">
          <CopyBlock text={p.prompts.v0} label="Prompt for v0" />
          <CopyBlock text={p.prompts.agent} label="Prompt for Cursor / Claude Code / Codex" />
          <CopyBlock text={p.prompts.scaffold} label="Prompt for Lovable / Bolt" />
          <CopyBlock text={p.prompts.figma} label="Prompt for Figma Make" />
        </div>
      </Section>

      <Section title="Implementation checklist"><CheckList items={p.implementation} /></Section>
      <Section title="QA checklist"><CheckList items={p.qa} /></Section>

      <Section title="Common AI mistakes">
        <ul className="space-y-2">
          {p.aiMistakes.map((m) => (
            <li key={m} className="flex gap-2 text-sm leading-relaxed text-white/70">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /> {m}
            </li>
          ))}
        </ul>
      </Section>

      {related.length > 0 && (
        <Section title="Related patterns">
          <div className="flex flex-col gap-1.5">
            {related.map((r) => (
              <Link key={r!.slug} href={`/patterns/${r!.slug}`} className="text-sm text-white/70 transition hover:text-accent2">
                {r!.title} →
              </Link>
            ))}
          </div>
        </Section>
      )}

      <div className="mt-12">
        <CtaBlock />
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</h2>
      <div className="mt-3 text-[15px] leading-relaxed">{children}</div>
    </section>
  );
}

function Mini({ title, tone, children }: { title: string; tone: "good" | "bad"; children: React.ReactNode }) {
  const Icon = tone === "good" ? Check : X;
  const color = tone === "good" ? "text-emerald-400" : "text-rose-400";
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{children}</p>
    </div>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((i) => (
        <li key={i} className="flex gap-2 text-sm leading-relaxed text-white/75">
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent2" /> {i}
        </li>
      ))}
    </ul>
  );
}
