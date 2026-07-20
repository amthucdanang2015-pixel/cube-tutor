import type { Anim, AnimParamKey, Design, EaseKind, Track } from "./types";

/* ---------- easings (phase 0..1 → eased 0..1) ---------- */
export function ease(kind: EaseKind, p: number): number {
  switch (kind) {
    case "in": return p * p;
    case "out": return 1 - (1 - p) * (1 - p);
    case "in-out": return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
    case "ping-pong": return 1 - Math.abs(2 * p - 1); // triangle, seamless loop
    case "sine": return (1 - Math.cos(p * Math.PI * 2)) / 2; // 0→1→0, seamless loop
    default: return p; // linear
  }
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* ---------- animatable parameters ---------- */
interface ParamDef { label: string; min: number; max: number; step: number; get: (d: Design) => number; set: (d: Design, v: number) => void }

const eachLayer = (d: Design, fn: (l: Design["layers"][number]) => void) => d.layers.forEach(fn);

export const PARAMS: Record<AnimParamKey, ParamDef> = {
  hue: { label: "Hue cycle", min: 0, max: 360, step: 1, get: (d) => d.transform.hue, set: (d, v) => { d.transform.hue = v; } },
  rotate: { label: "Rotation", min: 0, max: 360, step: 1, get: (d) => d.transform.rotate, set: (d, v) => { d.transform.rotate = v; } },
  scale: { label: "Scale", min: 0.5, max: 2, step: 0.01, get: (d) => d.transform.scale, set: (d, v) => { d.transform.scale = v; } },
  offsetX: { label: "Offset X", min: -0.4, max: 0.4, step: 0.01, get: (d) => d.transform.x, set: (d, v) => { d.transform.x = v; } },
  offsetY: { label: "Offset Y", min: -0.4, max: 0.4, step: 0.01, get: (d) => d.transform.y, set: (d, v) => { d.transform.y = v; } },
  angle: { label: "Gradient angle", min: 0, max: 360, step: 1, get: (d) => d.layers[0].palette.angle, set: (d, v) => eachLayer(d, (l) => { l.palette.angle = v; }) },
  inner: { label: "Inner radius", min: 0, max: 0.7, step: 0.01, get: (d) => d.layers[0].shape.inner, set: (d, v) => eachLayer(d, (l) => { l.shape.inner = v; }) },
  spread: { label: "Orbit spread", min: 0.2, max: 1, step: 0.01, get: (d) => d.layers[0].shape.spread, set: (d, v) => eachLayer(d, (l) => { l.shape.spread = v; }) },
  shapeRotation: { label: "Shape rotation", min: 0, max: 360, step: 1, get: (d) => d.layers[0].shape.rotation, set: (d, v) => eachLayer(d, (l) => { l.shape.rotation = v; }) },
  margin: { label: "Margin", min: 0, max: 0.4, step: 0.01, get: (d) => d.layers[0].shape.margin, set: (d, v) => eachLayer(d, (l) => { l.shape.margin = v; }) },
  grain: { label: "Grain", min: 0, max: 1, step: 0.01, get: (d) => d.relief.grain, set: (d, v) => { d.relief.grain = v; } },
  depth: { label: "3D depth", min: 0, max: 1, step: 0.01, get: (d) => d.relief.depth, set: (d, v) => { d.relief.depth = v; } },
  glow: { label: "Glow", min: 0, max: 1, step: 0.01, get: (d) => d.glow, set: (d, v) => { d.glow = v; } },
  vignette: { label: "Vignette", min: 0, max: 1, step: 0.01, get: (d) => d.vignette, set: (d, v) => { d.vignette = v; } },
  effectIntensity: { label: "Effect intensity", min: 0, max: 1, step: 0.01, get: (d) => d.treatment.intensity, set: (d, v) => { d.treatment.intensity = v; } },
};

export const ANIM_PARAM_KEYS = Object.keys(PARAMS) as AnimParamKey[];
/** Easings that return to their start — safe to loop without a visible jump. */
export const LOOP_SAFE: EaseKind[] = ["ping-pong", "sine"];

function clone(d: Design): Design {
  return {
    ...d,
    relief: { ...d.relief },
    transform: { ...d.transform },
    treatment: { ...d.treatment },
    layers: d.layers.map((l) => ({ ...l, shape: { ...l.shape }, palette: { ...l.palette, colors: [...l.palette.colors] } })),
  };
}

/** Apply all enabled tracks at normalized time t (0..1 over the duration). */
export function applyAnim(design: Design, anim: Anim, t: number): Design {
  if (!anim.tracks.some((tr) => tr.enabled)) return design;
  const d = clone(design);
  for (const tr of anim.tracks) {
    if (!tr.enabled) continue;
    const phase = (((t * tr.loops + tr.offset) % 1) + 1) % 1;
    const v = lerp(tr.from, tr.to, ease(tr.easing, phase));
    PARAMS[tr.param].set(d, v);
  }
  return d;
}

let tid = 0;
export function newTrack(param: AnimParamKey): Track {
  const p = PARAMS[param];
  return { id: `t${++tid}`, param, from: p.min, to: p.max, easing: "sine", loops: 1, offset: 0, enabled: true };
}

/** A gorgeous living-gradient default — color cycle + gentle breathing. */
export function defaultAnim(): Anim {
  return {
    tracks: [
      { id: "t-hue", param: "hue", from: 0, to: 360, easing: "linear", loops: 1, offset: 0, enabled: true },
      { id: "t-scale", param: "scale", from: 0.96, to: 1.06, easing: "sine", loops: 1, offset: 0, enabled: true },
    ],
    duration: 8,
    fps: 30,
    size: 1080,
  };
}

export function randomizeAnim(): Anim {
  const pool: AnimParamKey[] = ["hue", "shapeRotation", "rotate", "scale", "inner", "spread", "angle", "offsetX", "offsetY", "glow"];
  const n = 2 + Math.floor(Math.random() * 2);
  const chosen = [...pool].sort(() => Math.random() - 0.5).slice(0, n);
  const tracks: Track[] = chosen.map((param) => {
    const p = PARAMS[param];
    // hue & rotations loop seamlessly as a full sweep; others use a seamless sine
    const fullSweep = param === "hue" || param === "shapeRotation" || param === "rotate";
    const lo = p.min + Math.random() * (p.max - p.min) * 0.3;
    const hi = p.max - Math.random() * (p.max - p.min) * 0.3;
    return {
      id: newTrack(param).id, param,
      from: fullSweep ? p.min : lo, to: fullSweep ? p.max : hi,
      easing: fullSweep ? "linear" : "sine",
      loops: 1, offset: Math.random() * 0.5, enabled: true,
    };
  });
  return { tracks, duration: 6 + Math.floor(Math.random() * 4), fps: 30, size: 1080 };
}
