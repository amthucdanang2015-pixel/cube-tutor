import type { DesignSystem } from "@/data/designSystems";

/* ============================================================================
 * The Playground product contract (D-028 → D-029).
 *
 * A Playground product is a real product that renders from design tokens only.
 * The engine shows it two ways, and ONLY these two:
 *
 *   showcase — "run it as a video": a scene director walks the product through
 *              its own features on a timeline, loops forever. This is the
 *              studio stage.
 *   live     — "use it for real": the same product, fully interactive, on
 *              /playground/<slug>/live.
 *
 * Both modes render inside the SAME stage container (`STAGE_BG`, centered), so
 * the studio preview is a scale model of the live site — never a different
 * design. The engine knows nothing about any specific product.
 * ==========================================================================*/

/** The one stage colour. Studio stage and live page share it, by law. */
export const STAGE_BG = "#0b0b0e";

export type Device = "desktop" | "tablet" | "mobile";
export type DemoMode = "showcase" | "live";

/**
 * How the stage frames a product.
 *   device — it's a website/app: wrap it in browser / tablet / phone chrome.
 *   free   — it's an object (a card, a poster, a device): let it float centred.
 */
export type StageFrame = "device" | "free";

/** One beat of the showcase film. `key` is the product's own scene vocabulary. */
export interface Scene<K extends string = string> {
  key: K;
  /** how long this beat holds, in ms */
  ms: number;
  label: string;
  /** ghost-cursor waypoints, in % of the stage: [x, y][] */
  cursor?: [number, number][];
  /** a scene may sweep the device frame: [msOffset, device][] */
  sweep?: [number, Device][];
}

/**
 * What every product demo receives. `scene` is meaningful in showcase mode and
 * ignored in live mode, where the user's own interactions drive the product.
 */
export interface ProductDemoProps<K extends string = string> {
  ds: DesignSystem;
  scene: K;
  device: Device;
  mode: DemoMode;
}
