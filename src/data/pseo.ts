/**
 * Programmatic SEO engine: one landing page per (style × tool) combination.
 * Targets long-tail queries like "best neo-brutalism prompt for v0".
 *
 * To grow the engine, just add a Style or a Tool below — pages generate
 * automatically via generateStaticParams in app/prompts/[slug]/page.tsx.
 */

export interface Style {
  slug: string;
  name: string;
  blurb: string; // one-line description of the aesthetic
  dna: string[]; // the design traits the prompt encodes
  signature: string; // the one move that defines the style
}

export interface Tool {
  slug: string;
  name: string;
  note: string; // how to use the prompt in this tool
}

export const STYLES: Style[] = [
  { slug: "neo-brutalism", name: "Neo-Brutalism", signature: "hard offset shadows that collapse on click", blurb: "Loud borders, clashing color, and chunky hover states that thunk into place.", dna: ["thick black borders", "hard offset box-shadows", "raw grotesk type", "primary/clashing colors", "snap-on-hover interactions"] },
  { slug: "glassmorphism", name: "Glassmorphism", signature: "frosted panels with a specular highlight that sweeps on hover", blurb: "Frosted-glass panels layered with depth, blur, and light refraction.", dna: ["backdrop-blur layers", "subtle inner highlight", "soft animated gradient behind glass", "depth-based parallax", "specular sweep on hover"] },
  { slug: "swiss-minimalist", name: "Swiss Minimalist", signature: "a strict grid with one oversized typographic anchor", blurb: "Ruthless grid, huge type, generous whitespace, near-zero ornament.", dna: ["12-column grid", "oversized helvetica-grade type", "mono-accent color", "generous whitespace", "precise baseline rhythm"] },
  { slug: "vaporwave", name: "Vaporwave", signature: "a sunset gradient grid horizon with chrome type", blurb: "80s sunset gradients, chrome type, retro grid horizons, VHS grain.", dna: ["magenta/cyan sunset gradient", "perspective grid horizon", "chrome/3D wordmark", "VHS scanline grain", "glow and bloom"] },
  { slug: "claymorphism", name: "Claymorphism", signature: "puffy 3D shapes with soft inner and outer shadows", blurb: "Soft, puffy 3D shapes with pastel color and squishy hover physics.", dna: ["double soft shadows (inner+outer)", "rounded puffy shapes", "pastel palette", "squishy spring on press", "playful depth"] },
  { slug: "terminal", name: "Terminal / CRT", signature: "a phosphor-glow console that types itself out", blurb: "Monospace console aesthetic with CRT scanlines and a typewriter reveal.", dna: ["monospace type", "phosphor green/amber glow", "CRT scanlines + flicker", "typewriter reveal with caret", "fake $ commands"] },
  { slug: "bauhaus", name: "Bauhaus", signature: "primary geometric shapes composed on a strict grid", blurb: "Primary colors, geometric shapes, and rigorous compositional balance.", dna: ["red/yellow/blue + black", "circles, triangles, squares", "asymmetric balance", "bold geometric sans", "constructivist layout"] },
  { slug: "editorial", name: "Editorial / Magazine", signature: "a serif drop-cap headline with text that reveals on scroll", blurb: "Magazine layout: big serif headlines, columns, pull quotes, scroll reveals.", dna: ["large serif display type", "multi-column body", "pull quotes", "drop caps", "word-by-word scroll reveal"] },
  { slug: "dark-luxury", name: "Dark Luxury", signature: "a cursor spotlight that reveals gradient type on near-black", blurb: "Near-black canvas, restrained gold/violet accents, cinematic spotlighting.", dna: ["#0a0a0a base", "single jewel-tone accent", "cursor-follow spotlight", "fine hairline rules", "slow, weighty motion"] },
  { slug: "y2k", name: "Y2K / Frutiger Aero", signature: "glossy aqua bubbles with lens-flare gloss", blurb: "Glossy aqua, lens flares, bubble buttons, optimistic early-2000s tech.", dna: ["aqua/sky gradient", "glossy bubble buttons", "lens-flare highlights", "skeuomorphic gloss", "rounded translucent panels"] },
  { slug: "kinetic-type", name: "Kinetic Typography", signature: "a single word that swaps with a 3D flip on a loop", blurb: "Type as the entire interface — words scale, rotate, and swap hypnotically.", dna: ["oversized variable font", "3D flip word swaps", "mask-reveal underlines", "character-level jitter", "loop-driven rhythm"] },
  { slug: "memphis", name: "Memphis / Postmodern", signature: "scattered squiggles and confetti shapes with playful tilt", blurb: "Squiggles, confetti shapes, clashing pastels, playful 80s postmodern chaos.", dna: ["squiggle + dot + zigzag motifs", "clashing pastel + black", "tilted scattered shapes", "playful rounded sans", "confetti parallax"] },
  { slug: "cyberpunk", name: "Cyberpunk / Neon", signature: "neon glow type over a dark grid with glitch on hover", blurb: "Dark city palette, neon glow, glitch transitions, HUD-style overlays.", dna: ["dark base + neon magenta/cyan", "glow text shadows", "glitch/RGB-split hover", "HUD frame overlays", "scan grid background"] },
  { slug: "skeuomorphic", name: "Neo-Skeuomorphism", signature: "tactile materials with realistic light and depth", blurb: "Realistic materials, soft real-world shadows, tactile depth done tastefully.", dna: ["realistic soft shadows", "subtle material textures", "depth via layered light", "tactile pressed states", "warm neutral palette"] },
  { slug: "organic-3d", name: "Organic 3D", signature: "a morphing gradient blob that bulges toward the cursor", blurb: "Soft 3D blobs, morphing gradients, liquid shapes that react to the cursor.", dna: ["morphing SVG/3D blob", "animated gradient fill", "cursor-reactive bulge", "floating parallax shapes", "mix-blend type"] },
  { slug: "monospace-tech", name: "Monospace Tech", signature: "a developer-doc grid with hairline borders and code chips", blurb: "Dev-tool aesthetic: monospace accents, hairline grids, code-chip details.", dna: ["mono accent type", "hairline 1px borders", "code/keyboard chips", "muted slate palette", "command-palette motif"] },
];

