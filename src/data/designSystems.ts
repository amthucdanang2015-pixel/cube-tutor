/**
 * The Design-System Switcher (constitution D-008).
 * One interactive demo app, re-themed live by these token sets.
 * Adding a system = one object here. Later SEO play: one page per system.
 */

export interface DsTokens {
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accentText: string;
  border: string;
  radius: string; // card radius
  ctlRadius: string; // buttons/inputs radius
  shadow: string; // card shadow
  font: string; // font-family stack
  headWeight: number;
  upper?: boolean; // uppercase headings
  borderW: string;
}

export interface DesignSystem {
  slug: string;
  name: string;
  blurb: string;
  mode: "light" | "dark";
  type: "sans" | "serif" | "mono";
  dna: string[]; // the traits a prompt must encode
  avoid: string; // the one thing that ruins it
  t: DsTokens;
  /** explicit facet choices (set by resolveStyle); fall back to slug lookups */
  motion?: MotionTokens;
  fx?: FxKind;
  /** custom colors for the "gradient" fx */
  fxColors?: [string, string];
  loading?: LoadingKind;
  splash?: SplashKind;
  transitionK?: TransitionKind;
  /** icon stroke width (ICON_STYLES facet) */
  iconSw?: number;
}

const SANS = `ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif`;
const SERIF = `Georgia, "Times New Roman", ui-serif, serif`;
const MONO = `ui-monospace, "SF Mono", Menlo, Consolas, monospace`;

export const DESIGN_SYSTEMS: DesignSystem[] = [
  {
    slug: "monochrome", name: "Monochrome", mode: "light", type: "sans",
    blurb: "Pure black on white. No accent colors — hierarchy does all the work.",
    dna: ["pure #000 on #fff, zero accent color", "dramatic size contrast for hierarchy", "hairline 1px rules", "generous whitespace", "underline-only links"],
    avoid: "Adding even one color — grays and weight carry everything.",
    t: { bg: "#ffffff", surface: "#ffffff", text: "#0a0a0a", muted: "#6b6b6b", accent: "#0a0a0a", accentText: "#ffffff", border: "#0a0a0a", radius: "2px", ctlRadius: "2px", shadow: "none", font: SANS, headWeight: 700, borderW: "1px" },
  },
  {
    slug: "swiss", name: "Swiss Minimal", mode: "light", type: "sans",
    blurb: "Strict grid, oversized Helvetica-grade type, one red accent.",
    dna: ["ruthless 12-col grid alignment", "oversized grotesk headlines", "a single signal-red accent", "asymmetric layout, generous margins", "no decoration — structure is the style"],
    avoid: "Centering everything — Swiss lives on the grid's tension.",
    t: { bg: "#f4f2ed", surface: "#ffffff", text: "#111111", muted: "#77726a", accent: "#e63b2e", accentText: "#ffffff", border: "#d8d4cc", radius: "0px", ctlRadius: "0px", shadow: "none", font: SANS, headWeight: 800, borderW: "1px" },
  },
  {
    slug: "neo-brutalism", name: "Neo-Brutalism", mode: "light", type: "sans",
    blurb: "Thick borders, hard offset shadows, loud primary color. Thunks into place.",
    dna: ["3px solid black borders on everything", "hard offset box-shadows (6px 6px 0 #000)", "one loud primary (yellow/pink)", "chunky raw grotesk type", "snap interactions — shadow collapses on press"],
    avoid: "Soft shadows or gradients — brutalism is hard edges only.",
    t: { bg: "#fdf6e3", surface: "#ffffff", text: "#111111", muted: "#555555", accent: "#ffd60a", accentText: "#111111", border: "#111111", radius: "10px", ctlRadius: "10px", shadow: "6px 6px 0 #111111", font: SANS, headWeight: 900, upper: true, borderW: "3px" },
  },
  {
    slug: "bauhaus", name: "Bauhaus", mode: "light", type: "sans",
    blurb: "Primary red-yellow-blue, geometric shapes, constructivist balance.",
    dna: ["red/yellow/blue + black on off-white", "circles, triangles, squares as motifs", "asymmetric constructivist balance", "bold geometric sans, tight leading", "flat color blocks, no gradients"],
    avoid: "Pastels or rounded-friendly shapes — keep the geometry rigorous.",
    t: { bg: "#f5f0e6", surface: "#ffffff", text: "#1a1a1a", muted: "#6e6a61", accent: "#d02e26", accentText: "#ffffff", border: "#1a1a1a", radius: "0px", ctlRadius: "999px", shadow: "4px 4px 0 #1a1a1a", font: SANS, headWeight: 800, upper: true, borderW: "2px" },
  },
  {
    slug: "terminal", name: "Terminal", mode: "dark", type: "mono",
    blurb: "Phosphor green on near-black. Monospace precision, CRT soul.",
    dna: ["phosphor green (#22ff88-ish) on #050805", "everything monospace, incl. headings", "1px green borders, no shadows", "text glow (subtle text-shadow)", "$ prompts, brackets, ASCII details"],
    avoid: "Mixing in a sans-serif — the mono grid is the aesthetic.",
    t: { bg: "#050806", surface: "#0a0f0b", text: "#4ade80", muted: "#22c55e99", accent: "#4ade80", accentText: "#050806", border: "#14532d", radius: "4px", ctlRadius: "4px", shadow: "none", font: MONO, headWeight: 700, borderW: "1px" },
  },
  {
    slug: "vaporwave", name: "Vaporwave", mode: "dark", type: "sans",
    blurb: "Magenta-cyan sunset on deep violet. 80s grid horizon energy.",
    dna: ["hot magenta + cyan on deep violet-navy", "sunset-gradient accents", "glow shadows (neon bloom)", "wide letter-spacing, chrome vibes", "retro grid / horizon motifs"],
    avoid: "Muted tasteful colors — vaporwave commits to the neon.",
    t: { bg: "#150c2e", surface: "#1d1240", text: "#f4e9ff", muted: "#a78bda", accent: "#ff4fd8", accentText: "#150c2e", border: "#3d2a75", radius: "14px", ctlRadius: "999px", shadow: "0 0 24px rgba(255,79,216,0.35)", font: SANS, headWeight: 800, upper: true, borderW: "1px" },
  },
  {
    slug: "glass", name: "Glassmorphism", mode: "dark", type: "sans",
    blurb: "Frosted panels floating over color. Depth from blur and light.",
    dna: ["translucent frosted surfaces (backdrop-blur)", "1px white/20 borders + inner highlight", "soft colored glow behind panels", "airy spacing, floating depth layers", "light text on deep ambient color"],
    avoid: "Opaque flat cards — the see-through depth is the point.",
    t: { bg: "#0d1b2e", surface: "rgba(255,255,255,0.08)", text: "#f2f7ff", muted: "#9fb3cc", accent: "#5eb0ff", accentText: "#06121f", border: "rgba(255,255,255,0.18)", radius: "20px", ctlRadius: "14px", shadow: "0 24px 60px -16px rgba(0,0,0,0.6)", font: SANS, headWeight: 600, borderW: "1px" },
  },
  {
    slug: "clay", name: "Claymorphism", mode: "light", type: "sans",
    blurb: "Puffy 3D pastel shapes with soft double shadows. Squishy and friendly.",
    dna: ["puffy rounded shapes (24px+ radius)", "double soft shadows: outer drop + inner highlight", "pastel palette on warm paper", "chunky friendly type", "squish-on-press interactions"],
    avoid: "Sharp corners or hard shadows — everything is dough.",
    t: { bg: "#fdf3ec", surface: "#ffffff", text: "#3d3049", muted: "#9b8fa8", accent: "#8b5cf6", accentText: "#ffffff", border: "#f3e4d7", radius: "26px", ctlRadius: "999px", shadow: "0 14px 30px -10px rgba(139,92,246,0.25), inset 0 -4px 8px rgba(0,0,0,0.04)", font: SANS, headWeight: 800, borderW: "1px" },
  },
  {
    slug: "editorial", name: "Editorial Serif", mode: "light", type: "serif",
    blurb: "Magazine layout: big serif display, hairline rules, ink on paper.",
    dna: ["large serif display type, tight leading", "hairline rules between sections", "ink #1a1a1a on warm paper", "small-caps labels, drop-cap moments", "restrained single accent (oxblood)"],
    avoid: "Rounded buttons and app-y chrome — it should read like print.",
    t: { bg: "#faf7f0", surface: "#faf7f0", text: "#1c1a17", muted: "#8a8378", accent: "#7f1d1d", accentText: "#faf7f0", border: "#d9d2c4", radius: "0px", ctlRadius: "0px", shadow: "none", font: SERIF, headWeight: 700, borderW: "1px" },
  },
  {
    slug: "dark-luxury", name: "Dark Luxury", mode: "dark", type: "serif",
    blurb: "Near-black, champagne gold, serif poise. Slow and expensive.",
    dna: ["#0b0b0d base with champagne-gold accent", "serif display + quiet sans details", "fine 1px gold hairlines", "enormous whitespace, few elements", "slow, weighty transitions"],
    avoid: "Bright colors or dense layouts — luxury is restraint.",
    t: { bg: "#0c0b09", surface: "#141310", text: "#ece7dd", muted: "#948d7e", accent: "#d4b473", accentText: "#0c0b09", border: "#2c2921", radius: "6px", ctlRadius: "6px", shadow: "0 30px 60px -20px rgba(0,0,0,0.8)", font: SERIF, headWeight: 600, borderW: "1px" },
  },
  {
    slug: "y2k", name: "Y2K Chrome", mode: "light", type: "sans",
    blurb: "Glossy aqua, silver chrome, bubble buttons. Optimistic 2001 tech.",
    dna: ["aqua-blue glossy gradients", "silver/chrome borders and bevels", "pill bubble buttons with shine", "sky-blue on white, lens-flare optimism", "rounded translucent panels"],
    avoid: "Flat matte surfaces — Y2K is gloss and bevel.",
    t: { bg: "#eaf4ff", surface: "#ffffff", text: "#0b3a66", muted: "#5c86ad", accent: "#22a7f0", accentText: "#ffffff", border: "#bcd9f2", radius: "22px", ctlRadius: "999px", shadow: "0 10px 24px -8px rgba(34,167,240,0.35), inset 0 2px 0 rgba(255,255,255,0.9)", font: SANS, headWeight: 800, borderW: "1px" },
  },
  {
    slug: "cyberpunk", name: "Cyberpunk", mode: "dark", type: "mono",
    blurb: "Neon magenta and acid cyan over black. HUD frames, glitch energy.",
    dna: ["neon magenta + acid cyan on #060608", "HUD-style corner brackets and frames", "mono labels, uppercase, wide tracking", "glow borders, scanline texture", "glitch/RGB-split hover moments"],
    avoid: "Soft pastels or friendly rounding — it's a machine interface.",
    t: { bg: "#07070b", surface: "#0d0d14", text: "#e6f6ff", muted: "#6b7a8f", accent: "#ff2ec4", accentText: "#07070b", border: "#26263a", radius: "2px", ctlRadius: "2px", shadow: "0 0 20px rgba(255,46,196,0.25)", font: MONO, headWeight: 700, upper: true, borderW: "1px" },
  },
  {
    slug: "pastel", name: "Soft Pastel", mode: "light", type: "sans",
    blurb: "Milky lavender and mint, gentle radius, weightless friendly UI.",
    dna: ["milky pastels (lavender/mint/peach)", "generous 16-20px radius", "feather-soft shadows", "medium-weight friendly sans", "airy, low-contrast calm"],
    avoid: "Black borders or hard contrast — keep everything gentle.",
    t: { bg: "#f6f4fb", surface: "#ffffff", text: "#42405a", muted: "#9d9ab5", accent: "#a78bfa", accentText: "#ffffff", border: "#e9e6f5", radius: "18px", ctlRadius: "14px", shadow: "0 12px 28px -12px rgba(120,110,180,0.18)", font: SANS, headWeight: 700, borderW: "1px" },
  },
  {
    slug: "enterprise", name: "Enterprise Clean", mode: "light", type: "sans",
    blurb: "Calm blue, dense-but-scannable, built for trust and daily use.",
    dna: ["calm corporate blue on white/gray-50", "strict 4px spacing scale, dense tables", "small precise type, tabular numbers", "subtle 1px gray borders", "restrained shadows, zero decoration"],
    avoid: "Playful color or big display type — clarity over character.",
    t: { bg: "#f7f9fb", surface: "#ffffff", text: "#1a2733", muted: "#64748b", accent: "#2563eb", accentText: "#ffffff", border: "#e2e8f0", radius: "8px", ctlRadius: "6px", shadow: "0 1px 3px rgba(16,24,40,0.08)", font: SANS, headWeight: 600, borderW: "1px" },
  },
  {
    slug: "newsprint", name: "Newsprint", mode: "light", type: "serif",
    blurb: "Black-and-white broadsheet: columns, rules, and ink texture.",
    dna: ["pure black ink on newsprint gray-white", "serif headlines, condensed hierarchy", "double rules and column dividers", "justified dense body text", "no color except one stamp-red"],
    avoid: "Color photography vibes or soft UI chrome — it's a newspaper.",
    t: { bg: "#f2efe9", surface: "#f2efe9", text: "#181614", muted: "#6e6a63", accent: "#181614", accentText: "#f2efe9", border: "#181614", radius: "0px", ctlRadius: "0px", shadow: "none", font: SERIF, headWeight: 800, upper: true, borderW: "2px" },
  },
  {
    slug: "midnight", name: "Midnight SaaS", mode: "dark", type: "sans",
    blurb: "The premium dark default: near-black, one violet accent, hairlines.",
    dna: ["#0a0a0b base, white/8 hairline borders", "one jewel accent (violet) used sparingly", "three type weights, tight display tracking", "soft glows only behind key elements", "eased 200-400ms motion everywhere"],
    avoid: "Multiple accent colors — one jewel tone, used for meaning.",
    t: { bg: "#0a0a0b", surface: "#131316", text: "#f4f4f5", muted: "#8a8a93", accent: "#7c5cff", accentText: "#ffffff", border: "rgba(255,255,255,0.09)", radius: "16px", ctlRadius: "10px", shadow: "0 20px 50px -20px rgba(0,0,0,0.7)", font: SANS, headWeight: 700, borderW: "1px" },
  },
];

