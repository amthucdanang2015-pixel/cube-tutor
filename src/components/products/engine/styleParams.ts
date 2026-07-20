import { DESIGN_SYSTEMS, resolveStyle, type DesignSystem, type StyleOverrides, type FxKind, type LoadingKind, type SplashKind, type TransitionKind } from "@/data/designSystems";

/* ============================================================================
 * Style params codec (D-028) — the ONE source of truth for the live handoff.
 * Keys: s(base slug) p t m f a ba bb l sp tr i  — shared by every Playground
 * product. Products append their OWN params with different keys (never reuse
 * these). Replaces the duplicated encode/decode that used to live in each
 * product's StyleStudio.liveHref + LiveDemo.
 * ==========================================================================*/

/** Encode a base slug + overrides into a query string (no leading "?"). */
export function encodeStyle(baseSlug: string, ov: StyleOverrides): string {
  const map: Record<string, string | undefined> = {
    p: ov.palette,
    t: ov.type,
    m: ov.motion,
    f: ov.fx,
    a: ov.accent?.replace("#", ""),
    ba: ov.bgA?.replace("#", ""),
    bb: ov.bgB?.replace("#", ""),
    l: ov.loading,
    sp: ov.splash,
    tr: ov.transition,
    i: ov.icon,
  };
  const parts = [`s=${baseSlug}`];
  for (const [k, v] of Object.entries(map)) if (v) parts.push(`${k}=${encodeURIComponent(v)}`);
  return parts.join("&");
}

/** Decode URL params into a base DesignSystem + StyleOverrides. */
export function decodeStyle(params: URLSearchParams): { base: DesignSystem; ov: StyleOverrides } {
  const base = DESIGN_SYSTEMS.find((d) => d.slug === params.get("s")) ?? DESIGN_SYSTEMS[0];
  const hex = (v: string | null) => (v ? `#${v.replace("#", "")}` : undefined);
  const ov: StyleOverrides = {
    palette: params.get("p") ?? undefined,
    type: params.get("t") ?? undefined,
    motion: params.get("m") ?? undefined,
    fx: (params.get("f") as FxKind | null) ?? undefined,
    accent: hex(params.get("a")),
    bgA: hex(params.get("ba")),
    bgB: hex(params.get("bb")),
    loading: (params.get("l") as LoadingKind | null) ?? undefined,
    splash: (params.get("sp") as SplashKind | null) ?? undefined,
    transition: (params.get("tr") as TransitionKind | null) ?? undefined,
    icon: params.get("i") ?? undefined,
  };
  return { base, ov };
}

/** Convenience: resolve straight to a themed DesignSystem from params. */
export function resolveFromParams(params: URLSearchParams): DesignSystem {
  const { base, ov } = decodeStyle(params);
  return resolveStyle(base, ov);
}
