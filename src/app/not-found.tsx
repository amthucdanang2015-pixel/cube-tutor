import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** 404 — a designed state, not a default (D-019). On-brand, one clear way out. */
export default function NotFound() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <span className="h-3 w-3 rounded-full bg-gradient-to-br from-accent to-accent2" />
      <p className="mt-6 font-mono text-sm text-white/40">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">This page doesn&apos;t exist.</h1>
      <p className="mt-3 max-w-md text-white/55">
        Which is ironic, because shipping things that actually exist is the whole pitch.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-white/90">
          Back home <ArrowRight className="h-4 w-4" />
        </Link>
        <Link href="/#proof" className="rounded-full border border-line px-5 py-2.5 text-sm text-white/85 transition hover:border-white/30">
          See the shipped work
        </Link>
      </div>
    </div>
  );
}
