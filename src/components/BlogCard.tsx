import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { ArrowUpRight } from "lucide-react";

const CATEGORY_ACCENT: Record<string, string> = {
  "Product Judgment": "from-rose-500/25 to-orange-500/15",
  "Prompt Drops": "from-violet-500/25 to-fuchsia-500/15",
  "Motion & Craft": "from-cyan-400/25 to-blue-600/15",
  "Product Loops": "from-emerald-400/25 to-teal-600/15",
  "Traction & GTM": "from-amber-400/25 to-yellow-600/15",
  "Hot Takes": "from-indigo-400/25 to-violet-700/15",
};

export function BlogCard({ post, featured = false }: { post: PostMeta; featured?: boolean }) {
  const accent = CATEGORY_ACCENT[post.category] ?? "from-white/10 to-transparent";
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-white/20 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div className={`relative aspect-[16/7] overflow-hidden bg-gradient-to-br ${accent}`}>
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px] opacity-10" />
        <span className="absolute left-4 top-4 rounded-full border border-line bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className={`font-semibold leading-tight ${featured ? "text-xl" : "text-[15px]"}`}>{post.title}</h3>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-white/30 transition group-hover:text-white" />
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{post.description}</p>
        <div className="mt-4 flex items-center gap-2 text-[11px] text-white/40">
          <time>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
      </div>
    </Link>
  );
}
