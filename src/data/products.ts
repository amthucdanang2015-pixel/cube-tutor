/**
 * The Playground product registry (D-021, extended by D-028).
 *
 * One demo-product concept per entry; each product lives in its own folder
 * under components/products/<slug>/ and consumes the shared design-language
 * engine (designSystems.ts tokens + components/products/engine).
 *
 * Adding a product = one folder + one entry here + two thin pages. The engine
 * never learns a product's name.
 */

import type { StageFrame } from "@/components/products/engine/contract";

/** The Customize dials the shared StyleRail can offer. */
export type FacetId =
  | "accent" | "typography" | "motion" | "background"
  | "loading" | "splash" | "transition" | "icons";

/** Every facet, in the order the rail renders them. */
export const ALL_FACETS: FacetId[] = ["accent", "typography", "motion", "background", "loading", "splash", "transition", "icons"];

export interface PlaygroundProduct {
  slug: string;
  name: string;
  tagline: string;
  blurb: string;
  href: string;
  accent: string;
  /** what the product demonstrates */
  proves: string[];
  /** which Customize facets the StyleRail shows for this product */
  facets: FacetId[];
  /**
   * How the stage frames the demo (D-029).
   *   device — a website/app: browser / tablet / phone chrome.
   *   free   — an object: it floats, centred, in the stage.
   */
  frame: StageFrame;
  /** starting design-language slug (falls back to the first language) */
  defaultStyle?: string;
  /** rail shows the Auto-tour toggle (cycles languages on a timer) */
  autoTour?: boolean;
  /** stage shows the device pin row (desktop/tablet/mobile frames) */
  devices?: boolean;
}

export const PRODUCTS: PlaygroundProduct[] = [
  {
    slug: "flowtime",
    name: "Flowtime",
    tagline: "A focus-timer app in every design language",
    blurb:
      "One living product — timer, tasks, notes, calendar, AI assistant — re-skinned live by 112 design languages. Watch the cinematic tour or drive it yourself.",
    href: "/playground/flowtime",
    accent: "#7c5cff",
    proves: ["112 design languages", "cinematic scene director", "fully interactive live mode"],
    facets: ALL_FACETS,
    frame: "device",
    defaultStyle: "monochrome",
    autoTour: true,
    devices: true,
  },
  {
    slug: "cards",
    name: "Card Studio",
    tagline: "Design a business card that flips in 3D",
    blurb:
      "Type your details, pick a design language, and watch a two-sided card come alive — animated background, real typography, a full 3D flip to show front and back.",
    href: "/playground/cards",
    accent: "#22d3ee",
    proves: ["a real editor app as the demo", "3D front/back flip", "112 design languages"],
    // A printed card has no loading state, no splash, no route transition, and no
    // page background — offering those dials would be a lie. Everything it CAN
    // express, it expresses.
    facets: ["accent", "typography", "motion", "icons"],
    // D-030: the product is Cardmaker, an APP (the card is its artifact) —
    // so it gets browser chrome like any app
    frame: "device",
    defaultStyle: "monochrome",
    autoTour: true,
    // D-031: it's a responsive app, so it gets the same Auto/Desktop/Tablet/
    // Mobile pin flowtime has — preview the editor at any size
    devices: true,
  },
];

export function productBySlug(slug: string): PlaygroundProduct {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) throw new Error(`Unknown playground product: ${slug}`);
  return p;
}
