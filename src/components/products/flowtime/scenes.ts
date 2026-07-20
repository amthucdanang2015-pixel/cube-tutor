import type { Scene } from "../engine/contract";
import type { FacetId } from "@/data/products";
import type { SceneKey } from "./Flowtime";

/* ============================================================================
 * Flowtime's showcase film (D-012 → D-029). The product owns its own scene
 * vocabulary; the engine only knows `{ key, ms, label, cursor?, sweep? }`.
 * ==========================================================================*/

export const FLOWTIME_SCENES: Scene<SceneKey>[] = [
  { key: "splash", ms: 2000, label: "Splash" },
  { key: "skeleton", ms: 1700, label: "Loading" },
  { key: "dashboard", ms: 4200, label: "Dashboard", cursor: [[22, 40], [62, 30], [78, 52]] },
  { key: "timer", ms: 4200, label: "Focus timer", cursor: [[30, 45], [30, 72], [30, 73]] },
  { key: "tasks", ms: 5200, label: "Tasks", cursor: [[62, 52], [62, 57], [62, 62]] },
  { key: "assistant", ms: 5400, label: "AI assistant", cursor: [[70, 12], [80, 40], [82, 62]] },
  { key: "alerts", ms: 4600, label: "Notifications", cursor: [[50, 10], [88, 12]] },
  { key: "settings", ms: 5000, label: "Settings", cursor: [[82, 30], [82, 46], [80, 64]] },
  { key: "responsive", ms: 5200, label: "Responsive", sweep: [[0, "desktop"], [1100, "tablet"], [2500, "mobile"], [4100, "desktop"]] },
];

/** Which beat best demonstrates each style facet (D-014). */
export const FLOWTIME_FACET_SCENE: Record<FacetId, SceneKey> = {
  accent: "dashboard",
  typography: "dashboard",
  motion: "dashboard",
  background: "dashboard",
  loading: "skeleton",
  splash: "splash",
  transition: "tasks",
  icons: "dashboard",
};
