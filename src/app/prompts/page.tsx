import { STYLES, TOOLS } from "@/data/pseo";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Style prompts for every AI builder — v0, Cursor, Lovable, Bolt | TasteLoop",
  description:
    "Free copy-paste prompts to make v0, Cursor, Lovable, Bolt, Figma Make and Claude output premium, on-style UI — neo-brutalism, glassmorphism, vaporwave, and more.",
};

export default function PromptsIndex() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Reveal>
        <p className="text-sm font-medium text-accent2">Style prompt library</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Pick a style. Pick your tool. Paste a prompt that doesn&apos;t look generic.
        </h1>
        <p className="mt-3 max-w-2xl text-white/55">
          {STYLES.length} aesthetics × {TOOLS.length} AI builders = {STYLES.length * TOOLS.length} tuned prompts.
          Each one encodes the design DNA so v0, Cursor, Lovable, Bolt, Figma Make or Claude stops
          shipping the default template.
        </p>
      </Reveal>

      <div className="mt-12 space-y-10">
        {STYLES.map((style) => (
          <div key={style.slug}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-xl font-semibold tracking-tight">{style.name}</h2>
              <p className="text-sm text-muted">{style.blurb}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/prompts/${style.slug}-for-${tool.slug}`}
                  className="rounded-full border border-line px-4 py-2 text-sm text-white/75 transition hover:border-white/30 hover:text-white"
                >
                  {style.name} for {tool.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
