import { PageHeader } from "@/components/PageHeader";
import { ContentCard } from "@/components/ContentCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Loop tools for product teams | TasteLoop",
  description:
    "Free product tools from TasteLoop: clearer agent prompts, purposeful motion direction, landing-page critique, and a practical product QA checklist.",
};

const TOOLS = [
  { href: "/tools/prompt-builder", title: "Prompt Builder", description: "Pick product, section, style, motion and tool — get a tuned prompt plus design/motion rules and checklists.", accent: "from-violet-500/25 to-fuchsia-500/15" },
  { href: "/tools/motion-prompt-generator", title: "Motion Prompt Generator", description: "Generate a motion prompt with timing, easing, accessibility and performance guidance for any framework.", accent: "from-cyan-400/25 to-blue-600/15" },
  { href: "/tools/landing-page-roast", title: "Landing Page Roast", description: "Paste your hero copy and get a clarity / trust / CTA / differentiation score with specific fixes.", accent: "from-rose-400/25 to-orange-500/15" },
  { href: "/tools/ai-app-qa-checklist", title: "AI App QA Checklist", description: "An interactive pre-launch checklist across 14 areas. Track progress and export to Markdown.", accent: "from-emerald-400/25 to-teal-500/15" },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <PageHeader
        eyebrow="Open Loop · Free tools"
        title="Standards and utilities with the machinery left on."
        intro="Free, useful, and inspectable. Direct agents more clearly, describe motion precisely, test the promise above the fold, and run a real pre-launch QA pass."
      />
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((t) => (
          <ContentCard key={t.href} href={t.href} eyebrow="Free tool" title={t.title} description={t.description} accent={t.accent} />
        ))}
      </div>
    </div>
  );
}
