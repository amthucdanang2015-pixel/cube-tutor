/**
 * The "100×" redesign showcase.
 * Each entry = a real, recognizable product screen, rebuilt as the version it
 * *should* be. The point is the contrast: their cluttered original vs a smart,
 * focused redesign — proof of taste, not random prettiness.
 *
 * To add an entry:
 *   1. Add a Redesign object below.
 *   2. Build the screen component(s) in src/components/redesigns/<product>.tsx
 *      exporting an `After` (rich, animated) and an optional `Before` (plain).
 *   3. Register the slug → components in src/components/redesigns/index.tsx.
 */

export interface Redesign {
  slug: string;
  product: string; // "Duolingo"
  screen: string; // "Daily lesson home"
  category: string; // "Learning" | "Music" | "Productivity" | ...
  frame: "phone" | "browser";
  url?: string; // shown in browser chrome
  tagline: string; // the one-line thesis of the redesign
  problems: string[]; // what's broken in the original (be specific + fair)
  fixes: string[]; // the principles the redesign applies
  system: {
    palette: string[]; // hex chips shown in the principles panel
    type: string; // type direction
    motion: string; // the signature motion
  };
  prompt: string; // copy-paste prompt to rebuild the redesign
  accent: string; // hex used for the rail dot + glow
}

export const REDESIGNS: Redesign[] = [
  {
    slug: "duolingo-daily-home",
    product: "Duolingo",
    screen: "Daily lesson home",
    category: "Learning",
    frame: "phone",
    tagline: "One clear next action instead of a slot machine.",
    problems: [
      "The home screen competes for attention: gems, hearts, streak, league, crowns, and banners all shout at once.",
      "The single most important thing — start today's lesson — is buried under gamification noise.",
      "Streaks are framed as anxiety (don't lose it!) rather than quiet momentum.",
    ],
    fixes: [
      "A single focus card: today's lesson, an honest time estimate, one primary button.",
      "Gamification demoted to calm, ambient cues — streak is a soft signal, not an alarm.",
      "Progress shown as a drawing ring that rewards return visits without pressure.",
      "Generous whitespace and one warm accent so the eye lands exactly where it should.",
    ],
    system: {
      palette: ["#58cc02", "#1cb0f6", "#fff7ed", "#2b2b2b"],
      type: "Rounded grotesk, three weights — friendly but disciplined hierarchy.",
      motion: "Streak counts up, the progress ring draws, up-next rows stagger in.",
    },
    accent: "#58cc02",
    prompt:
      "Design a mobile 'daily lesson home' screen for a language-learning app in Next.js + Tailwind + Motion. Warm off-white background (#fff7ed). Layout, top to bottom: a small personal greeting; a calm streak pill (flame + number, soft amber, no urgency); ONE hero focus card with a soft green gradient containing 'Today's lesson', a unit title, a circular SVG progress ring that animates its draw to ~60% on load, an honest time estimate, and a single primary 'Continue' button (green, gentle magnetic hover); below it an 'Up next' list of 3 compact lesson rows connected by a faint path line; a minimal 3-item bottom tab bar. Motion: greeting fades in, streak number counts up, the focus card scales in, the ring draws, up-next rows stagger (60ms). Demote all gamification to quiet ambient cues. Generous whitespace, one accent, clear single call-to-action. 60fps, reduced-motion aware.",
  },
  {
    slug: "spotify-now-playing",
    product: "Spotify",
    screen: "Now playing",
    category: "Music",
    frame: "phone",
    tagline: "Let the music fill the screen, not the chrome.",
    problems: [
      "Now Playing is ringed with competing controls — queue, devices, share, lyrics, like — so the music itself feels small.",
      "The album art, the emotional core, is cramped between toolbars.",
      "Color is ignored: every track looks the same regardless of its art.",
    ],
    fixes: [
      "Album art becomes the hero, with an ambient glow extracted from its own colors.",
      "Controls reduced to the three that matter, everything else one swipe away.",
      "A living scrubber and a single highlighted lyric line keep you in the song.",
      "The whole screen tints to the track — every song feels like its own world.",
    ],
    system: {
      palette: ["#1db954", "#a855f7", "#0b0b0f", "#f5f5f7"],
      type: "Tight, confident sans — big title, quiet metadata.",
      motion: "Art scales in, ambient color breathes, the waveform scrubber animates, lyrics crossfade.",
    },
    accent: "#1db954",
    prompt:
      "Design a mobile 'now playing' music screen in Next.js + Tailwind + Motion. Near-black background (#0b0b0f) with an ambient radial glow whose colors are sampled from the album art (fake it with a purple→teal gradient). Center a large rounded album-art square with a soft colored shadow. Below: the track title (large, animates in), artist (muted), then a custom waveform scrubber whose bars animate continuously, an elapsed/remaining time row, and exactly three controls (previous, a big play/pause, next) — nothing else on the main view. Add one highlighted lyric line that crossfades to the next every few seconds. The whole screen subtly tints to the art's color. Motion: art scales + fades in, ambient glow breathes on a slow loop, waveform animates, lyric crossfades. Immersive and calm. 60fps, reduced-motion aware.",
  },
  {
    slug: "gmail-triage-inbox",
    product: "Gmail",
    screen: "Inbox",
    category: "Productivity",
    frame: "browser",
    url: "mail.google.com",
    tagline: "Triage-first: what needs you, summarized, in one glance.",
    problems: [
      "The inbox is a flat wall of equal-weight rows — urgent and trivial look identical.",
      "Category tabs, a dense toolbar, ads, and checkboxes crowd out the actual messages.",
      "You read every subject line to find the few that matter. The app makes you do the triage.",
    ],
    fixes: [
      "Messages grouped by what they ask of you: Needs you · FYI · Later.",
      "Each thread carries a one-line AI summary and a suggested action, so you decide in a glance.",
      "Calm typographic hierarchy, colored sender avatars, generous spacing — no tabs, no ads, no noise.",
      "Quick actions appear on hover; the keyboard does the rest.",
    ],
    system: {
      palette: ["#2563eb", "#ea4335", "#0f1115", "#e8eaed"],
      type: "Clean humanist sans, strict size scale for instant scanning.",
      motion: "Groups fade in, rows stagger, hover reveals quick actions with a spring.",
    },
    accent: "#2563eb",
    prompt:
      "Design a desktop email 'inbox' screen in Next.js + Tailwind + Motion, dark theme (#0f1115). Replace the flat list with triage groups: 'Needs you', 'FYI', and 'Later', each a labeled section. Each email row has: a colored circular sender-initial avatar, the sender, a subject, and — the key idea — a one-line AI summary of the thread plus 1–2 suggested-action chips (e.g. 'Reply: confirm', 'Pay invoice'). Generous row spacing, strict type scale so scanning is effortless, no category tabs, no ads, no checkboxes. A slim left sidebar with a prominent Compose, a calm top search. On row hover, quick actions (archive, done, snooze) slide in from the right with a spring. Motion: groups fade in, rows stagger (40ms), hover actions spring in. Calm, fast, scannable. 60fps, reduced-motion aware.",
  },
];

export function getRedesign(slug: string): Redesign | undefined {
  return REDESIGNS.find((r) => r.slug === slug);
}

export const REDESIGN_CATEGORIES = Array.from(new Set(REDESIGNS.map((r) => r.category)));
