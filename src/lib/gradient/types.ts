/** GRADIENTOOL — generative visual engine types. */

export type Layout = "linear" | "radial" | "orbit";
export type Blend = "normal" | "multiply" | "screen" | "overlay" | "lighten" | "difference" | "soft-light";
export type Effect = "none" | "grain" | "scanlines" | "chromatic" | "halftone" | "dither";

export interface Palette {
  colors: string[]; // 2–5 hex stops
  angle: number; // 0–360, direction of the color sweep (linear layouts)
}

export interface Shape {
  count: number; // number of bands / rings / arcs (3–16)
  inner: number; // 0–0.7 inner radius (radial / orbit)
  margin: number; // 0–0.4 gap between elements (fraction)
  spread: number; // 0.25–1 angular span (orbit)
  rotation: number; // 0–360 start angle
  jitter: number; // 0–1 per-element size variance
  segments: number; // 1–10 subdivisions (stepped / blocky look)
}

export interface Layer {
  layout: Layout;
  palette: Palette;
  shape: Shape;
  blend: Blend;
  opacity: number; // 0–1
  visible: boolean;
}

export interface Relief {
  topShadow: number; // 0–1
  depth: number; // 0–1 (fake 3D extrude)
  seam: number; // 0–0.2 (gap line strength)
  grain: number; // 0–1
}

export interface Treatment {
  effect: Effect;
  intensity: number; // 0–1
  scale: number; // effect cell size 1–12
}

export interface Transform {
  rotate: number; // deg, whole-composition rotation
  scale: number; // 0.5–2 zoom
  x: number; // -0.5–0.5 offset (fraction of size)
  y: number;
  hue: number; // -180–180 hue rotation of the whole palette
}

export interface Design {
  seed: string;
  aspect: AspectKey;
  background: string;
  bgGradient: boolean; // background as a 2-stop gradient
  background2: string;
  layers: Layer[]; // 1–2
  relief: Relief;
  transform: Transform;
  glow: number; // 0–1 bloom
  vignette: number; // 0–1 edge darkening
  treatment: Treatment;
}

/* ---------- animation ---------- */
export type EaseKind = "linear" | "in" | "out" | "in-out" | "ping-pong" | "sine";
export const EASES: EaseKind[] = ["linear", "in", "out", "in-out", "ping-pong", "sine"];

/** Numeric parameters that can be keyframed. */
export type AnimParamKey =
  | "rotate" | "hue" | "scale" | "offsetX" | "offsetY"
  | "angle" | "inner" | "spread" | "shapeRotation" | "margin"
  | "grain" | "depth" | "glow" | "vignette" | "effectIntensity";

export interface Track {
  id: string;
  param: AnimParamKey;
  from: number;
  to: number;
  easing: EaseKind;
  loops: number; // cycles across the duration
  offset: number; // phase 0–1
  enabled: boolean;
}

export interface Anim {
  tracks: Track[];
  duration: number; // seconds
  fps: number; // 24 | 30 | 60
  size: number; // output longest side (px)
}

export type AspectKey = "1:1" | "4:5" | "3:4" | "16:9" | "9:16" | "3:2" | "2:3";

export const ASPECTS: Record<AspectKey, [number, number]> = {
  "1:1": [1, 1],
  "4:5": [4, 5],
  "3:4": [3, 4],
  "16:9": [16, 9],
  "9:16": [9, 16],
  "3:2": [3, 2],
  "2:3": [2, 3],
};

export const BLENDS: Blend[] = ["normal", "multiply", "screen", "overlay", "lighten", "difference", "soft-light"];
export const LAYOUTS: Layout[] = ["linear", "radial", "orbit"];
export const EFFECTS: Effect[] = ["none", "grain", "scanlines", "chromatic", "halftone", "dither"];
