/**
 * Chrome policy (constitution D-011).
 * Immersive studio routes get logo-only nav and no footer — the tool owns the screen.
 * This list is the single source of truth; Nav and Footer both read it.
 */
export const IMMERSIVE_ROUTES = ["/playground", "/animations", "/gradient"];

export function isImmersive(pathname: string): boolean {
  return IMMERSIVE_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"));
}
