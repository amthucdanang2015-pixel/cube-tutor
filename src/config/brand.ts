export type OfferId = "taste-review" | "first-loop" | "product-loop";

export interface Offer {
  id: OfferId;
  name: string;
  price: string;
  timeline: string;
  promise: string;
  purpose: string;
  includes: string[];
  cta: string;
  featured?: boolean;
}

const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
const vercelHost = (process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL)?.replace(/\/$/, "");
const inferredSiteUrl = configuredSiteUrl || (vercelHost ? `https://${vercelHost}` : "http://localhost:3000");

export const BRAND = {
  name: "Cube Tutor",
  wordmark: "CUBE/TUTOR",
  compactMark: "C/T",
  siteUrl: inferredSiteUrl,
  legacySiteUrl: "https://vibetoreal.dev",
  email: "mailnamnv@gmail.com",
  positioning: "An agent-native product company and product partner.",
  headline: "Interactive Cube Lessons",
  idea: "Human taste, built into every loop.",
  description:
    "TasteLoop combines ten years of shared product experience, agent speed, human judgment and real-world feedback to choose, design, build, launch and improve products people actually want.",
  socialDescription:
    "Agent speed, human judgment, and real-world feedback—looped into better products.",
} as const;

export const NAV_LINKS = [
  { href: "/cube-tutor#main", label: "Practice" },
  { href: "/cube-tutor#main2", label: "Method" },
] as const;

export const OFFERS: Offer[] = [
  {
    id: "taste-review",
    name: "Taste Review",
    price: "$499",
    timeline: "Delivered within 48 hours",
    promise: "We tell you what should happen next—and why.",
    purpose:
      "For founders with an idea, prototype, design, live product, or AI-built application who need a clear decision before more output.",
    includes: [
      "Product diagnosis, positioning, customer, UX, and conversion critique",
      "Commercial direction and the riskiest assumptions",
      "What to keep, remove, or change",
      "A prioritized decision memo and recorded walkthrough",
      "The next experiment, plus a short follow-up discussion",
    ],
    cta: "Get a Taste Review",
    featured: true,
  },
  {
    id: "first-loop",
    name: "First Loop",
    price: "From $3,500",
    timeline: "Usually 7–10 working days",
    promise: "Find the stronger direction by making one critical slice real.",
    purpose:
      "We sharpen the product and commercial direction, build a critical working slice, test it against reality, and recommend whether to ship, change, narrow, or stop.",
    includes: [
      "Product and commercial direction",
      "One critical working product slice",
      "A real feedback test with an explicit question",
      "A ship, change, narrow, or stop recommendation",
    ],
    cta: "Start the First Loop",
  },
  {
    id: "product-loop",
    name: "Product Loop",
    price: "$9,800 per month",
    timeline: "Month to month",
    promise: "One important product outcome at a time.",
    purpose:
      "An accountable product partner across strategy, research, UX, design, engineering, AI workflows, infrastructure, analytics, launch, and iteration.",
    includes: [
      "One named outcome with evidence and a decision owner",
      "End-to-end product and engineering execution",
      "Frequent working releases, not status theater",
      "Learnings codified into the product system",
    ],
    cta: "Discuss a Product Loop",
  },
];

export const offerById = (id: OfferId) => OFFERS.find((offer) => offer.id === id)!;

/**
 * Compatibility-sensitive identifiers. They remain unchanged until a deliberate
 * migration can preserve existing URLs, local access state, and deployed infra.
 */
export const LEGACY_IDENTIFIERS = {
  storagePrefix: "v2r_",
  showcaseEvent: "vtr:showcase-select",
  tableEnv: "VTR_TABLE_NAME",
  gradientPath: "/gradient",
} as const;