/** Compose the copy-paste prompt for a system (consistent, practical, honest). */
export function dsPrompt(ds: DesignSystem): string {
  return [
    `Restyle my app in a ${ds.name} design system. ${ds.blurb}`,
    ``,
    `Apply this DNA everywhere, unmistakably:`,
    ...ds.dna.map((d) => `- ${d}`),
    ``,
    `Core tokens: background ${ds.t.bg} · surface ${ds.t.surface} · text ${ds.t.text} · muted ${ds.t.muted} · accent ${ds.t.accent} · border ${ds.t.border} (${ds.t.borderW}) · card radius ${ds.t.radius} · ${ds.type === "serif" ? "serif display type" : ds.type === "mono" ? "monospace type throughout" : "grotesk/sans type"}, heading weight ${ds.t.headWeight}${ds.t.upper ? ", uppercase headings" : ""}.`,
    ``,
    `Motion language: ${ds.motion ? `${ds.motion.ease === "snap" ? "snappy and instant (~170ms)" : ds.motion.ease === "bounce" ? "springy with playful overshoot" : ds.motion.ease === "slow" ? "slow and cinematic (~600ms)" : "calm ease-out (~350ms)"}` : "calm 200–400ms ease-out"}; transform/opacity only; respect prefers-reduced-motion.${ds.fx && ds.fx !== "none" ? ` Background: a subtle animated ${ds.fx} effect behind content.` : ""}`,
    `Keep hierarchy honest: one focal point per screen, a strict spacing scale, designed empty/loading/error states.`,
    `Avoid: ${ds.avoid}`,
  ].join("\n");
}

export function getDesignSystem(slug: string): DesignSystem | undefined {
  return DESIGN_SYSTEMS.find((d) => d.slug === slug);
}

/* ================= Living Preview Engine — style API (D-012) =================
 * Styles contribute tokens only. Motion + background fx live here as data,
 * keyed by slug, with sensible defaults — the engine never special-cases a style.
 */

export interface MotionTokens {
  /** base duration in ms for scene/element transitions */
  dur: number;
  /** framer-motion ease or spring hint */
  ease: "ease-out" | "snap" | "bounce" | "slow" | "elastic" | "drift" | "swift" | "stepped";
}

export type FxKind = "none" | "glow" | "grid" | "scanlines" | "dots" | "aurora" | "mesh" | "noise" | "gradient";
export type LoadingKind = "skeleton" | "spinner" | "dots" | "progress";
export type SplashKind = "draw" | "pop" | "fade" | "type";
export type TransitionKind = "rise" | "slide" | "scale" | "blur";

const MOTION_BY_SLUG: Record<string, MotionTokens> = {
  "neo-brutalism": { dur: 180, ease: "snap" },
  bauhaus: { dur: 200, ease: "snap" },
  terminal: { dur: 160, ease: "snap" },
  cyberpunk: { dur: 180, ease: "snap" },
  clay: { dur: 420, ease: "bounce" },
  pastel: { dur: 380, ease: "bounce" },
  y2k: { dur: 380, ease: "bounce" },
  editorial: { dur: 550, ease: "slow" },
  newsprint: { dur: 500, ease: "slow" },
  "dark-luxury": { dur: 650, ease: "slow" },
};

const FX_BY_SLUG: Record<string, FxKind> = {
  terminal: "scanlines",
  cyberpunk: "grid",
  vaporwave: "glow",
  glass: "glow",
  midnight: "glow",
  "dark-luxury": "glow",
  y2k: "dots",
};

