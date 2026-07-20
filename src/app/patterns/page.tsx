import { PageHeader } from "@/components/PageHeader";
import { PatternsBrowser } from "@/components/PatternsBrowser";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Patterns — reusable UI, motion & product patterns | TasteLoop",
  description:
    "A free library of premium UI/UX, motion, and product patterns — each with copy-paste prompts for v0, Cursor, Claude Code, Lovable, Bolt and Figma Make, plus implementation and QA checklists.",
};

export default function PatternsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <PageHeader
        eyebrow="Pattern library"
        title="Patterns that make AI-built apps feel real."
        intro="Each pattern is a complete recipe: why it works, the UX and motion principle, copy-paste prompts for every AI tool, and implementation + QA checklists. Free."
      />
      <div className="mt-12">
        <PatternsBrowser />
      </div>
    </div>
  );
}
