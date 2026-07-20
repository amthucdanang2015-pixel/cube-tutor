import { PageHeader } from "@/components/PageHeader";
import { MotionPromptGenerator } from "@/components/tools/MotionPromptGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Motion Prompt Generator — tasteful animation prompts | TasteLoop",
  description: "Generate a motion prompt with timing, easing, accessibility, and performance guidance for CSS, React, Motion.dev, or Tailwind.",
};

export default function MotionGenPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <PageHeader eyebrow="Free tool" title="Motion Prompt Generator" intro="Pick the motion, the feel, and your framework — get a prompt that produces tasteful, performant, accessible animation instead of a gimmick." />
      <div className="mt-12">
        <MotionPromptGenerator />
      </div>
    </div>
  );
}
