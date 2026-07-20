"use client";

import { useEffect, useMemo, useState } from "react";
import { DESIGN_SYSTEMS } from "@/data/designSystems";
import { resolveFromParams } from "../engine/styleParams";
import { LiveShell } from "../engine/LiveShell";
import type { Device } from "../engine/contract";
import { CardMaker } from "./CardMaker";
import { LAYOUTS, type CardData, type Layout } from "./CardPerformer";

/* ============================================================================
 * Card Live (D-023 → D-030) — Cardmaker as a STANDALONE product. The exact
 * app the studio film demonstrates, fully interactive: type your details,
 * switch layouts, flip, present, export for real.
 *
 * No dock — the app carries its own controls (that's the point). Live mode
 * has no style UI: the design language arrived fixed through the URL codec.
 * ==========================================================================*/

export function CardLive() {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => { setParams(new URLSearchParams(window.location.search)); }, []);

  // follow the real viewport, like flowtime live (D-015)
  const [device, setDevice] = useState<Device>("desktop");
  useEffect(() => {
    const compute = () => setDevice(window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop");
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const ds = useMemo(() => (params ? resolveFromParams(params) : DESIGN_SYSTEMS[0]), [params]);

  // optional deep-link hydration: content + layout under product keys (§4.4)
  const initial = useMemo(() => {
    if (!params) return undefined;
    const data: Partial<CardData> = {};
    ([["n", "name"], ["ti", "title"], ["c", "company"], ["e", "email"], ["ph", "phone"], ["web", "site"]] as const).forEach(([k, field]) => {
      const v = params.get(k); if (v) data[field] = v;
    });
    const l = params.get("cl") as Layout | null;
    return { data, layout: l && LAYOUTS.some((x) => x.id === l) ? l : undefined };
  }, [params]);

  return (
    <LiveShell backHref="/playground/cards" backLabel="Card Studio" styleName={ds.name}>
      {params && (
        <div className="h-full w-full p-4 pb-5 pt-16">
          <div className="h-full w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <CardMaker ds={ds} scene="editor" device={device} mode="live" initial={initial} />
          </div>
        </div>
      )}
    </LiveShell>
  );
}
