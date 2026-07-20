import { TEARDOWNS, getTeardown } from "@/content/teardowns";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Check, AlertTriangle } from "lucide-react";
import { CopyBlock } from "@/components/CopyBlock";
import { CtaBlock } from "@/components/CtaBlock";

export function generateStaticParams() {
  return TEARDOWNS.map((t) => ({ slug: t.slug }));
}

type TeardownPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: TeardownPageProps): Promise<Metadata> {
  const { slug } = await params;
  const t = getTeardown(slug);
  if (!t) return { title: "Not found" };
  return { title: `${t.title} — teardown & lessons | TasteLoop`, description: t.description, openGraph: { title: t.title, description: t.description, type: "article" } };
}

export default async function TeardownPage({ params }: TeardownPageProps) {
  const { slug } = await params;
  const t = getTeardown(slug);
  if (!t) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link href="/teardowns" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All teardowns
      </Link>

      <p className="mt-6 text-sm text-muted">{t.reference}</p>
      <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{t.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-white/60">{t.description}</p>

      <Section title="What makes it good">
        <ul className="space-y-2">
          {t.whatsGood.map((g) => <li key={g} className="flex gap-2 text-sm leading-relaxed text-white/75"><Check className="mt-0.5 h-4 w-4 shrink-0 text-accent2" /> {g}</li>)}
        </ul>
      </Section>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Lesson title="UX lesson">{t.uxLesson}</Lesson>
        <Lesson title="Motion lesson">{t.motionLesson}</Lesson>
        <Lesson title="Product lesson">{t.productLesson}</Lesson>
      </div>

      <Section title="Prompt to recreate the principle">
        <CopyBlock text={t.recreatePrompt} label="Recreate prompt" />
      </Section>

      <Section title="How to adapt it safely"><p className="text-white/70">{t.adaptSafely}</p></Section>

      <Section title="Common AI mistakes">
        <ul className="space-y-2">
          {t.aiMistakes.map((m) => <li key={m} className="flex gap-2 text-sm leading-relaxed text-white/70"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" /> {m}</li>)}
        </ul>
      </Section>

      <div className="mt-12">
        <CtaBlock text="Want these principles tested against your product?" />
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
function Lesson({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/50">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{children}</p>
    </div>
  );
}
