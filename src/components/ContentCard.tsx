import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function ContentCard({
  href,
  eyebrow,
  title,
  description,
  meta,
  tags,
  accent = "from-white/10 to-transparent",
}: {
  href: string;
  eyebrow?: string;
  title: string;
  description: string;
  meta?: string[];
  tags?: string[];
  accent?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-white/20"
    >
      <div className={`relative aspect-[16/7] overflow-hidden bg-gradient-to-br ${accent}`}>
        <div className="absolute inset-0 [background-image:radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:22px_22px] opacity-10" />
        {eyebrow && (
          <span className="absolute left-4 top-4 rounded-full border border-line bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
            {eyebrow}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-semibold leading-tight">{title}</h3>
          <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-white/30 transition group-hover:text-white" />
        </div>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-muted">{description}</p>
        {meta && meta.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-white/40">
            {meta.map((m, i) => (
              <span key={m} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/20">·</span>}
                {m}
              </span>
            ))}
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] text-white/45">{t}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
