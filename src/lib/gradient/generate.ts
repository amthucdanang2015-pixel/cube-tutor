import type { Design, Layer, Palette, Shape, Layout, Blend } from "./types";

/* ---------- seeded RNG (mulberry32) ---------- */
function hash(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function randomSeed(): string {
  return "#" + Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0");
}

type RNG = () => number;
const pick = <T,>(r: RNG, arr: T[]): T => arr[Math.floor(r() * arr.length)];
const range = (r: RNG, a: number, b: number) => a + r() * (b - a);
const irange = (r: RNG, a: number, b: number) => Math.floor(range(r, a, b + 1));

/* ---------- colour ---------- */
function hsl(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const c = l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** Harmonic palette schemes — biased toward vivid, gradient-friendly results. */
function generatePalette(r: RNG): Palette {
  const base = r() * 360;
  const scheme = pick(r, ["analogous", "analogous", "complement", "triad", "duo", "mono-pop"] as const);
  const sat = range(r, 70, 100);
  let hues: number[];
  switch (scheme) {
    case "complement": hues = [base, base + range(r, 20, 50), base + 180]; break;
    case "triad": hues = [base, base + 120, base + 240]; break;
    case "duo": hues = [base, base + range(r, 150, 210)]; break;
    case "mono-pop": hues = [base, base + range(r, 8, 22), base + range(r, 30, 50)]; break;
    default: hues = [base, base + range(r, 25, 45), base + range(r, 55, 90)]; // analogous
  }
  const n = Math.min(hues.length, irange(r, 2, 4));
  const mood = r();
  const colors = hues.slice(0, n).map((h, i) => {
    const t = n > 1 ? i / (n - 1) : 0;
    // luminance ramp — biased bright/vivid (neon), with darker dramatic sets ~30% of the time
    const l = mood < 0.3 ? range(r, 36, 66) - t * 5 : range(r, 52, 86) - t * 5;
    return hsl(h, Math.min(100, sat + 4) - t * 6, l);
  });
  return { colors, angle: irange(r, 0, 11) * 30 };
}

/* ---------- shape ---------- */
function generateShape(r: RNG, layout: Layout): Shape {
  return {
    count: layout === "linear" ? irange(r, 6, 16) : irange(r, 3, 9),
    inner: layout === "orbit" ? range(r, 0.12, 0.4) : range(r, 0, 0.35),
    margin: range(r, 0.02, 0.22),
    spread: range(r, 0.45, 1),
    rotation: r() * 360,
    jitter: range(r, 0, 0.7),
    segments: irange(r, 1, layout === "linear" ? 1 : 7),
  };
}

function generateLayer(r: RNG, opts?: { layout?: Layout; palette?: Palette; shape?: Shape }): Layer {
  const layout = opts?.layout ?? pick(r, ["linear", "radial", "orbit", "orbit"] as Layout[]);
  return {
    layout,
    palette: opts?.palette ?? generatePalette(r),
    shape: opts?.shape ?? generateShape(r, layout),
    blend: "normal",
    opacity: 1,
    visible: true,
  };
}

/* ---------- design ---------- */
export function defaultDesign(): Design {
  return generateDesign(randomSeed());
}

export function generateDesign(seed: string): Design {
  const r = mulberry32(hash(seed));
  const twoLayers = r() < 0.35;
  const layers: Layer[] = [generateLayer(r)];
  if (twoLayers) {
    const l2 = generateLayer(r);
    l2.blend = pick(r, ["multiply", "screen", "overlay", "lighten", "soft-light"] as Blend[]);
    l2.opacity = range(r, 0.5, 0.95);
    layers.push(l2);
  }
  const dark = r() < 0.7;
  const bgHue = r() * 360;
  return {
    seed,
    aspect: "1:1",
    background: dark ? "#000000" : hsl(bgHue, 14, 7),
    bgGradient: r() < 0.3,
    background2: hsl(bgHue + range(r, -40, 40), 18, dark ? 4 : 12),
    layers,
    relief: {
      topShadow: range(r, 0.2, 0.7),
      depth: range(r, 0.1, 0.5),
      seam: range(r, 0, 0.09),
      grain: range(r, 0.05, 0.4),
    },
    transform: { rotate: 0, scale: 1, x: 0, y: 0, hue: 0 },
    glow: r() < 0.5 ? range(r, 0.15, 0.55) : 0,
    vignette: range(r, 0.1, 0.5),
    treatment: { effect: "none", intensity: 0.4, scale: 4 },
  };
}

/**
 * Reroll with locks. Keeps the parts the user wants stable.
 * - lockColours: keep palettes + background, regenerate structure.
 * - lockStructure: keep layouts + shapes, regenerate palettes + background.
 */
export function reroll(prev: Design, opts: { lockColours?: boolean; lockStructure?: boolean }): Design {
  const seed = randomSeed();
  const fresh = generateDesign(seed);
  if (!opts.lockColours && !opts.lockStructure) return { ...fresh, aspect: prev.aspect, treatment: prev.treatment, transform: prev.transform };

  const layers = prev.layers.map((layer, i) => {
    const freshLayer = fresh.layers[i] ?? generateLayer(mulberry32(hash(seed + i)));
    return {
      ...layer,
      layout: opts.lockStructure ? layer.layout : freshLayer.layout,
      shape: opts.lockStructure ? layer.shape : generateShape(mulberry32(hash(seed + "s" + i)), opts.lockStructure ? layer.layout : freshLayer.layout),
      palette: opts.lockColours ? layer.palette : freshLayer.palette,
    };
  });
  return {
    ...prev,
    seed,
    background: opts.lockColours ? prev.background : fresh.background,
    background2: opts.lockColours ? prev.background2 : fresh.background2,
    relief: opts.lockStructure ? prev.relief : fresh.relief,
    glow: opts.lockStructure ? prev.glow : fresh.glow,
    vignette: opts.lockStructure ? prev.vignette : fresh.vignette,
    layers,
  };
}
