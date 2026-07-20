import type { CSSProperties } from "react";

export function Wordmark({
  animated = false,
  compact = false,
  tone = "light",
  className = "",
}: {
  animated?: boolean;
  compact?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  if (compact) {
    return (
      <span
        aria-label="Cube Tutor"
        className={`brand-compact-mark ${tone === "dark" ? "text-ink" : "text-white"} ${className}`}
      >
        <span aria-hidden="true">C</span>
        <span aria-hidden="true" className="brand-gate">/</span>
        <span aria-hidden="true">T</span>
      </span>
    );
  }

  const segments = ["C", "U", "B", "E", "/", "T", "U", "T", "O", "R"];
  return (
    <span
      aria-label="Cube Tutor"
      className={`brand-wordmark ${animated ? "wordmark-animated" : ""} ${tone === "dark" ? "text-ink" : "text-white"} ${className}`}
    >
      {segments.map((letter, index) => (
        <span
          aria-hidden="true"
          key={`${letter}-${index}`}
          className={letter === "/" ? "wordmark-letter brand-gate" : "wordmark-letter"}
          style={{ "--letter-index": index } as CSSProperties}
        >
          {letter}
        </span>
      ))}
    </span>
  );
}

export function BrandMark({
  tone = "dark",
  className = "",
}: {
  tone?: "light" | "dark";
  className?: string;
}) {
  const background = tone === "dark" ? "#0d0d0b" : "#f2f0e8";
  const foreground = tone === "dark" ? "#f2f0e8" : "#0d0d0b";
  const loop = tone === "dark" ? "#d9ff63" : "#5f7800";
  const signal = tone === "dark" ? "#ff7a59" : "#c63e24";
  return (
    <svg
      role="img"
      aria-label="Cube Tutor"
      viewBox="0 0 64 64"
      className={className}
    >
      <rect width="64" height="64" rx="16" fill={background} />
      <path
        d="M14 26c4-10 15-15 25-11 3 1 6 3 8 6M50 38c-4 10-15 15-25 11-3-1-6-3-8-6"
        fill="none"
        stroke={loop}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path d="M38 13 26 51" stroke={foreground} strokeWidth="5" strokeLinecap="round" />
      <circle cx="14" cy="26" r="3" fill={signal} />
      <circle cx="50" cy="38" r="3" fill={signal} />
    </svg>
  );
}