export const TOOLS: Tool[] = [
  { slug: "v0", name: "v0", note: "Paste into v0's prompt box; iterate with follow-ups like \"make the motion smoother\" or \"tighten the spacing\"." },
  { slug: "cursor", name: "Cursor", note: "Paste into Cursor's chat (Composer/Agent) with your project open so it edits real files; specify your framework if it isn't Next.js." },
  { slug: "lovable", name: "Lovable", note: "Paste into Lovable's chat; it scaffolds the full app — then refine with \"keep the layout, upgrade the motion\"." },
  { slug: "bolt", name: "Bolt", note: "Paste into Bolt.new; it spins up a live sandbox — tweak with targeted follow-ups rather than re-prompting from scratch." },
  { slug: "figma-make", name: "Figma Make", note: "Paste into Figma Make to generate an interactive prototype you can hand straight to engineering." },
  { slug: "claude", name: "Claude", note: "Paste into Claude (or Claude Code) and ask it to output a single self-contained component you can drop into your app." },
];

export function buildPrompt(style: Style, tool: Tool): string {
  return [
    `Target tool: ${tool.name}.`,
    `Build a landing-page hero in Next.js (App Router) + Tailwind, with Motion (motion.dev) for animation, in a ${style.name} style.`,
    ``,
    `Design DNA — make all of these unmistakable:`,
    ...style.dna.map((d) => `- ${d}`),
    ``,
    `Signature move: ${style.signature}.`,
    ``,
    `Content: an oversized headline, a one-line subhead, and two buttons (one primary). Add one secondary section below the fold that reuses the same visual language.`,
    ``,
    `Motion: elements fade + rise in sequence on load; the primary button has a magnetic hover; respect prefers-reduced-motion. Target a buttery 60fps and use GPU-accelerated transforms only.`,
    ``,
    `Output a single, self-contained, responsive component with no placeholder TODOs. Make it look like a $100k site, not a default template.`,
  ].join("\n");
}

export interface Combo {
  slug: string;
  style: Style;
  tool: Tool;
}

export function allCombos(): Combo[] {
  const out: Combo[] = [];
  for (const style of STYLES) for (const tool of TOOLS) out.push({ slug: `${style.slug}-for-${tool.slug}`, style, tool });
  return out;
}

export function getCombo(slug: string): Combo | undefined {
  return allCombos().find((c) => c.slug === slug);
}
