import { SITES, getSite } from "@/data/showcase";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteDetail } from "./SiteDetail";

export function generateStaticParams() {
  return SITES.map((s) => ({ slug: s.slug }));
}

type ShowcasePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ShowcasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const site = getSite(slug);
  if (!site) return { title: "Not found" };
  return {
    title: `${site.title} — prompt + how to build it | TasteLoop`,
    description: `${site.concept} Copy-paste prompt for v0, Cursor, Lovable and Bolt.`,
  };
}

export default async function Page({ params }: ShowcasePageProps) {
  const { slug } = await params;
  const site = getSite(slug);
  if (!site) notFound();
  return <SiteDetail site={site} />;
}
