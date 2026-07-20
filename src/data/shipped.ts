/**
 * Shipped work — the proof (constitution D-007).
 * Adding a site = one object here. Apps are pulled live from the App Store
 * (see /api/apps) so the shelf updates automatically as new apps ship.
 */

export interface ShippedSite {
  slug: string;
  name: string;
  url: string;
  tagline: string;
  stack: string[];
  accent: string; // hex for the card glow
  /** set false if the site ever blocks iframing */
  embed?: boolean;
}

export const SHIPPED_SITES: ShippedSite[] = [
  {
    slug: "moreso",
    name: "Moreso",
    url: "https://www.moreso.io/",
    tagline: "A production SaaS — designed, built, and shipped end-to-end.",
    stack: ["Next.js", "Product design", "Full-stack"],
    accent: "#7c5cff",
  },
  {
    slug: "agentcto",
    name: "AgentCTO",
    url: "https://agentcto-fun-nam-nguyens-projects-2dee7f8f.vercel.app/",
    tagline: "An AI-agent product, from concept to a working build.",
    stack: ["Next.js", "AI agents", "UX"],
    accent: "#22d3ee",
  },
  {
    slug: "opencto",
    name: "OpenCTO",
    url: "https://opencto.vercel.app/",
    tagline: "Developer-facing product with a keyboard-first interface.",
    stack: ["Next.js", "Dev tools", "Design"],
    accent: "#10b981",
  },
  {
    slug: "groupumpfun",
    name: "Groupump",
    url: "https://groupumpfun.vercel.app/",
    tagline: "A consumer web app, shipped fast without shipping rough.",
    stack: ["Next.js", "Consumer", "Motion"],
    accent: "#f59e0b",
  },
];

/** App Store developer id — the showcase pulls this developer's apps live. */
export const APP_STORE_DEVELOPER_ID = "1719586694";

export interface ShippedApp {
  id: number;
  name: string;
  icon: string;
  screenshots: string[];
  url: string;
  genre: string;
}

/** One accent per App Store genre — keeps the app cards colour-coded and on-brand. */
export const GENRE_ACCENT: Record<string, string> = {
  Education: "#3b82f6",
  Productivity: "#10b981",
  Games: "#ec4899",
  Finance: "#f59e0b",
  Utilities: "#64748b",
  Entertainment: "#a855f7",
};
export const DEFAULT_APP_ACCENT = "#7c5cff";
export const appAccent = (genre: string) => GENRE_ACCENT[genre] ?? DEFAULT_APP_ACCENT;

/**
 * Curated one-liners for our shipped apps (matched by a stable slice of the App
 * Store name). Optional — anything without a note falls back to its genre.
 * Adding a note = one line here; the showcase picks it up automatically.
 */
export const APP_NOTES: { match: string; note: string }[] = [
  { match: "VocabTunes", note: "Learn vocabulary through music — an AI word builder that turns study into songs." },
  { match: "NoteFly", note: "Capture, transcribe, and organise notes by voice with an AI recorder." },
  { match: "Focus & To-Do", note: "A distraction-free focus timer and to-do list — no ads, just deep work." },
  { match: "WenLambo", note: "An AI meme and altcoin scanner for the crypto-curious." },
  { match: "King English", note: "English for kids, told through anime — playful, guided learning." },
  { match: "Buzzed", note: "The adult party game that gets the room going — card after card." },
  { match: "Rouly", note: "Spin-the-wheel party roulette for game nights." },
  { match: "Dilemma", note: "Would-you-rather dilemmas that spark real debate." },
  { match: "YIKES", note: "Truth or dare, reinvented for a bolder crowd." },
  { match: "Never Ever", note: "Never-have-I-ever, listen-and-answer edition." },
  { match: "Most Likely", note: "Most-likely-to, listen and vote — who does the group pick?" },
  { match: "Scan QR", note: "A fast, ad-free QR scanner that just works." },
];
export const appNote = (name: string) => APP_NOTES.find((n) => name.includes(n.match))?.note;
