import { getAllPosts, getPost } from "@/lib/blog";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Sparkles } from "lucide-react";
import { ArticleActions } from "@/components/ArticleActions";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

type PostPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Not found" };
  return {
    title: `${post.title} | TasteLoop`,
    description: post.description,
    openGraph: { title: post.title, description: post.description, type: "article" },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-white">
        <ArrowLeft className="h-4 w-4" /> All posts
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span className="rounded-full border border-line px-2.5 py-1 text-white/70">{post.category}</span>
        <span>·</span>
        <time>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
        <span>·</span>
        <span>{post.readingMinutes} min read</span>
      </div>

      <h1 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{post.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-white/60">{post.description}</p>

      <div className="prose prose-invert mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-accent2 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:rounded prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:before:content-[''] prose-code:after:content-[''] prose-pre:border prose-pre:border-line prose-pre:bg-black/50 prose-blockquote:border-l-accent prose-blockquote:text-white/70">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </div>

      <ArticleActions title={post.title} xHook={post.xHook} slug={post.slug} />

      <div className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-accent/12 to-accent2/10 p-5">
        <Sparkles className="h-5 w-5 text-accent2" />
        <p className="flex-1 text-sm text-white/75">
          Need to decide what your product should do next—and why?
        </p>
        <Link href="/work#intake" className="shrink-0 rounded-full bg-loop px-4 py-2 text-sm font-semibold text-ink transition hover:bg-loop/90">
          Get a Taste Review
        </Link>
      </div>

      {post.tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/45">#{t}</span>
          ))}
        </div>
      )}
    </article>
  );
}
