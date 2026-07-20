import { getAllPosts, CATEGORIES } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";
import { Reveal } from "@/components/Reveal";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product notes — judgment, craft, launch, and learning | TasteLoop",
  description:
    "Practical notes on product judgment, craft, agents, launch, and the feedback loops that turn output into stronger decisions.",
};

export default async function BlogIndex({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const active = (await searchParams).category;
  const all = getAllPosts();
  const posts = active ? all.filter((p) => p.category === active) : all;
  const featured = !active ? posts.filter((p) => p.featured).slice(0, 1) : [];
  const rest = posts.filter((p) => !featured.includes(p));

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-32">
      <Reveal>
        <p className="eyebrow">Notes from the loop</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Product judgment, craft, and evidence—written down.
        </h1>
        <p className="mt-3 max-w-2xl text-white/55">
          Field notes from choosing, making, reviewing, launching, and learning with real products. Useful standards and decisions, without abstract AI theater.
        </p>
      </Reveal>

      <div className="mt-10 flex flex-wrap gap-2">
        <Chip label="All" href="/blog" active={!active} />
        {CATEGORIES.map((c) => (
          <Chip key={c} label={c} href={`/blog?category=${encodeURIComponent(c)}`} active={active === c} />
        ))}
      </div>

      {posts.length === 0 ? (
        <p className="mt-16 text-white/50">No posts here yet — check back soon.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <BlogCard key={p.slug} post={p} featured />
          ))}
          {rest.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function Chip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-1.5 text-sm transition ${
        active ? "border-transparent bg-white text-ink" : "border-line text-white/60 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}
