import type { Transition } from "framer-motion";
import { dsMotion, type DesignSystem } from "@/data/designSystems";

/* ============================================================================
 * The Motion facet, as framer-motion values (D-028).
 * Every product reads its timing from here, so "Motion: Snappy" feels snappy
 * in the timer app AND in the card flip. Products never hard-code a duration.
 * ==========================================================================*/

/** The style's motion tokens as a framer transition (scene changes, view swaps). */
export function styleTransition(ds: DesignSystem): Transition {
  const m = dsMotion(ds);
  switch (m.ease) {
    case "snap": return { duration: m.dur / 1000, ease: [0.2, 0, 0, 1] };
    case "swift": return { duration: m.dur / 1000, ease: [0.3, 0.9, 0.3, 1] };
    case "bounce": return { type: "spring", stiffness: 320, damping: 18 };
    case "elastic": return { type: "spring", stiffness: 260, damping: 11 };
    case "slow": return { duration: m.dur / 1000, ease: [0.65, 0, 0.35, 1] };
    case "drift": return { duration: m.dur / 1000, ease: [0.16, 0.6, 0.2, 1] };
    case "stepped": return { duration: m.dur / 1000, ease: (t: number) => Math.round(t * 5) / 5 };
    default: return { duration: m.dur / 1000, ease: [0.22, 1, 0.36, 1] };
  }
}

/**
 * A big physical gesture (a 180°/360° card flip) needs more time on the clock
 * than a scene crossfade, but the SAME curve. Springs pass through untouched —
 * their feel is already physical.
 */
export function gestureTransition(ds: DesignSystem, scale = 2): Transition {
  const t = styleTransition(ds);
  if (typeof (t as { duration?: number }).duration === "number") {
    return { ...t, duration: Math.max(0.35, (t as { duration: number }).duration * scale) };
  }
  return t;
}

/** A continuously looping rotation (turntable) in seconds — 9s at the default 320ms. */
export function loopDuration(ds: DesignSystem, base = 9, min = 4, max = 12): number {
  return Math.min(max, Math.max(min, (dsMotion(ds).dur / 320) * base));
}

/** Bare ease for the rail's Motion swatches (a curve, not a transition). */
export function motionPreviewEase(ease: string): number[] | string | ((t: number) => number) {
  switch (ease) {
    case "snap": return [0.2, 0, 0, 1];
    case "swift": return [0.3, 0.9, 0.3, 1];
    case "bounce": return "backOut";
    case "elastic": return "anticipate";
    case "slow": return [0.65, 0, 0.35, 1];
    case "drift": return [0.16, 0.6, 0.2, 1];
    case "stepped": return (t: number) => Math.round(t * 4) / 4;
    default: return [0.22, 1, 0.36, 1];
  }
}
