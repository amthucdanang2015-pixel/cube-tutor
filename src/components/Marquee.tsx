const WORDS = [
  "stagger",
  "direction-aware",
  "layout animation",
  "scroll-scrub",
  "spring physics",
  "shared-element",
  "parallax",
  "magnetic hover",
  "crossfade",
  "kinetic type",
];

export function Marquee() {
  return (
    <div className="relative flex overflow-hidden border-y border-line py-5 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
        {[...WORDS, ...WORDS].map((w, i) => (
          <span
            key={i}
            className="whitespace-nowrap text-sm font-medium uppercase tracking-widest text-white/35"
          >
            {w} <span className="text-accent">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}
