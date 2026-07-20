import { ShowcaseGrid } from "@/components/ShowcaseGrid";
import { Reveal } from "@/components/Reveal";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Showcase — 30 motion sites + prompts | TasteLoop",
  description:
    "30 world-class UI/UX motion sites, each with a copy-paste prompt for v0, Cursor, Lovable and Bolt. First 10 free.",
};

export default function ShowcasePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Reveal>
        <p className="text-sm font-medium text-accent2">Showcase</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
          30 motion sites. Every prompt.
        </h1>
        <p className="mt-3 max-w-2xl text-white/55">
          Curated for first-three-seconds impact and buildability. Click any card
          to read the concept and copy the exact prompt. Free prompts unlock with
          your email; the full set is Pro.
        </p>
      </Reveal>
      <div className="mt-12">
        <ShowcaseGrid />
      </div>
    </div>
  );
}
