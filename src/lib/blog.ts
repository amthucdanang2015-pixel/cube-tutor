import fs from "fs";
import path from "path";
import matter from "gray-matter";

/**
 * Blog content system.
 * One Markdown file per post in `web/content/blog/<slug>.md`.
 * To add a post: drop a new .md file with the frontmatter below. That's it.
 *
 * Frontmatter schema (all strings unless noted):
 *   title       — the post headline (also the <h1> and <title>)
 *   description — 1–2 sentence meta description / list-card blurb (SEO + social)
 *   date        — YYYY-MM-DD (publish date; controls ordering)
 *   category    — one of CATEGORIES below (content pillar)
 *   tags        — array of short keyword strings
 *   xHook       — the tweet/Substack-note hook to repost this article with
 *   featured    — boolean (optional) — pin to the top of /blog
 *   draft       — boolean (optional) — hide from production listing
 */

export const CATEGORIES = [
  "Product Judgment",
  "Prompt Drops",
  "Motion & Craft",
  "Product Loops",
  "Traction & GTM",
  "Hot Takes",
] as const;
export type Category = (typeof CATEGORIES)[number];

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  xHook: string;
  featured: boolean;
  draft: boolean;
  readingMinutes: number;
}
export interface Post extends PostMeta {
  content: string;
}

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function readingTime(md: string): number {
  const words = md.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function normalizeDate(d: unknown): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  if (typeof d === "string") return d.slice(0, 10);
  return "1970-01-01";
}

function parseFile(file: string): Post | null {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data, content } = matter(raw);
  if (!data.title) return null;
  return {
    slug,
    title: data.title,
    description: data.description ?? "",
    date: normalizeDate(data.date),
    category: data.category ?? "Hot Takes",
    tags: Array.isArray(data.tags) ? data.tags : [],
    xHook: data.xHook ?? "",
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
    readingMinutes: readingTime(content),
    content,
  };
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map(parseFile)
    .filter((p): p is Post => p !== null && !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function postsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}
