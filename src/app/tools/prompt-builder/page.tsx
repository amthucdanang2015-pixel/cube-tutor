import { PageHeader } from "@/components/PageHeader";
import { PromptBuilder } from "@/components/tools/PromptBuilder";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prompt Builder — tuned UI prompts for v0, Cursor, Lovable | TasteLoop",
  description: "Pick a product type, section, style, motion and target tool — get a copy-paste prompt with design rules, motion rules, and implementation + QA checklists.",
};

export default function PromptBuilderPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <PageHeader eyebrow="Free tool" title="Prompt Builder" intro="Configure the build, get a prompt that won't come out generic — plus the design rules, motion rules, and checklists to ship it well." />
      <div className="mt-12">
        <PromptBuilder />
      </div>
    </div>
  );
}
