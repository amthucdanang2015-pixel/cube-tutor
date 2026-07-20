import { generateDesign } from "./generate";
import type { Anim, Design } from "./types";

/**
 * Curated presets — one-tap starting points that always look great (D-004).
 * A preset = a seeded design + hand-tuned patches + a living animation.
 * Adding a preset = one object here; the dock renders + thumbnails automatically.
 */

export interface Preset {
  slug: string;
  name: string;
  build: () => Design;
  anim: Anim;
}

function patch(seed: string, fn: (d: Design) => void): Design {
  const d = generateDesign(seed);
  fn(d);
  return d;
}

const fps = 30, size = 1080;
const t = (id: string, param: Anim["tracks"][number]["param"], from: number, to: number, easing: Anim["tracks"][number]["easing"], loops = 1, offset = 0): Anim["tracks"][number] =>
  ({ id, param, from, to, easing, loops, offset, enabled: true });

export const PRESETS: Preset[] = [
  {
    slug: "aurora", name: "Aurora",
    build: () => patch("#a0e0b7c1", (d) => {
      d.layers[0].layout = "linear";
      d.layers[0].palette.colors = ["#22d3ee", "#7c5cff", "#10b981"];
      d.background = "#03060a"; d.bgGradient = false;
      d.glow = 0.55; d.vignette = 0.35; d.relief.grain = 0.22; d.relief.seam = 0;
      d.layers[0].shape.count = 9; d.layers[0].shape.margin = 0.04; d.layers[0].shape.jitter = 0.55;
    }),
    anim: { duration: 10, fps, size, tracks: [t("p1", "hue", 0, 360, "linear"), t("p2", "offsetY", -0.04, 0.04, "sine"), t("p3", "glow", 0.4, 0.65, "sine", 1, 0.3)] },
  },
  {
    slug: "ember", name: "Ember",
    build: () => patch("#f0e82434", (d) => {
      d.layers[0].layout = "linear";
      d.layers[0].palette.colors = ["#fbbf24", "#f97316", "#dc2626"];
      d.background = "#0a0402"; d.glow = 0.4; d.vignette = 0.5; d.relief.grain = 0.45; d.relief.depth = 0.35;
      d.layers[0].shape.count = 12; d.layers[0].shape.jitter = 0.8;
    }),
    anim: { duration: 8, fps, size, tracks: [t("p1", "scale", 0.98, 1.08, "sine"), t("p2", "grain", 0.3, 0.55, "sine", 2), t("p3", "hue", -12, 12, "sine", 1, 0.5)] },
  },
  {
    slug: "orbitals", name: "Orbitals",
    build: () => patch("#b9de8ea2", (d) => {
      d.layers[0].layout = "orbit";
      d.layers[0].palette.colors = ["#84cc16", "#22d3ee", "#f59e0b"];
      d.background = "#000000"; d.layers[0].shape.inner = 0.26; d.layers[0].shape.margin = 0.12;
      d.layers[0].shape.segments = 5; d.relief.topShadow = 0.6; d.relief.depth = 0.35; d.glow = 0.3;
    }),
    anim: { duration: 12, fps, size, tracks: [t("p1", "shapeRotation", 0, 360, "linear"), t("p2", "inner", 0.2, 0.34, "sine")] },
  },
  {
    slug: "deep-sea", name: "Deep Sea",
    build: () => patch("#0c4a6e77", (d) => {
      d.layers[0].layout = "radial";
      d.layers[0].palette.colors = ["#0ea5e9", "#1d4ed8", "#0f172a"];
      d.background = "#020617"; d.glow = 0.45; d.vignette = 0.55; d.relief.grain = 0.18;
      d.layers[0].shape.count = 6; d.layers[0].shape.segments = 1; d.layers[0].shape.margin = 0.08;
    }),
    anim: { duration: 14, fps, size, tracks: [t("p1", "scale", 0.94, 1.1, "sine"), t("p2", "hue", -20, 20, "sine", 1, 0.25), t("p3", "vignette", 0.45, 0.65, "sine", 2)] },
  },
  {
    slug: "acid", name: "Acid",
    build: () => patch("#39ff1477", (d) => {
      d.layers[0].layout = "orbit";
      d.layers[0].palette.colors = ["#a3e635", "#22d3ee", "#e879f9"];
      d.background = "#050505"; d.treatment = { effect: "dither", intensity: 0.5, scale: 3 };
      d.glow = 0.5; d.relief.grain = 0.1; d.layers[0].shape.inner = 0.12; d.layers[0].shape.segments = 8; d.layers[0].shape.jitter = 0.7;
    }),
    anim: { duration: 6, fps, size, tracks: [t("p1", "shapeRotation", 0, 360, "linear", 1), t("p2", "effectIntensity", 0.35, 0.6, "sine", 2)] },
  },
  {
    slug: "mono", name: "Mono",
    build: () => patch("#e5e5e577", (d) => {
      d.layers[0].layout = "linear";
      d.layers[0].palette.colors = ["#fafafa", "#a3a3a3", "#525252"];
      d.background = "#0a0a0a"; d.glow = 0; d.vignette = 0.4; d.relief.grain = 0.5; d.relief.seam = 0.02;
      d.layers[0].shape.count = 14; d.layers[0].shape.margin = 0.14; d.layers[0].shape.jitter = 0.6;
      d.layers.splice(1); // single layer
    }),
    anim: { duration: 10, fps, size, tracks: [t("p1", "offsetX", -0.05, 0.05, "sine"), t("p2", "grain", 0.4, 0.6, "sine", 3)] },
  },
  {
    slug: "vhs-sunset", name: "VHS Sunset",
    build: () => patch("#ff5c3377", (d) => {
      d.layers[0].layout = "radial";
      d.layers[0].palette.colors = ["#fb7185", "#f59e0b", "#7c3aed"];
      d.background = "#120612"; d.treatment = { effect: "scanlines", intensity: 0.45, scale: 4 };
      d.glow = 0.5; d.vignette = 0.45; d.layers[0].shape.count = 8; d.layers[0].shape.margin = 0.05;
    }),
    anim: { duration: 9, fps, size, tracks: [t("p1", "hue", 0, 360, "linear"), t("p2", "scale", 1, 1.08, "sine", 1, 0.4)] },
  },
  {
    slug: "slow-breath", name: "Slow Breath",
    build: () => patch("#8b5cf677", (d) => {
      d.layers[0].layout = "radial";
      d.layers[0].palette.colors = ["#a78bfa", "#f0abfc", "#38bdf8"];
      d.background = "#0b0714"; d.bgGradient = true; d.background2 = "#160b22";
      d.glow = 0.6; d.vignette = 0.3; d.relief.grain = 0.15; d.relief.seam = 0;
      d.layers[0].shape.count = 4; d.layers[0].shape.margin = 0.02; d.layers[0].shape.inner = 0.05;
    }),
    anim: { duration: 12, fps, size, tracks: [t("p1", "scale", 0.96, 1.06, "sine"), t("p2", "glow", 0.45, 0.7, "sine", 1, 0.5), t("p3", "hue", -15, 15, "sine", 1, 0.25)] },
  },
  {
    slug: "silk-mesh", name: "Silk Mesh",
    build: () => patch("#7c5cff11", (d) => {
      d.layers[0].layout = "linear";
      d.layers[0].palette.colors = ["#7c5cff", "#22d3ee", "#f472b6"];
      d.background = "#07060d"; d.bgGradient = true; d.background2 = "#0d0a18";
      d.glow = 0.5; d.vignette = 0.25; d.relief.grain = 0.12; d.relief.seam = 0;
      d.layers[0].shape.count = 5; d.layers[0].shape.margin = 0.02; d.layers[0].shape.jitter = 0.35;
    }),
    anim: { duration: 12, fps, size, tracks: [t("p1", "offsetX", -0.05, 0.05, "sine"), t("p2", "hue", -18, 18, "sine", 1, 0.35), t("p3", "glow", 0.4, 0.6, "sine", 2)] },
  },
  {
    slug: "signal-red", name: "Signal Red",
    build: () => patch("#ff636322", (d) => {
      d.layers[0].layout = "radial";
      d.layers[0].palette.colors = ["#ff6363", "#b91c1c", "#3b0764"];
      d.background = "#070308"; d.glow = 0.55; d.vignette = 0.5; d.relief.grain = 0.2;
      d.layers[0].shape.count = 5; d.layers[0].shape.margin = 0.04; d.layers[0].shape.inner = 0.08;
    }),
    anim: { duration: 10, fps, size, tracks: [t("p1", "scale", 0.97, 1.07, "sine"), t("p2", "glow", 0.45, 0.68, "sine", 1, 0.5)] },
  },
  {
    slug: "polar", name: "Polar",
    build: () => patch("#7dd3fc33", (d) => {
      d.layers[0].layout = "linear";
      d.layers[0].palette.colors = ["#e0f2fe", "#7dd3fc", "#1e3a8a"];
      d.background = "#020617"; d.glow = 0.35; d.vignette = 0.4; d.relief.grain = 0.25;
      d.layers[0].shape.count = 10; d.layers[0].shape.margin = 0.06; d.layers[0].shape.jitter = 0.5;
    }),
    anim: { duration: 14, fps, size, tracks: [t("p1", "offsetY", -0.04, 0.04, "sine"), t("p2", "hue", -10, 10, "sine", 1, 0.25), t("p3", "grain", 0.18, 0.32, "sine", 2)] },
  },
  {
    slug: "film-noir", name: "Film Noir",
    build: () => patch("#78716c44", (d) => {
      d.layers[0].layout = "radial";
      d.layers[0].palette.colors = ["#f5f5f4", "#78716c", "#1c1917"];
      d.background = "#0a0908"; d.treatment = { effect: "chromatic", intensity: 0.35, scale: 2 };
      d.glow = 0.15; d.vignette = 0.65; d.relief.grain = 0.55; d.relief.seam = 0;
      d.layers[0].shape.count = 7; d.layers[0].shape.margin = 0.08;
    }),
    anim: { duration: 11, fps, size, tracks: [t("p1", "grain", 0.45, 0.65, "sine", 3), t("p2", "scale", 0.98, 1.05, "sine"), t("p3", "effectIntensity", 0.25, 0.45, "sine", 2, 0.5)] },
  },
  {
    slug: "candy-pop", name: "Candy Pop",
    build: () => patch("#f472b655", (d) => {
      d.layers[0].layout = "orbit";
      d.layers[0].palette.colors = ["#f472b6", "#c084fc", "#38bdf8"];
      d.background = "#0d0512"; d.treatment = { effect: "halftone", intensity: 0.4, scale: 5 };
      d.glow = 0.45; d.vignette = 0.3; d.layers[0].shape.inner = 0.18; d.layers[0].shape.segments = 6; d.layers[0].shape.jitter = 0.5;
    }),
    anim: { duration: 9, fps, size, tracks: [t("p1", "shapeRotation", 0, 360, "linear"), t("p2", "hue", -25, 25, "sine", 1, 0.3)] },
  },
  {
    slug: "brat-lime", name: "Brat Lime",
    build: () => patch("#8ace0066", (d) => {
      d.layers[0].layout = "linear";
      d.layers[0].palette.colors = ["#8ace00", "#365314", "#0a0a0a"];
      d.background = "#000000"; d.treatment = { effect: "dither", intensity: 0.45, scale: 2 };
      d.glow = 0.3; d.vignette = 0.35; d.relief.grain = 0.2;
      d.layers[0].shape.count = 11; d.layers[0].shape.jitter = 0.75; d.layers[0].shape.margin = 0.05;
    }),
    anim: { duration: 7, fps, size, tracks: [t("p1", "offsetX", -0.06, 0.06, "sine"), t("p2", "effectIntensity", 0.35, 0.55, "sine", 2)] },
  },
  {
    slug: "gold-luxe", name: "Gold Luxe",
    build: () => patch("#d9770655", (d) => {
      d.layers[0].layout = "radial";
      d.layers[0].palette.colors = ["#fde68a", "#d97706", "#78350f"];
      d.background = "#0c0a03"; d.bgGradient = true; d.background2 = "#171105";
      d.glow = 0.5; d.vignette = 0.5; d.relief.grain = 0.3; d.relief.topShadow = 0.4;
      d.layers[0].shape.count = 6; d.layers[0].shape.margin = 0.05; d.layers[0].shape.inner = 0.06;
    }),
    anim: { duration: 13, fps, size, tracks: [t("p1", "scale", 0.96, 1.08, "sine"), t("p2", "glow", 0.4, 0.62, "sine", 1, 0.5), t("p3", "hue", -8, 8, "sine", 1, 0.25)] },
  },
  {
    slug: "midnight-rain", name: "Midnight Rain",
    build: () => patch("#6366f144", (d) => {
      d.layers[0].layout = "linear";
      d.layers[0].palette.colors = ["#38bdf8", "#6366f1", "#0f172a"];
      d.background = "#04060f"; d.treatment = { effect: "scanlines", intensity: 0.3, scale: 6 };
      d.glow = 0.4; d.vignette = 0.45; d.relief.grain = 0.2;
      d.layers[0].shape.count = 16; d.layers[0].shape.jitter = 0.85; d.layers[0].shape.margin = 0.1;
    }),
    anim: { duration: 10, fps, size, tracks: [t("p1", "offsetY", -0.05, 0.05, "sine"), t("p2", "hue", -14, 14, "sine", 1, 0.4), t("p3", "vignette", 0.38, 0.55, "sine", 2)] },
  },
];
