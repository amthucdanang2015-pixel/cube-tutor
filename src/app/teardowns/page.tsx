import { PageHeader } from "@/components/PageHeader";
import { ContentCard } from "@/components/ContentCard";
import { TEARDOWNS } from "@/content/teardowns";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teardowns — the principles behind great products | TasteLoop",
  description:
    "Principle-based teardowns of best-in-class product archetypes: the UX, motion, and product lessons — plus a prompt to recreate the principle in your own app.",
};

export default function TeardownsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <PageHeader
        eyebrow="Teardowns"
        title="Why the best products feel the way they do."
        intro="We break down archetypes of best-in-class products — the UX, motion, and business lessons — and give you a prompt to recreate the principle in your own product. Principles, not stolen pixels."
      />
      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {TEARDOWNS.map((t) => (
          <ContentCard
            key={t.slug}
            href={`/teardowns/${t.slug}`}
            eyebrow="Teardown"
            title={t.title}
            description={t.description}
            tags={t.tags}
            accent="from-amber-400/20 to-rose-500/15"
          />
        ))}
      </div>
    </div>
  );
}
