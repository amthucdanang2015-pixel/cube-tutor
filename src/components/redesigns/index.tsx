"use client";

import type { ComponentType } from "react";
import * as Duolingo from "./duolingo";
import * as Spotify from "./spotify";
import * as Gmail from "./gmail";

interface Pair {
  After: ComponentType;
  Before?: ComponentType;
}

/** slug → { After, Before }. Keep in sync with src/data/redesigns.ts. */
export const REDESIGN_SCREENS: Record<string, Pair> = {
  "duolingo-daily-home": { After: Duolingo.After, Before: Duolingo.Before },
  "spotify-now-playing": { After: Spotify.After, Before: Spotify.Before },
  "gmail-triage-inbox": { After: Gmail.After, Before: Gmail.Before },
};

export function getScreens(slug: string): Pair | undefined {
  return REDESIGN_SCREENS[slug];
}
