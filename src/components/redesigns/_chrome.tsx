"use client";

import { Wifi, BatteryFull, Signal } from "lucide-react";

/** A premium macOS-style browser window frame. */
export function BrowserChrome({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/12 bg-[#161617] shadow-2xl">
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-white/8 bg-[#1d1d1f] px-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex w-1/2 items-center justify-center gap-1.5 rounded-md bg-black/30 py-1 text-[11px] text-white/45">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" /> {url}
        </div>
        <div className="w-12" />
      </div>
      <div className="relative flex-1 overflow-hidden">{children}</div>
    </div>
  );
}

/** A premium phone frame — titanium rail, dynamic island, glass highlight. */
export function PhoneChrome({
  children,
  statusDark = false,
}: {
  children: React.ReactNode;
  statusDark?: boolean;
}) {
  const fg = statusDark ? "text-black" : "text-white";
  return (
    <div className="relative mx-auto h-full w-full max-w-[320px]">
      {/* side buttons (titanium rail details) */}
      <div className="pointer-events-none absolute -left-[2px] top-[18%] h-8 w-[3px] rounded-l bg-[#2a2a2e]" />
      <div className="pointer-events-none absolute -left-[2px] top-[28%] h-12 w-[3px] rounded-l bg-[#2a2a2e]" />
      <div className="pointer-events-none absolute -right-[2px] top-[22%] h-16 w-[3px] rounded-r bg-[#2a2a2e]" />

      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[2.6rem] bg-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] ring-[5px] ring-[#242428]">
        {/* app paints edge-to-edge; chrome overlays it — the app owns its safe-area inset (D-014) */}
        <div className="absolute inset-0">{children}</div>
        {/* dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-2.5 z-30 h-[22px] w-24 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/[0.06]" />
        {/* status bar (transparent, overlays the app like iOS) */}
        <div className={`pointer-events-none absolute inset-x-0 top-0 z-20 flex h-10 items-center justify-between px-7 pt-1.5 text-[11px] font-semibold ${fg}`}>
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3" />
            <Wifi className="h-3 w-3" />
            <BatteryFull className="h-3.5 w-3.5" />
          </div>
        </div>
        {/* home indicator */}
        <div className={`pointer-events-none absolute bottom-1.5 left-1/2 z-30 h-1 w-24 -translate-x-1/2 rounded-full ${statusDark ? "bg-black/30" : "bg-white/30"}`} />
        {/* glass highlight sweep */}
        <div className="pointer-events-none absolute inset-0 z-40 rounded-[2.3rem] bg-[linear-gradient(115deg,rgba(255,255,255,0.07)_0%,rgba(255,255,255,0.015)_28%,transparent_45%)]" />
      </div>
    </div>
  );
}

/** A premium tablet frame — even bezel, camera dot, home indicator. */
export function TabletChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto h-full w-full">
      <div className="pointer-events-none absolute -right-[2px] top-[12%] h-14 w-[3px] rounded-r bg-[#2a2a2e]" />
      <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[1.9rem] bg-black shadow-[0_40px_100px_-20px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)] ring-[7px] ring-[#242428]">
        {/* app paints edge-to-edge; camera overlays it (D-014) */}
        <div className="absolute inset-0">{children}</div>
        <div className="pointer-events-none absolute left-1/2 top-[7px] z-30 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[#0d0d10] ring-1 ring-white/[0.08]" />
        <div className="pointer-events-none absolute bottom-1 left-1/2 z-30 h-1 w-20 -translate-x-1/2 rounded-full bg-white/25" />
        <div className="pointer-events-none absolute inset-0 z-40 rounded-[1.6rem] bg-[linear-gradient(115deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.01)_30%,transparent_46%)]" />
      </div>
    </div>
  );
}
