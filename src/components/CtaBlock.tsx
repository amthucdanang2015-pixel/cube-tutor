import Link from "next/link";
import { Sparkles } from "lucide-react";

export function CtaBlock({
  text = "Need a clearer product decision before more output?",
  cta = "Get a Taste Review",
  href = "/work#intake",
}: {
  text?: string;
  cta?: string;
  href?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-accent/12 to-accent2/10 p-5">
      <Sparkles className="h-5 w-5 shrink-0 text-accent2" />
      <p className="flex-1 text-sm text-white/75">{text}</p>
      <Link href={href} className="shrink-0 rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition hover:bg-white/90">
        {cta}
      </Link>
    </div>
  );
}