export function dsMotion(ds: DesignSystem): MotionTokens {
  return ds.motion ?? MOTION_BY_SLUG[ds.slug] ?? { dur: 320, ease: "ease-out" };
}
export function dsFx(ds: DesignSystem): FxKind {
  return ds.fx ?? FX_BY_SLUG[ds.slug] ?? "none";
}

/* ================= Facet libraries (D-013) =================
 * A design language = preset + curated facet overrides. Each facet is one data
 * object; the engine only ever sees the resolved DesignSystem.
 */

export interface Palette {
  slug: string;
  name: string;
  inspiredBy: string;
  mode: "light" | "dark";
  bg: string; surface: string; text: string; muted: string;
  accent: string; accentText: string; border: string;
}

export const PALETTES: Palette[] = [
  { slug: "cupertino", name: "Cupertino", inspiredBy: "Apple", mode: "light", bg: "#f5f5f7", surface: "#ffffff", text: "#1d1d1f", muted: "#86868b", accent: "#0071e3", accentText: "#ffffff", border: "#e8e8ed" },
  { slug: "cosmic", name: "Cosmic", inspiredBy: "Linear", mode: "dark", bg: "#0b0b10", surface: "#15151d", text: "#eeeff2", muted: "#8b8d98", accent: "#5e6ad2", accentText: "#ffffff", border: "#26262f" },
  { slug: "receipt", name: "Receipt", inspiredBy: "Stripe", mode: "light", bg: "#f6f9fc", surface: "#ffffff", text: "#0a2540", muted: "#6b7c93", accent: "#635bff", accentText: "#ffffff", border: "#e3e8ee" },
  { slug: "stage", name: "Stage", inspiredBy: "Spotify", mode: "dark", bg: "#121212", surface: "#1d1d1d", text: "#f5f5f5", muted: "#a7a7a7", accent: "#1db954", accentText: "#0b0b0b", border: "#2a2a2a" },
  { slug: "signal", name: "Signal", inspiredBy: "TikTok", mode: "dark", bg: "#0a0a0a", surface: "#161616", text: "#fafafa", muted: "#8e8e8e", accent: "#fe2c55", accentText: "#ffffff", border: "#262626" },
  { slug: "golden-hour", name: "Golden Hour", inspiredBy: "Instagram", mode: "light", bg: "#fffaf5", surface: "#ffffff", text: "#262626", muted: "#8e8e8e", accent: "#e1306c", accentText: "#ffffff", border: "#f2e9e0" },
  { slug: "lab", name: "Lab", inspiredBy: "OpenAI", mode: "light", bg: "#f7f7f8", surface: "#ffffff", text: "#202123", muted: "#6e6e80", accent: "#10a37f", accentText: "#ffffff", border: "#e5e5e9" },
  { slug: "material-you", name: "Material You", inspiredBy: "Google Material", mode: "light", bg: "#fef7ff", surface: "#ffffff", text: "#1c1b1f", muted: "#79747e", accent: "#6750a4", accentText: "#ffffff", border: "#e7e0ec" },
  { slug: "honey", name: "Honey", inspiredBy: "Happy Hues", mode: "light", bg: "#fffdf7", surface: "#ffffff", text: "#33272a", muted: "#9a8f97", accent: "#ff8e3c", accentText: "#2b2024", border: "#f0e7db" },
  { slug: "abyss", name: "Abyss", inspiredBy: "Vercel", mode: "dark", bg: "#000000", surface: "#111111", text: "#fafafa", muted: "#888888", accent: "#ffffff", accentText: "#000000", border: "#333333" },
];

export interface Typeface {
  slug: string;
  name: string;
  stack: string;
  headWeight: number;
  vibe: string;
}

