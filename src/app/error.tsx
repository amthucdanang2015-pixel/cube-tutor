"use client";

import Link from "next/link";

/** Runtime error boundary — a designed state, not a white screen (D-019). */
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center px-6 text-center">
      <span className="h-3 w-3 rounded-full bg-gradient-to-br from-accent to-accent2" />
      <p className="mt-6 font-mono text-sm text-white/40">Something broke</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">That&apos;s on us.</h1>
      <p className="mt-3 max-w-md text-white/55">
        An unexpected error interrupted the page. Try again — and if it keeps happening, we genuinely want to know.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button onClick={reset} className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-white/90">
          Try again
        </button>
        <Link href="/" className="rounded-full border border-line px-5 py-2.5 text-sm text-white/85 transition hover:border-white/30">
          Back home
        </Link>
      </div>
    </div>
  );
}
