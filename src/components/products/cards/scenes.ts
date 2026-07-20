import type { Scene } from "../engine/contract";
import type { FacetId } from "@/data/products";

/* ============================================================================
 * Cardmaker's showcase film (D-029 → D-030).
 *
 * D-030 correction: the product is not the card — it is the APP that makes
 * cards. So the film walks the app's features (the editor, live typing, the
 * three layouts, the flip, present mode, export), not just the artifact
 * spinning. Every beat scripts the app itself; see CardMaker's scene effect.
 * ==========================================================================*/

export type CardScene = "editor" | "typing" | "layouts" | "flip" | "present" | "export";

export const CARD_SCENES: Scene<CardScene>[] = [
  { key: "editor", ms: 3400, label: "The editor", cursor: [[16, 34], [16, 58], [62, 52]] },
  { key: "typing", ms: 4200, label: "Type, it updates", cursor: [[16, 30], [17, 31]] },
  { key: "layouts", ms: 4400, label: "Three layouts", cursor: [[13, 76], [18, 76], [23, 76]] },
  { key: "flip", ms: 2800, label: "The flip", cursor: [[62, 52], [63, 52]] },
  { key: "present", ms: 5600, label: "Present mode" },
  { key: "export", ms: 3800, label: "Export", cursor: [[90, 12], [78, 72]] },
];

/** Which beat best demonstrates each style facet (D-014). Total by law. */
export const CARD_FACET_SCENE: Record<FacetId, CardScene> = {
  accent: "editor",
  typography: "typing",   // watching text get typed shows the face best
  motion: "present",      // the spin speed + flip curve carry the motion tokens
  icons: "flip",          // the contact icons live on the back
  // facets the card can't express — never rendered, but the map must be total
  background: "editor",
  loading: "editor",
  splash: "editor",
  transition: "flip",
};
