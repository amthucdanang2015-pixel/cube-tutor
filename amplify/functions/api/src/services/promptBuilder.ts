/**
 * Deterministic prompt + motion-prompt generation (no paid LLM required).
 * Mirrors the client-side tools so the API can power integrations later.
 */

const STYLE_RULES: Record<string, string[]> = {
  "premium dark": ["Near-black base, one jewel-tone accent used sparingly", "Hairline borders, soft glows, generous negative space"],
  "swiss minimal": ["Strict grid, oversized type, mono-accent color", "Whitespace as the primary design element"],
  "neo-brutalist": ["Thick borders, hard offset shadows, raw grotesk type", "Snap-on-hover interactions"],
  "soft gradient": ["Slow-drifting gradient mesh with grain", "Frosted surfaces; restrained accent"],
  editorial: ["Large serif display type, multi-column rhythm", "A clear point of view in the copy"],
  terminal: ["Monospace, phosphor glow, CRT-subtle texture", "Typewriter reveal with a caret"],
  playful: ["Rounded shapes, springy motion, warm pastels", "Delightful empty states"],
  "enterprise clean": ["Calm neutral palette, dense but scannable", "Strict type scale, tabular numerals"],
};

export function buildPrompt(input: {
  productType: string;
  section: string;
  style: string;
  motion: string;
  tool: string;
}): { prompt: string; designRules: string[]; motionRules: string[] } {
  const styleKey = input.style.toLowerCase();
  const designRules = STYLE_RULES[styleKey] ?? ["Senior-designer hierarchy, strict spacing scale, restrained accent"];
  const motionRules =
    input.motion.toLowerCase() === "none"
      ? ["Static entrance; still ease hover/interactive states"]
      : [`${input.motion}: ease-out, 200–400ms, transform/opacity only`, "prefers-reduced-motion fallback"];
  const isFigma = input.tool === "Figma Make";
  const stack = isFigma ? "as an interactive prototype" : "in Next.js + Tailwind with Motion (motion.dev)";
  const prompt = [
    `Build a ${input.section} for a ${input.productType} ${stack}, in a ${input.style} style.`,
    ``,
    `Style rules: ${designRules.join("; ")}.`,
    `Motion: ${motionRules.join("; ")}.`,
    `Quality bar: one focal point, strict spacing scale, three type weights, one meaningful accent, and designed empty/loading/error/success states. 60fps, GPU transforms, reduced-motion aware.`,
    `Avoid AI tells: centered-everything, default purple gradient, emoji bullets, uniform drop-shadow, feature-list headlines.`,
    isFigma ? `Deliver a clickable prototype with named components and states.` : `Output one self-contained, responsive component, no placeholder TODOs.`,
  ].join("\n");
  return { prompt, designRules, motionRules };
}

export function buildMotionPrompt(input: { type: string; feel: string; framework: string }): { prompt: string; timing: string } {
  const timing: Record<string, string> = {
    calm: "500–700ms, ease-in-out", premium: "300–450ms, ease-out, weighty", fast: "120–200ms, ease-out, snappy",
    playful: "spring (stiffness ~260, damping ~18)", cinematic: "700–1000ms, staged", minimal: "200–300ms, ease",
  };
  const t = timing[input.feel.toLowerCase()] ?? "300ms ease-out";
  const prompt = [
    `Implement a "${input.type}" animation that feels ${input.feel.toLowerCase()} using ${input.framework}.`,
    `Timing & easing: ${t}. Exits faster than entrances. Animate transform/opacity only; target 60fps.`,
    `Wrap in a prefers-reduced-motion check with a meaningful static fallback. No layout-triggering properties; pause off-screen loops.`,
    `Deliver one reusable, typed, self-contained piece.`,
  ].join("\n");
  return { prompt, timing: t };
}