export const TYPEFACES: Typeface[] = [
  { slug: "sans", name: "Sans", stack: `ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif`, headWeight: 700, vibe: "neutral, modern" },
  { slug: "serif", name: "Serif", stack: `Georgia, "Times New Roman", ui-serif, serif`, headWeight: 700, vibe: "editorial, established" },
  { slug: "mono", name: "Mono", stack: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`, headWeight: 700, vibe: "technical, precise" },
  { slug: "rounded", name: "Rounded", stack: `ui-rounded, "SF Pro Rounded", "Nunito", "Varela Round", system-ui, sans-serif`, headWeight: 800, vibe: "friendly, soft" },
  { slug: "geometric", name: "Geometric", stack: `"Futura", "Century Gothic", "Avant Garde", "Poppins", system-ui, sans-serif`, headWeight: 700, vibe: "constructed, confident" },
  { slug: "editorial", name: "Editorial", stack: `"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`, headWeight: 600, vibe: "magazine, literary" },
  { slug: "humanist", name: "Humanist", stack: `Seravek, "Gill Sans", "Segoe UI", Verdana, system-ui, sans-serif`, headWeight: 600, vibe: "warm, legible" },
];

export interface MotionChoice { slug: string; name: string; tokens: MotionTokens; feel: string }
export const MOTIONS: MotionChoice[] = [
  { slug: "calm", name: "Calm", tokens: { dur: 420, ease: "ease-out" }, feel: "soft entrances, unhurried" },
  { slug: "snappy", name: "Snappy", tokens: { dur: 170, ease: "snap" }, feel: "instant, keyboard-fast" },
  { slug: "swift", name: "Swift", tokens: { dur: 240, ease: "swift" }, feel: "quick with a soft landing" },
  { slug: "bouncy", name: "Bouncy", tokens: { dur: 400, ease: "bounce" }, feel: "springy, playful weight" },
  { slug: "elastic", name: "Elastic", tokens: { dur: 520, ease: "elastic" }, feel: "big overshoot, rubber snap" },
  { slug: "cinematic", name: "Cinematic", tokens: { dur: 620, ease: "slow" }, feel: "slow, weighty, dramatic" },
  { slug: "drift", name: "Drift", tokens: { dur: 800, ease: "drift" }, feel: "weightless, floating in" },
  { slug: "stepped", name: "Stepped", tokens: { dur: 300, ease: "stepped" }, feel: "mechanical, tick-tick precise" },
];

/** Curated visual backgrounds (D-014): each swatch previews the real thing. */
export interface BgPreset { slug: string; name: string; fx: FxKind; colors?: [string, string] }
export const BG_PRESETS: BgPreset[] = [
  { slug: "clean", name: "Clean", fx: "none" },
  { slug: "glow", name: "Glow", fx: "glow" },
  { slug: "aurora", name: "Aurora", fx: "aurora" },
  { slug: "mesh", name: "Mesh", fx: "mesh" },
  { slug: "sunset", name: "Sunset", fx: "gradient", colors: ["#ff7e5f", "#feb47b"] },
  { slug: "candy", name: "Candy", fx: "gradient", colors: ["#ff6ec4", "#7873f5"] },
  { slug: "ocean", name: "Ocean", fx: "gradient", colors: ["#00c6ff", "#0072ff"] },
  { slug: "lime", name: "Limeade", fx: "gradient", colors: ["#a8ff78", "#78ffd6"] },
  { slug: "royal", name: "Royal", fx: "gradient", colors: ["#7f00ff", "#e100ff"] },
  { slug: "ember", name: "Ember", fx: "gradient", colors: ["#f83600", "#f9d423"] },
  { slug: "midnight", name: "Midnight", fx: "gradient", colors: ["#232526", "#414345"] },
  { slug: "polar", name: "Polar", fx: "gradient", colors: ["#a1c4fd", "#c2e9fb"] },
  { slug: "grid", name: "Grid", fx: "grid" },
  { slug: "dots", name: "Dots", fx: "dots" },
  { slug: "noise", name: "Noise", fx: "noise" },
  { slug: "scanlines", name: "Scanlines", fx: "scanlines" },
];

/** Icon style facet: stroke weight of every icon in the app. */
export interface IconStyle { slug: string; name: string; sw: number }
export const ICON_STYLES: IconStyle[] = [
  { slug: "line", name: "Line", sw: 1.25 },
  { slug: "regular", name: "Regular", sw: 1.75 },
  { slug: "bold", name: "Bold", sw: 2.5 },
];

export interface FxChoice { slug: FxKind; name: string }
export const FX_CHOICES: FxChoice[] = [
  { slug: "none", name: "Clean" },
  { slug: "gradient", name: "Gradient" },
  { slug: "glow", name: "Glow" },
  { slug: "aurora", name: "Aurora" },
  { slug: "mesh", name: "Mesh" },
  { slug: "grid", name: "Grid" },
  { slug: "dots", name: "Dots" },
  { slug: "noise", name: "Noise" },
  { slug: "scanlines", name: "Scanlines" },
];

export const LOADINGS: { slug: LoadingKind; name: string }[] = [
  { slug: "skeleton", name: "Skeleton" }, { slug: "spinner", name: "Spinner" }, { slug: "dots", name: "Dots" }, { slug: "progress", name: "Progress" },
];
export const SPLASHES: { slug: SplashKind; name: string }[] = [
  { slug: "draw", name: "Draw" }, { slug: "pop", name: "Pop" }, { slug: "fade", name: "Fade" }, { slug: "type", name: "Type" },
];
export const TRANSITIONS: { slug: TransitionKind; name: string }[] = [
  { slug: "rise", name: "Rise" }, { slug: "slide", name: "Slide" }, { slug: "scale", name: "Scale" }, { slug: "blur", name: "Blur" },
];

export interface StyleOverrides {
  palette?: string; // Palette slug
  type?: string; // Typeface slug
  motion?: string; // MotionChoice slug
  fx?: FxKind;
  accent?: string; // custom accent hex
  bgA?: string; // gradient fx color A
  bgB?: string; // gradient fx color B
  loading?: LoadingKind;
  splash?: SplashKind;
  transition?: TransitionKind;
  icon?: string; // IconStyle slug
}

/** Compose preset + facet overrides into one resolved DesignSystem (D-013). */
export function resolveStyle(base: DesignSystem, ov: StyleOverrides): DesignSystem {
  const hasOv = ov.palette || ov.type || ov.motion || ov.fx || ov.accent || ov.loading || ov.splash || ov.transition || ov.bgA || ov.bgB || ov.icon;
  if (!hasOv) return base;
  const pal = ov.palette ? PALETTES.find((p) => p.slug === ov.palette) : undefined;
  const tf = ov.type ? TYPEFACES.find((t) => t.slug === ov.type) : undefined;
  const mo = ov.motion ? MOTIONS.find((m) => m.slug === ov.motion) : undefined;
  return {
    ...base,
    name: `${base.name} · custom`,
    mode: pal?.mode ?? base.mode,
    type: (tf ? (tf.slug === "serif" || tf.slug === "editorial" ? "serif" : tf.slug === "mono" ? "mono" : "sans") : base.type),
    t: {
      ...base.t,
      ...(pal ? { bg: pal.bg, surface: pal.surface, text: pal.text, muted: pal.muted, accent: pal.accent, accentText: pal.accentText, border: pal.border } : {}),
      ...(tf ? { font: tf.stack, headWeight: tf.headWeight } : {}),
      ...(ov.accent ? { accent: ov.accent } : {}),
    },
    motion: mo?.tokens ?? dsMotion(base),
    fx: ov.fx ?? dsFx(base),
    fxColors: ov.bgA || ov.bgB ? [ov.bgA ?? base.t.accent, ov.bgB ?? (pal?.accent ?? base.t.accent)] : base.fxColors,
    loading: ov.loading ?? base.loading,
    splash: ov.splash ?? base.splash,
    transitionK: ov.transition ?? base.transitionK,
    iconSw: ov.icon ? ICON_STYLES.find((i) => i.slug === ov.icon)?.sw : base.iconSw,
  };
}

/* ================= Extended library (compact factory) =================
 * 84 more curated languages → ~100 total. Each entry is tokens-only data;
 * the engine renders all of them unchanged. Add a style = one S(...) line-group.
 */
const stack = (s: string) => TYPEFACES.find((t) => t.slug === s)!.stack;
function S(
  slug: string, name: string, mode: "light" | "dark", type: "sans" | "serif" | "mono", blurb: string,
  c: [string, string, string, string, string, string, string],
  r: string, ctl: string, shadow: string, f: string, hw: number, bw: string,
  dna: string[], avoid: string, upper = false,
): DesignSystem {
  return {
    slug, name, mode, type, blurb, dna, avoid,
    t: { bg: c[0], surface: c[1], text: c[2], muted: c[3], accent: c[4], accentText: c[5], border: c[6], radius: r, ctlRadius: ctl, shadow, font: stack(f), headWeight: hw, borderW: bw, upper },
  };
}
const soft = "0 12px 30px -12px rgba(0,0,0,0.18)";
const softD = "0 20px 50px -20px rgba(0,0,0,0.7)";

const EXTENDED: DesignSystem[] = [
  // ---- minimal & calm ----
  S("scandinavian", "Scandinavian", "light", "sans", "Pale wood, calm gray-blue, functional warmth.", ["#f7f6f3", "#ffffff", "#2c3338", "#8c959d", "#4a6fa5", "#ffffff", "#e6e3dc"], "12px", "10px", soft, "humanist", 600, "1px", ["pale warm neutrals", "functional, no ornament", "one muted blue accent"], "Loud color or heavy shadows."),
  S("japandi", "Japandi", "light", "serif", "Japanese minimalism meets Nordic warmth. Quiet, precise.", ["#f5f1ea", "#faf8f4", "#3a352f", "#9c948a", "#7d8471", "#ffffff", "#e3dcd1"], "6px", "6px", "none", "editorial", 600, "1px", ["paper + clay neutrals", "asymmetric quiet balance", "moss-green accent"], "Clutter — emptiness is the design."),
  S("wabi-sabi", "Wabi-Sabi", "light", "serif", "Imperfect, organic, earthen. Beauty in the unfinished.", ["#efe8dd", "#f6f1e8", "#443c33", "#a09383", "#b06d4c", "#f6f1e8", "#ddd2c2"], "2px", "2px", "none", "editorial", 500, "1px", ["earthen clay tones", "rough, honest texture", "hand-made irregularity"], "Machine-perfect symmetry."),
  S("gallery", "Gallery White", "light", "sans", "A white-cube gallery: art first, chrome invisible.", ["#ffffff", "#ffffff", "#111111", "#9b9b9b", "#111111", "#ffffff", "#ececec"], "0px", "0px", "none", "geometric", 500, "1px", ["pure white walls", "hairline separations", "content as the only color"], "Decorative UI competing with content."),
  S("architect", "Architect", "light", "sans", "Drafting-table precision: thin rules, measured spacing.", ["#fafafa", "#ffffff", "#1f2428", "#8a9299", "#c94f2e", "#ffffff", "#d9dde1"], "0px", "0px", "none", "geometric", 600, "1px", ["technical hairlines", "measured 8pt grid", "one drafting-red accent"], "Rounded softness — keep it drawn.", true),
  S("blueprint", "Blueprint", "dark", "mono", "White line-work on drafting blue. Plans, not pictures.", ["#0f2a4a", "#143456", "#e8f1fb", "#7e9cc0", "#ffffff", "#0f2a4a", "#2a5580"], "0px", "0px", "none", "mono", 600, "1px", ["blueprint blue ground", "white technical line-work", "mono annotations"], "Fills and photos — lines only."),
  S("zen-dark", "Zen Dark", "dark", "sans", "Near-black stillness with one warm ember.", ["#101012", "#17171a", "#e8e6e3", "#8f8d89", "#d97941", "#101012", "#26262a"], "10px", "10px", softD, "humanist", 500, "1px", ["charcoal stillness", "generous emptiness", "single ember accent"], "Anything urgent or loud."),
  S("eink", "E-Ink", "light", "serif", "Paper-device grayscale: crisp, restful, bookish.", ["#eceae5", "#f4f2ee", "#26241f", "#7d7a72", "#26241f", "#eceae5", "#cfccc4"], "3px", "3px", "none", "editorial", 600, "1px", ["true grayscale only", "book typography", "instant page-turn feel"], "Color of any kind."),
  // ---- dev & terminal culture ----
  S("nord", "Nord", "dark", "mono", "The polar dev palette: arctic blues on deep slate.", ["#2e3440", "#3b4252", "#eceff4", "#9099ab", "#88c0d0", "#2e3440", "#434c5e"], "8px", "6px", softD, "mono", 600, "1px", ["arctic blue-grays", "frost accents", "calm code aesthetics"], "Warm colors — stay polar."),
  S("dracula", "Dracula", "dark", "mono", "The cult editor theme: purple and pink on ink.", ["#282a36", "#313342", "#f8f8f2", "#8b8da0", "#bd93f9", "#282a36", "#44475a"], "8px", "6px", softD, "mono", 600, "1px", ["ink-purple ground", "candy syntax accents", "editor-native feel"], "Muted corporate blues."),
  S("solarized", "Solarized", "dark", "mono", "The scientifically-balanced classic, teal and amber.", ["#002b36", "#073642", "#cbd2d8", "#6f8a91", "#b58900", "#002b36", "#0e4a5a"], "6px", "4px", "none", "mono", 600, "1px", ["low-contrast science", "teal + amber balance", "easy on long sessions"], "Pure black or white."),
  S("gruvbox", "Gruvbox", "dark", "mono", "Retro groove: warm paper-bag browns and mustard.", ["#282828", "#32302f", "#ebdbb2", "#a89984", "#fabd2f", "#282828", "#504945"], "6px", "4px", "none", "mono", 700, "1px", ["warm retro browns", "mustard highlight", "CRT-era warmth"], "Cool sterile grays."),
  S("catppuccin", "Catppuccin", "dark", "mono", "Soothing pastel mocha for late-night code.", ["#1e1e2e", "#282838", "#cdd6f4", "#9aa1c0", "#cba6f7", "#1e1e2e", "#363a54"], "12px", "10px", softD, "mono", 600, "1px", ["mocha base, pastel accents", "soft rounded chrome", "cozy late-night feel"], "Harsh contrast or neon."),
  S("rose-pine", "Rosé Pine", "dark", "serif", "All natural pine, faux fur and a bit of soho vibes.", ["#191724", "#1f1d2e", "#e0def4", "#908caa", "#ebbcba", "#191724", "#2a273f"], "10px", "8px", softD, "editorial", 600, "1px", ["muted moody violet", "rose + pine accents", "soho-lounge softness"], "Bright saturated color."),
  S("tokyo-night", "Tokyo Night", "dark", "mono", "Neon-lit city blues for the night shift.", ["#1a1b26", "#20212e", "#a9b1d6", "#565f89", "#7aa2f7", "#1a1b26", "#2c2e40"], "8px", "6px", softD, "mono", 600, "1px", ["city-night blues", "electric blue accent", "quiet neon glow"], "Daylight warmth."),
  S("monokai", "Monokai", "dark", "mono", "The classic editor: charcoal with lime and magenta.", ["#272822", "#31322b", "#f8f8f2", "#90918b", "#a6e22e", "#272822", "#45463f"], "4px", "3px", "none", "mono", 700, "1px", ["charcoal editor ground", "lime/magenta syntax pops", "zero chrome"], "Soft pastels."),
  S("matrix", "Matrix", "dark", "mono", "Falling-code green on void black.", ["#020703", "#07120a", "#22ff77", "#12aa4c", "#22ff77", "#020703", "#0c3a1e"], "0px", "0px", "none", "mono", 700, "1px", ["void black + code green", "glow like phosphor", "rain-of-glyphs energy"], "Any second color.", true),
  S("bios", "BIOS", "dark", "mono", "Setup-utility blue: blocky, stark, 1998.", ["#0000a8", "#0000c4", "#ffffff", "#9a9aef", "#ffff55", "#0000a8", "#4747d1"], "0px", "0px", "none", "mono", 700, "2px", ["BIOS blue + yellow select", "block cursor everything", "no anti-aliasing spirit"], "Gradients or shadows.", true),
  S("teletext", "Teletext", "dark", "mono", "Broadcast-era blocks: primary colors on black.", ["#000000", "#111111", "#ffffff", "#8a8a8a", "#ffff00", "#000000", "#333333"], "0px", "0px", "none", "mono", 700, "2px", ["RGB block graphics", "chunky rows", "page-number nostalgia"], "Subtle anything.", true),
  S("hologram", "Hologram", "dark", "sans", "Iridescent cyan interface floating in space.", ["#020617", "#0b1229", "#d9f6ff", "#5e7ea6", "#38e8ff", "#021018", "#153055"], "14px", "10px", "0 0 30px rgba(56,232,255,0.25)", "geometric", 600, "1px", ["iridescent cyan glow", "floating translucent panels", "sci-fi HUD framing"], "Earth tones.", true),
  S("frutiger-aero", "Frutiger Aero", "light", "sans", "2007 optimism: glossy sky, water, and green fields.", ["#dff1fb", "#ffffff", "#0d3b56", "#5c8aa5", "#31b3e7", "#ffffff", "#bfe2f2"], "18px", "999px", "0 10px 24px -8px rgba(49,179,231,0.4), inset 0 2px 0 rgba(255,255,255,0.9)", "humanist", 700, "1px", ["glossy sky gradients", "bubbles + aqua glass", "eco-tech optimism"], "Flat matte minimalism."),
  S("aero-glass", "Aero Glass", "light", "sans", "Translucent window chrome, soft light, Vista dreams.", ["#e9f2f9", "#ffffff", "#1b3a52", "#6f8ba0", "#2f7fd4", "#ffffff", "#cfe0ee"], "10px", "8px", "0 8px 30px -10px rgba(47,127,212,0.35)", "sans", 600, "1px", ["frosted window chrome", "cool light-blue glass", "soft outer glow"], "Hard flat borders."),
  S("win95", "System 95", "light", "sans", "Beveled gray nostalgia. Every pixel earns its place.", ["#c0c0c0", "#d4d0c8", "#000000", "#5a5a5a", "#000080", "#ffffff", "#808080"], "0px", "0px", "inset -1px -1px 0 #808080, inset 1px 1px 0 #ffffff", "sans", 700, "2px", ["beveled gray widgets", "navy title accents", "pixel-perfect economy"], "Rounded corners or blur."),
  S("carbon", "Carbon", "dark", "sans", "Enterprise dark done right: IBM-grade rigor.", ["#161616", "#262626", "#f4f4f4", "#8d8d8d", "#0f62fe", "#ffffff", "#393939"], "0px", "0px", "none", "geometric", 600, "1px", ["sharp 90° corners", "productive blue accent", "grid rigor everywhere"], "Playful rounding."),
  // ---- retro & print ----
  S("art-deco", "Art Deco", "dark", "serif", "Gatsby geometry: gold fans on deep emerald-black.", ["#0d1512", "#14201b", "#efe6cf", "#9aa08c", "#d4af37", "#0d1512", "#2c3a32"], "2px", "2px", softD, "editorial", 700, "2px", ["gold geometric ornament", "deep emerald ground", "symmetry + fans"], "Casual asymmetry.", true),
  S("mid-century", "Mid-Century", "light", "sans", "1958 living room: mustard, teal, walnut, optimism.", ["#f6efe3", "#fdf8ee", "#31302b", "#8f8877", "#d98e32", "#31302b", "#e3d9c6"], "8px", "999px", soft, "geometric", 700, "1px", ["mustard + teal + walnut", "atomic-age shapes", "optimistic modernism"], "Digital-native gradients."),
  S("risograph", "Risograph", "light", "sans", "Two-ink print charm: fluorescent pink + blue, misregistered.", ["#f7f3ea", "#fdfaf3", "#2b2b33", "#8d8a94", "#ff4fa3", "#ffffff", "#e2dccd"], "4px", "4px", "4px 4px 0 rgba(45,80,255,0.35)", "geometric", 800, "2px", ["two-ink fluorescents", "misregistration charm", "zine print texture"], "Perfect gradients."),
  S("letterpress", "Letterpress", "light", "serif", "Deep-impression type on cotton paper.", ["#f3efe6", "#faf7f0", "#2f2a24", "#94897a", "#8a2e2e", "#f3efe6", "#ddd5c6"], "2px", "2px", "inset 0 1px 2px rgba(0,0,0,0.08)", "editorial", 700, "1px", ["debossed type feel", "cotton-paper warmth", "ink red accents"], "Glow or neon."),
  S("polaroid", "Polaroid", "light", "sans", "Instant-film white frames and faded summer color.", ["#f3f1ec", "#ffffff", "#3a3a3a", "#9a9a9a", "#e06a5a", "#ffffff", "#e7e4dc"], "4px", "6px", "0 8px 20px -8px rgba(0,0,0,0.25)", "humanist", 600, "1px", ["white film frames", "faded warm tones", "snapshot casualness"], "Digital sharpness."),
  S("seventies", "70s Funk", "light", "sans", "Burnt orange, avocado, brown — groovy arcs everywhere.", ["#f4e8d2", "#fbf3e2", "#3d2f1e", "#98805f", "#d2691e", "#fbf3e2", "#e5d4b5"], "999px", "999px", soft, "rounded", 800, "2px", ["burnt orange + avocado", "arcs and rainbows", "groovy rounded rhythm"], "Cool minimal grays."),
  S("pop-art", "Pop Art", "light", "sans", "Ben-Day dots, thick outlines, comic exclamation.", ["#fff8e7", "#ffffff", "#111111", "#666666", "#e3242b", "#ffffff", "#111111"], "6px", "6px", "6px 6px 0 #111111", "geometric", 900, "3px", ["ben-day dot fields", "thick comic outlines", "primary punch"], "Subtlety.", true),
  S("newsstand", "Newsstand", "light", "serif", "Tabloid energy: black masthead, red kickers.", ["#f6f4ee", "#fdfbf6", "#141311", "#77726a", "#c1121f", "#ffffff", "#141311"], "0px", "0px", "none", "editorial", 800, "2px", ["masthead hierarchy", "red kicker labels", "column discipline"], "App-like chrome.", true),
  S("manga", "Manga", "light", "sans", "Ink screentones, speed lines, high-drama black & white.", ["#ffffff", "#ffffff", "#0d0d0d", "#767676", "#0d0d0d", "#ffffff", "#0d0d0d"], "4px", "4px", "5px 5px 0 #0d0d0d", "geometric", 900, "2px", ["screentone grays", "speed-line energy", "panel borders"], "Color — ink only.", true),
  // ---- luxury & fashion ----
  S("champagne", "Champagne", "light", "serif", "Cream silk and brushed gold. Quietly expensive.", ["#f8f4ec", "#fdfaf4", "#3a332a", "#a3988a", "#b99054", "#ffffff", "#e8dfd0"], "6px", "6px", soft, "editorial", 600, "1px", ["cream silk neutrals", "brushed gold details", "wide letter-spaced caps"], "Bright playful color.", true),
  S("noir", "Noir Fashion", "dark", "serif", "Editorial black. White type. One red lipstick mark.", ["#0b0b0b", "#141414", "#f4f2ef", "#8e8c88", "#d1001f", "#ffffff", "#262626"], "0px", "0px", softD, "editorial", 700, "1px", ["fashion-spread black", "lipstick red accent", "oversized serif headlines"], "Friendly rounding.", true),
  S("velvet", "Royal Velvet", "dark", "serif", "Deep aubergine, antique gold, candlelight.", ["#1d1023", "#281731", "#efe3d3", "#9d8ba6", "#c8a24b", "#1d1023", "#3d2a49"], "8px", "8px", softD, "editorial", 600, "1px", ["aubergine depths", "antique gold trim", "candlelit warmth"], "Daylight brightness."),
  S("marble", "Marble", "light", "serif", "Veined stone, museum lighting, timeless weight.", ["#f4f3f0", "#fbfaf8", "#2b2b2a", "#98968f", "#3f5c50", "#ffffff", "#e2e0da"], "2px", "2px", soft, "editorial", 600, "1px", ["stone-white surfaces", "deep green-marble accent", "engraved caps details"], "Trendy effects.", true),
  S("boutique", "Boutique", "light", "sans", "Fashion e-comm: airy, cream, precise price tags.", ["#faf7f2", "#ffffff", "#26241f", "#a09a8e", "#26241f", "#faf7f2", "#eae4d9"], "0px", "0px", "none", "geometric", 500, "1px", ["airy cream lookbook", "underlined text buttons", "tag-like metadata"], "Busy promotional chrome.", true),
  // ---- playful ----
  S("kawaii", "Kawaii", "light", "sans", "Soft pink bubbles, rounded everything, tiny sparkles.", ["#fff0f6", "#ffffff", "#5c4450", "#c39aac", "#ff8fbf", "#ffffff", "#ffd9e8"], "24px", "999px", "0 10px 24px -10px rgba(255,143,191,0.45)", "rounded", 800, "2px", ["bubble pink pastels", "extra-round everything", "sparkle micro-details"], "Sharp corners or gray."),
  S("bubblegum", "Bubblegum", "light", "sans", "Pop-candy brights that snap and bounce.", ["#fef6ff", "#ffffff", "#3d2b46", "#a68cb3", "#c026d3", "#ffffff", "#f3d9fa"], "20px", "999px", "0 12px 26px -10px rgba(192,38,211,0.35)", "rounded", 800, "2px", ["candy magenta pop", "bouncy pill shapes", "sticker energy"], "Corporate restraint."),
  S("toybox", "Toybox", "light", "sans", "Primary-color blocks with chunky depth, like good toys.", ["#fdf6e9", "#ffffff", "#232946", "#8a8fa8", "#eebf2d", "#232946", "#232946"], "14px", "14px", "0 6px 0 #232946", "rounded", 900, "3px", ["chunky 3D block shadows", "primary toy palette", "grabbable controls"], "Elegant thin lines."),
  S("crayon", "Crayon", "light", "sans", "Hand-drawn warmth: wobbly lines, paper grain.", ["#fffdf5", "#ffffff", "#33302c", "#9b968c", "#e2574c", "#ffffff", "#33302c"], "10px", "10px", "3px 3px 0 rgba(51,48,44,0.9)", "humanist", 700, "2px", ["hand-drawn borders", "crayon primaries", "paper-craft warmth"], "Machine precision."),
  S("memphis-revival", "Memphis Revival", "light", "sans", "Squiggles, confetti and clashing pastels — 1985 says hi.", ["#fdf5ec", "#ffffff", "#232323", "#8f8f8f", "#ff5f8f", "#ffffff", "#232323"], "8px", "999px", "6px 6px 0 #2ec4b6", "geometric", 900, "3px", ["squiggle + confetti motifs", "clashing pastels", "postmodern chaos, managed"], "Harmony — clash on purpose.", true),
  S("duotone-pop", "Duotone Pop", "dark", "sans", "Exactly two colors, maximum attitude.", ["#12043a", "#1b0a4f", "#f4efff", "#9a8ccc", "#ffe600", "#12043a", "#31207a"], "10px", "10px", softD, "geometric", 800, "1px", ["strict two-color world", "poster-grade contrast", "big type attitude"], "A third color.", true),
  // ---- nature & organic ----
  S("botanical", "Botanical", "light", "serif", "Greenhouse editorial: deep greens on warm paper.", ["#f5f3ea", "#fbf9f1", "#2c352b", "#8b9484", "#3e6b48", "#ffffff", "#e0ddcb"], "10px", "8px", soft, "editorial", 600, "1px", ["leaf greens on paper", "botanical-plate details", "airy garden spacing"], "Tech-y neon."),
  S("terracotta", "Terracotta", "light", "sans", "Sun-baked clay, sand, and shade.", ["#f7ede2", "#fdf6ec", "#43342a", "#a68d78", "#c65f3d", "#ffffff", "#ead9c6"], "12px", "10px", soft, "humanist", 700, "1px", ["baked clay + sand", "sun-warmed neutrals", "soft adobe rounding"], "Cool blue light."),
  S("desert", "Desert", "light", "sans", "Dune gradients, dusty rose, wide horizons.", ["#f6ead8", "#fcf3e6", "#4a3b30", "#ab9784", "#c98a5e", "#ffffff", "#ecdcc4"], "10px", "10px", soft, "humanist", 600, "1px", ["dune-tone gradient", "wide horizontal calm", "dusty rose accents"], "Dense, busy layouts."),
  S("ocean", "Ocean", "light", "sans", "Sea-glass blues, foam white, tidal calm.", ["#eef6f6", "#ffffff", "#173a44", "#6f97a0", "#1487a0", "#ffffff", "#d6e8ea"], "14px", "12px", soft, "humanist", 600, "1px", ["sea-glass palette", "foam-soft surfaces", "tidal breathing motion"], "Hot warm tones."),
  S("forest-night", "Forest Night", "dark", "sans", "Moss and fern under a dark canopy.", ["#0f1512", "#161e19", "#dfe7e0", "#8b9a86", "#6fae7f", "#0f1512", "#263129"], "10px", "8px", softD, "humanist", 600, "1px", ["canopy-dark greens", "moss accent glow", "organic quiet"], "Synthetic neon."),
  S("cottagecore", "Cottagecore", "light", "serif", "Pressed flowers, linen, afternoon light.", ["#f9f4e8", "#fefaf0", "#4a4034", "#a4977f", "#a4643f", "#fefaf0", "#eadfc9"], "12px", "10px", soft, "editorial", 600, "1px", ["linen + pressed flowers", "storybook serif charm", "afternoon warmth"], "Urban hardness."),
  S("autumn", "Autumn", "light", "serif", "Maple, amber, and cinnamon — a warm season of UI.", ["#f8efe2", "#fdf6ea", "#41332a", "#a08b71", "#c2621a", "#ffffff", "#ecdcc4"], "10px", "8px", soft, "editorial", 700, "1px", ["maple + amber warmth", "cinnamon accents", "cozy density"], "Icy cool palettes."),
  // ---- moody aesthetics ----
  S("dark-academia", "Dark Academia", "dark", "serif", "Oxford library at midnight: oxblood, brass, old paper.", ["#191512", "#221d18", "#e8ddca", "#9d8f80", "#a44a3f", "#f2e8d5", "#3a322a"], "4px", "4px", softD, "editorial", 700, "1px", ["library-dark browns", "oxblood + brass", "scholarly serifs"], "Modern flat brightness."),
  S("light-academia", "Light Academia", "light", "serif", "Morning reading room: cream, sage, soft gold.", ["#f7f2e7", "#fcf8ef", "#4a423b", "#a5988a", "#8c7851", "#ffffff", "#e8dfc9"], "6px", "6px", soft, "editorial", 600, "1px", ["reading-room cream", "sage + soft gold", "annotated-margin charm"], "Neon or gradients."),
  S("gothic", "Gothic", "dark", "serif", "Cathedral black, silver tracery, blackletter mood.", ["#0a0a0c", "#131316", "#e6e4ea", "#7d7b86", "#8f9bb3", "#0a0a0c", "#26262c"], "0px", "0px", softD, "editorial", 700, "1px", ["cathedral blacks", "silver tracery lines", "vertical drama"], "Sunny warmth.", true),
  S("pastel-goth", "Pastel Goth", "dark", "sans", "Soft lilac and mint on charcoal — sweet and haunted.", ["#1a1722", "#241f2e", "#efe9f7", "#948aa8", "#c9a7ff", "#1a1722", "#3a3149"], "14px", "12px", softD, "rounded", 700, "1px", ["charcoal + candy pastels", "cute-meets-dark contrast", "soft glow edges"], "Corporate cleanliness."),
  S("dreamcore", "Dreamcore", "light", "sans", "Hazy liminal pastels that feel half-remembered.", ["#eef0fb", "#f8f8ff", "#4a4a66", "#9c9cc0", "#8f7bff", "#ffffff", "#dcdcf2"], "16px", "14px", "0 16px 40px -16px rgba(143,123,255,0.35)", "humanist", 600, "1px", ["liminal hazy pastels", "soft-focus surfaces", "floating dream drift"], "Sharp businesslike edges."),
  S("acid", "Acid Rave", "dark", "sans", "Warehouse flyer: toxic green, glitch energy.", ["#050505", "#101010", "#eaffea", "#7a8f7a", "#aaff00", "#050505", "#233023"], "0px", "0px", "0 0 24px rgba(170,255,0,0.3)", "geometric", 900, "2px", ["toxic green on black", "flyer-grade loudness", "glitch attitude"], "Politeness.", true),
  S("grunge", "Grunge", "dark", "sans", "Xeroxed poster: rough, torn, over-inked.", ["#151312", "#1e1b19", "#e4ded4", "#8e867a", "#c73e1d", "#f4ede1", "#3a352f"], "2px", "2px", "none", "sans", 800, "2px", ["xerox texture spirit", "torn-paper hierarchy", "over-inked type"], "Clean gradients.", true),
  S("y2k-cyber", "Y2K Cyber", "dark", "sans", "Millennium chrome: silver gradients, blue LEDs.", ["#0a0d14", "#131826", "#e8f0ff", "#7789a8", "#41d0ff", "#04121c", "#263550"], "16px", "999px", "0 0 26px rgba(65,208,255,0.3)", "geometric", 700, "1px", ["chrome + LED blue", "lens-flare futurism", "millennium optimism"], "Matte flatness.", true),
  S("vapor-pastel", "Vapor Pastel", "light", "sans", "Soft vaporwave: peach, lilac, seafoam sunset.", ["#fbeff2", "#ffffff", "#544860", "#ad9cbb", "#ff7eb6", "#ffffff", "#f2dbe4"], "16px", "14px", "0 14px 34px -14px rgba(255,126,182,0.4)", "geometric", 700, "1px", ["sunset pastel wash", "gentle retro grid nods", "dreamy softness"], "Hard contrast."),
  // ---- modern product ----
  S("canvas-paper", "Canvas Paper", "light", "sans", "Doc-first calm: warm white, quiet controls, content forward.", ["#ffffff", "#ffffff", "#37352f", "#9b9a97", "#2eaadc", "#ffffff", "#ededeb"], "4px", "4px", "none", "sans", 600, "1px", ["doc-white calm", "quiet gray chrome", "content-first hierarchy"], "Decorative surfaces."),
  S("command-dark", "Command Dark", "dark", "sans", "Launcher-grade dark: fast, focused, keyboard-first.", ["#0d0e11", "#16171c", "#f2f3f5", "#8a8f98", "#ff6363", "#0d0e11", "#24262d"], "10px", "8px", softD, "sans", 600, "1px", ["launcher dark speed", "keyboard-first affordances", "coral action accent"], "Slow decorative motion."),
  S("deploy-black", "Deploy Black", "dark", "sans", "Triangle-sharp monochrome: ship-it black and white.", ["#000000", "#0a0a0a", "#fafafa", "#888888", "#ffffff", "#000000", "#262626"], "8px", "6px", softD, "geometric", 700, "1px", ["pure black & white", "sharp geometric marks", "shipping-speed feel"], "Color — mono only."),
  S("blurple-chat", "Blurple Chat", "dark", "sans", "Community-native: blurple, rounded, always-on.", ["#1e1f22", "#2b2d31", "#f2f3f5", "#949ba4", "#5865f2", "#ffffff", "#3a3c42"], "12px", "10px", softD, "rounded", 700, "1px", ["blurple community energy", "rounded chat surfaces", "presence-dot liveliness"], "Corporate stiffness."),
  S("aubergine-suite", "Aubergine Suite", "light", "sans", "Workplace warmth: aubergine ribbon, tidy channels.", ["#f8f8f8", "#ffffff", "#1d1c1d", "#868386", "#611f69", "#ffffff", "#e8e8e8"], "8px", "6px", soft, "sans", 700, "1px", ["aubergine brand ribbon", "channel-list clarity", "workday friendliness"], "Dark hacker vibes."),
  S("playful-canvas", "Playful Canvas", "light", "sans", "Design-tool brights on neutral gray canvas.", ["#f5f5f5", "#ffffff", "#1e1e1e", "#8c8c8c", "#0d99ff", "#ffffff", "#e6e6e6"], "8px", "6px", soft, "sans", 600, "1px", ["tool-canvas gray", "multiplayer color pops", "precise 1px chrome"], "Ornament."),
  S("vibrant-browser", "Vibrant Browser", "light", "sans", "Playful gradients and spaces that feel personal.", ["#f9f5ff", "#ffffff", "#2b2440", "#9187ab", "#7b61ff", "#ffffff", "#e9e2f8"], "16px", "12px", "0 12px 30px -12px rgba(123,97,255,0.3)", "humanist", 700, "1px", ["personal pastel gradients", "friendly big radius", "space-per-mood theming"], "Gray uniformity."),
  S("finance-teal", "Finance Teal", "light", "sans", "Calm money: teal trust, tabular truth.", ["#f4faf9", "#ffffff", "#0d3331", "#5e8280", "#0f766e", "#ffffff", "#dcecea"], "10px", "8px", soft, "sans", 600, "1px", ["trust-teal restraint", "tabular numerals", "calm data density"], "Gamified dopamine."),
  S("health-coral", "Health Coral", "light", "sans", "Wellbeing warmth: coral energy, airy cards.", ["#fff7f4", "#ffffff", "#3d2c2a", "#a88f8a", "#ff6b57", "#ffffff", "#fbe3dc"], "18px", "999px", "0 14px 30px -14px rgba(255,107,87,0.35)", "rounded", 700, "1px", ["coral vitality", "breathing ring motifs", "soft encouraging tone"], "Clinical coldness."),
  S("edu-sunshine", "Edu Sunshine", "light", "sans", "Learning-app cheer: sunshine yellow, friendly wins.", ["#fffbeb", "#ffffff", "#3f3520", "#a89968", "#f59e0b", "#3f3520", "#f5e9c8"], "16px", "999px", "0 6px 0 rgba(63,53,32,0.15)", "rounded", 800, "2px", ["sunshine progress joy", "chunky friendly buttons", "streaks + confetti spirit"], "Somber tones."),
  // ---- experimental & bold ----
  S("neumorphism", "Neumorphism", "light", "sans", "Soft-extruded surfaces, light from above.", ["#e6eaf0", "#e6eaf0", "#3b4252", "#8a93a5", "#5871db", "#ffffff", "#d3d9e3"], "18px", "16px", "8px 8px 16px #c8cdd7, -8px -8px 16px #ffffff", "sans", 600, "0px", ["extruded soft surfaces", "dual-light shadows", "monochrome calm"], "Hard borders."),
  S("glass-dark", "Obsidian Glass", "dark", "sans", "Smoked glass layers over deep space.", ["#0a0f1c", "rgba(255,255,255,0.06)", "#eef3fb", "#93a3bd", "#66a3ff", "#081120", "rgba(255,255,255,0.14)"], "18px", "14px", "0 24px 60px -20px rgba(0,0,0,0.7)", "sans", 600, "1px", ["smoked glass panels", "depth via translucency", "cool blue light"], "Opaque flat cards."),
  S("gradient-mesh", "Gradient Mesh", "dark", "sans", "Living color fields behind minimal chrome.", ["#0c0a14", "#171224", "#f4f0ff", "#9a8fc0", "#a855f7", "#ffffff", "#2c2344"], "16px", "12px", softD, "geometric", 700, "1px", ["mesh color fields", "minimal chrome on top", "slow ambient drift"], "Static flat color."),
  S("wireframe", "Wireframe", "light", "mono", "Lo-fi boxes and placeholders — the idea, undecorated.", ["#fafafa", "#ffffff", "#333333", "#9e9e9e", "#333333", "#fafafa", "#bdbdbd"], "2px", "2px", "none", "mono", 600, "1px", ["placeholder honesty", "dashed-line spirit", "structure over style"], "Any polish."),
  S("high-contrast", "High Contrast", "dark", "sans", "AAA accessibility: yellow on black, unmissable.", ["#000000", "#0d0d0d", "#ffffff", "#c9c9c9", "#ffd500", "#000000", "#ffffff"], "6px", "6px", "none", "sans", 800, "2px", ["AAA contrast everywhere", "thick visible focus", "zero ambiguity"], "Subtle grays."),
  S("monoline", "Monoline", "light", "sans", "One line weight draws the whole interface.", ["#fcfcf9", "#ffffff", "#26251f", "#9a988c", "#26251f", "#fcfcf9", "#26251f"], "10px", "10px", "none", "geometric", 600, "2px", ["single stroke weight", "icon-like UI drawing", "ink on cream"], "Fills and shadows."),
  S("sketch", "Sketch", "light", "sans", "Pencil-thumbnail energy: rough, fast, alive.", ["#fdfcf7", "#ffffff", "#3a3833", "#a09d94", "#4361ee", "#ffffff", "#3a3833"], "8px", "8px", "2px 3px 0 rgba(58,56,51,0.7)", "humanist", 700, "2px", ["pencil-rough borders", "margin-note details", "fast ideation feel"], "Pixel perfection."),
  S("chrome-liquid", "Liquid Chrome", "dark", "sans", "Molten metal highlights on graphite.", ["#101114", "#191b20", "#f2f4f8", "#8b909c", "#c7d2e8", "#101114", "#2c2f38"], "20px", "999px", "0 20px 44px -18px rgba(160,180,220,0.35)", "geometric", 700, "1px", ["molten chrome sheen", "graphite depth", "reflective highlights"], "Warm paper tones.", true),
  S("brutal-concrete", "Brutal Concrete", "light", "sans", "Raw concrete slabs, exposed structure, no apology.", ["#d9d6d0", "#e6e3dd", "#1c1b19", "#6e6b64", "#1c1b19", "#e6e3dd", "#1c1b19"], "0px", "0px", "10px 10px 0 rgba(28,27,25,0.85)", "sans", 900, "3px", ["concrete slab blocks", "exposed grid structure", "monumental type"], "Decoration or warmth.", true),
  S("anti-design", "Anti-Design", "light", "sans", "Deliberately wrong: clashing, off-grid, unforgettable.", ["#f2ff00", "#ffffff", "#111111", "#6e6e2a", "#ff0000", "#ffffff", "#111111"], "0px", "0px", "8px 8px 0 #0000ff", "sans", 900, "3px", ["rule-breaking on purpose", "clashing primaries", "off-grid tension"], "Tasteful balance.", true),
  S("maximalist", "Maximalist", "dark", "serif", "More is more: layered pattern, jewel tones, drama.", ["#1c1024", "#2a1836", "#f6ecdc", "#b49ec5", "#e0a458", "#1c1024", "#4a2f5e"], "12px", "10px", softD, "editorial", 700, "1px", ["layered jewel tones", "pattern-on-pattern nerve", "operatic hierarchy"], "Whitespace worship."),
  S("solar-punk", "Solarpunk", "light", "sans", "Optimistic green tech: sunlight, leaves, brass.", ["#f3f7e9", "#fcfef5", "#2c3a26", "#8ba077", "#5c8a34", "#ffffff", "#dde8c9"], "14px", "12px", soft, "humanist", 600, "1px", ["sunlit greens + brass", "organic tech optimism", "garden-city curves"], "Dystopian gloom."),
  S("paper-cutout", "Paper Cutout", "light", "sans", "Layered construction paper with real drop shadows.", ["#fef3e2", "#ffffff", "#333333", "#999999", "#e76f51", "#ffffff", "#f0e0c8"], "14px", "12px", "0 6px 0 rgba(51,51,51,0.12), 0 12px 0 rgba(51,51,51,0.06)", "rounded", 800, "0px", ["stacked paper layers", "cutout shadow depth", "craft-table color"], "Flat single-layer look."),
  S("aurora-soft", "Aurora Soft", "dark", "sans", "Northern lights breathing behind quiet glass.", ["#0b1120", "#131b2e", "#e9effb", "#8b9ab8", "#7dd3fc", "#082032", "#243450"], "18px", "14px", softD, "humanist", 600, "1px", ["aurora color drift", "quiet glass panels", "night-sky calm"], "Hard bright light."),
];

/* ================= Trending set (2025–26 · Awwwards / Apple / X) =================
 * The languages people are actually shipping and sharing right now. Kept as its
 * own group so it's easy to keep current — prune and add as taste moves.
 */
const TRENDING: DesignSystem[] = [
  S("linear", "Linear", "dark", "sans", "The productivity-app benchmark: near-black with an indigo soul.", ["#08090a", "#101113", "#f7f8f8", "#8a8f98", "#5e6ad2", "#ffffff", "#23252a"], "8px", "6px", softD, "sans", 600, "1px", ["indigo-cast near-black", "surgical micro-contrast", "#5e6ad2 signature purple", "tight, fast, weightless"], "Heavy shadows or loud color."),
  S("kraft", "Kraft", "light", "sans", "Warm cream paper and clay coral — the calm, human AI look.", ["#f0eee6", "#faf9f5", "#1a1a18", "#87847a", "#cc785c", "#ffffff", "#e4e1d7"], "8px", "8px", "0 8px 24px -12px rgba(80,60,40,0.16)", "humanist", 500, "1px", ["kraft-paper cream ground", "clay-coral warmth", "unhurried human voice", "soft utilitarian chrome"], "Cold tech blues or neon."),
  S("spatial", "Spatial", "dark", "sans", "visionOS depth: frosted glass floating in soft light.", ["#0a0a0f", "rgba(255,255,255,0.1)", "#f5f6fa", "#a0a4b0", "#8ab4ff", "#0a0a0f", "rgba(255,255,255,0.18)"], "24px", "999px", "0 30px 80px -24px rgba(0,0,0,0.8)", "sans", 500, "1px", ["floating frosted glass", "depth via translucency + blur", "soft ambient light", "fully rounded pills"], "Flat opaque cards."),
  S("emerald-dev", "Emerald Dev", "dark", "mono", "Ink-black console lit by one emerald signal.", ["#171717", "#1e1e1e", "#ededed", "#8f8f8f", "#3ecf8e", "#052014", "#2e2e2e"], "6px", "6px", softD, "mono", 600, "1px", ["ink black + emerald signal", "developer-grade precision", "mono numerics", "success-green energy"], "Pastel softness."),
  S("answer-teal", "Answer Teal", "light", "serif", "Answer-engine calm: editorial off-white and teal trust.", ["#fcfcfa", "#ffffff", "#1a1a1a", "#6b7280", "#20808d", "#ffffff", "#e8e8e4"], "8px", "8px", soft, "editorial", 600, "1px", ["reading-room off-white", "teal trust accent", "editorial serif headings", "generous measure"], "Gamified dopamine color."),
  S("industrial", "Industrial", "light", "mono", "Teenage-Engineering functionalism: gray panels, safety orange.", ["#e6e6e3", "#f2f2ef", "#1a1a1a", "#7a7a76", "#ff5c00", "#ffffff", "#c6c6c2"], "2px", "2px", "none", "mono", 700, "1px", ["industrial gray panels", "safety-orange accents", "labeled + functional", "mono legends"], "Decorative softness.", true),
  S("mocha-mousse", "Mocha Mousse", "light", "sans", "Pantone's 2025 warmth: cocoa, oat, and quiet luxury.", ["#efe7dd", "#faf5ee", "#3a2f28", "#9c8b7d", "#a47864", "#ffffff", "#ded2c4"], "12px", "10px", soft, "humanist", 600, "1px", ["mocha-mousse warmth", "cocoa + oat neutrals", "cozy premium calm", "soft rounding"], "Cold or neon color."),
  S("brat", "Brat", "dark", "sans", "Deadpan lime on black, lowercase, deliberately blurred.", ["#000000", "#0a0a0a", "#8ace00", "#5f7a1e", "#8ace00", "#000000", "#1e2e00"], "0px", "0px", "none", "sans", 500, "1px", ["brat lime on black", "lowercase deadpan", "arial-blur attitude", "one toxic green"], "Polish or gradients."),
  S("award-noir", "Award Noir", "dark", "sans", "Site-of-the-day drama: gallery black, oversized type, electric lime.", ["#0c0c0c", "#141414", "#f5f5f0", "#7c7c78", "#ccff00", "#0c0c0c", "#262624"], "4px", "999px", "none", "geometric", 800, "1px", ["gallery-black canvas", "oversized display type", "electric-lime single accent", "award-show confidence"], "Timid sizing.", true),
  S("amber-crt", "Amber CRT", "dark", "mono", "Warm phosphor terminal — the amber cousin of green.", ["#1a1206", "#241a0c", "#ffb000", "#b3841f", "#ffb000", "#1a1206", "#3d2e12"], "2px", "2px", "0 0 20px rgba(255,176,0,0.2)", "mono", 600, "1px", ["amber phosphor glow", "monospace grid", "warm CRT nostalgia", "scanline soul"], "Any second color."),
  S("cobalt", "Cobalt", "light", "sans", "Clean modern SaaS: cool white, cobalt blue, tidy cards.", ["#f6f8fc", "#ffffff", "#0f172a", "#64748b", "#2563eb", "#ffffff", "#e2e8f0"], "10px", "8px", soft, "sans", 700, "1px", ["cool-white product calm", "confident cobalt accent", "tidy 8px rhythm", "legible density"], "Grungy texture."),
  S("soft-serif", "Soft Serif", "light", "serif", "The 2025 warm-editorial look: big soft serif, terracotta ink.", ["#f5f1ea", "#fdfbf6", "#211d18", "#8b8175", "#b0522f", "#ffffff", "#e6dfd1"], "10px", "10px", soft, "editorial", 600, "1px", ["oversized soft serif display", "warm paper neutrals", "terracotta ink accent", "editorial breathing room"], "Cold geometric sans."),
];

DESIGN_SYSTEMS.push(...EXTENDED, ...TRENDING);
