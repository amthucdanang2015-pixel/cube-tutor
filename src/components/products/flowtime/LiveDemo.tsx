"use client";

import { useEffect, useMemo, useState } from "react";
import { DESIGN_SYSTEMS } from "@/data/designSystems";
import { resolveFromParams } from "../engine/styleParams";
import { LiveShell } from "../engine/LiveShell";
import type { Device } from "../engine/contract";
import { CanonicalApp } from "./Flowtime";
import { PhoneChrome, TabletChrome } from "@/components/redesigns/_chrome";
import { Monitor, Tablet, Smartphone, Repeat } from "lucide-react";

/**
 * The fully interactive demo (D-013 → D-029): the SAME CanonicalApp in
 * mode="live", on the shared LiveShell. Params are read from window.location
 * directly (client-only page) — robust in every rendering mode.
 */
export function LiveDemo() {
  const [params, setParams] = useState<URLSearchParams | null>(null);
  useEffect(() => { setParams(new URLSearchParams(window.location.search)); }, []);

  const [auto, setAuto] = useState<Device>("desktop");
  const [pin, setPin] = useState<Device | null>(null); // null = follow the real viewport
  useEffect(() => {
    const compute = () => setAuto(window.innerWidth < 640 ? "mobile" : window.innerWidth < 1024 ? "tablet" : "desktop");
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);
  const device: Device = pin ?? auto;
  const framed = pin === "mobile" || pin === "tablet"; // pinned small → show a real device frame

  // style arrives from the studio's "Open live demo" through the shared codec (D-028)
  const ds = useMemo(() => (params ? resolveFromParams(params) : DESIGN_SYSTEMS[0]), [params]);

  const app = <CanonicalApp ds={ds} scene="dashboard" device={device} mode="live" />;

  return (
    <LiveShell
      backHref="/playground/flowtime"
      backLabel="Back to styles"
      styleName={ds.name}
      topCenter={
        /* device switcher — preview the app at any size (D-015 feedback #2) */
        <div className="flex rounded-full border border-white/10 bg-black/60 p-0.5 shadow-2xl backdrop-blur-xl">
          {([[null, "Auto", Repeat], ["desktop", "", Monitor], ["tablet", "", Tablet], ["mobile", "", Smartphone]] as [Device | null, string, typeof Monitor][]).map(([val, label, Icon]) => (
            <button key={String(val)} onClick={() => setPin(val)} aria-label={val ? `Preview ${val}` : "Auto (follow window)"}
              className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-medium transition ${pin === val ? "bg-white text-black" : "text-white/55 hover:text-white"}`}>
              <Icon className="h-3.5 w-3.5" />{label}
            </button>
          ))}
        </div>
      }
    >
      {framed ? (
        <div className="flex h-full w-full items-center justify-center p-4">
          {pin === "mobile" ? (
            <div className="h-[92%] max-h-[760px]" style={{ aspectRatio: "9/19" }}><PhoneChrome statusDark={ds.mode === "light"}>{app}</PhoneChrome></div>
          ) : (
            <div className="h-[92%] max-h-[820px] max-w-full" style={{ aspectRatio: "3/4.1" }}><TabletChrome>{app}</TabletChrome></div>
          )}
        </div>
      ) : (
        app
      )}
    </LiveShell>
  );
}
