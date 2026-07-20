"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Loader2, Globe, Smartphone } from "lucide-react";
import { BrowserChrome } from "@/components/redesigns/_chrome";
import { SHIPPED_SITES, appAccent, appNote, type ShippedApp } from "@/data/shipped";

/* ============================================================================
 * The showcase — the core of the home page (constitution D-017).
 * A scalable two-column explorer: a list of shipped web + App Store products on
 * the left (its own scroll), and on the right either the live embedded site or
 * a screenshot gallery. Adding a product = one site object or one shipped app —
 * the layout, galleries, and hero fan all pick it up automatically.
 * ==========================================================================*/

type Item =
  | { kind: "web"; key: string; name: string; tagline: string; host: string; url: string; stack: string[]; accent: string; embed: boolean; icon: string; }
  | { kind: "app"; key: string; name: string; note: string; genre: string; icon: string; url: string; screenshots: string[]; accent: string };

type ShippedSiteWithIcon = { icon?: string, url: URL| string, name: string, tagline: string, slug: string, stack: string[], accent: string, embed?: boolean };

/** One item list, shared by the hero show and the showcase — same keys, same order. */
function useShowcaseItems(apps: ShippedApp[]): Item[] {
  return useMemo(() => {
    const web: Item[] = SHIPPED_SITES.map((s) => {
      const site = s as ShippedSiteWithIcon;
      const host = new URL(site.url).hostname.replace(/^www\./, "");
      return {
        kind: "web",
        key: `web-${site.slug}`,
        name: site.name,
        tagline: site.tagline,
        icon: site.icon ?? `https://www.google.com/s2/favicons?sz=64&domain=${host}`,
        host,
        url: typeof site.url === "string" ? site.url : site.url.toString(),
        stack: site.stack,
        accent: site.accent,
        embed: site.embed ?? true,
      };
    });
    const app: Item[] = apps.map((a) => ({
      kind: "app", key: `app-${a.id}`, name: a.name, note: appNote(a.name) ?? `${a.genre} · live on the App Store`,
      genre: a.genre, icon: a.icon, url: a.url, screenshots: a.screenshots, accent: appAccent(a.genre),
    }));
    return [...web, ...app];
  }, [apps]);
}

/** The hero show tells the showcase what to open (D-021). */
export const SHOWCASE_SELECT_EVENT = "vtr:showcase-select";

export function Showcase({ apps }: { apps: ShippedApp[] }) {
  const items = useShowcaseItems(apps);

  const [selKey, setSelKey] = useState<string>(`web-${SHIPPED_SITES[0].slug}`);
  useEffect(() => {
    if (!items.find((i) => i.key === selKey) && items[0]) setSelKey(items[0].key);
  }, [items, selKey]);
  // the cinematic hero can deep-select an item here; when it does, center that
  // row in the list so the user sees the selection without hunting (D-022)
  const listRef = useRef<HTMLDivElement>(null);
  const fromShow = useRef(false);
  useEffect(() => {
    const on = (e: Event) => { const k = (e as CustomEvent<string>).detail; if (k) { fromShow.current = true; setSelKey(k); } };
    window.addEventListener(SHOWCASE_SELECT_EVENT, on);
    return () => window.removeEventListener(SHOWCASE_SELECT_EVENT, on);
  }, []);
  useEffect(() => {
    if (!fromShow.current) return; // never move the list under the user's own pointer
    fromShow.current = false;
    const c = listRef.current;
    const row = c?.querySelector<HTMLElement>(`[data-key="${CSS.escape(selKey)}"]`);
    if (!c || !row) return;
    const cr = c.getBoundingClientRect(), rr = row.getBoundingClientRect();
    c.scrollTo({ top: c.scrollTop + (rr.top - cr.top) - c.clientHeight / 2 + rr.height / 2, left: c.scrollLeft + (rr.left - cr.left) - c.clientWidth / 2 + rr.width / 2, behavior: "smooth" });
  }, [selKey]);
  const sel = items.find((i) => i.key === selKey) ?? items[0];

  const webCount = SHIPPED_SITES.length;
  const appCount = apps.length;

  return (
    <div className="grid grid-cols-1 gap-5 overflow-x-clip lg:grid-cols-[336px_1fr]">
      {/* LEFT — the product list. Its own scroll; the detail never moves. */}
      <div className="order-2 min-w-0 lg:order-1 lg:h-[76vh] lg:max-h-[760px]">
        <p className="mb-3 hidden text-[11px] font-semibold uppercase tracking-widest text-white/40 lg:block">
          {webCount} live sites{appCount ? ` · ${appCount} apps` : ""}
        </p>
        <div ref={listRef} className="flex gap-2 overflow-x-auto pb-2 lg:h-[calc(100%-1.75rem)] lg:flex-col lg:gap-1.5 lg:overflow-x-hidden lg:overflow-y-auto lg:pr-1.5 scroll-slim">
          <GroupLabel icon={<Globe className="h-3 w-3" />}>Live web products</GroupLabel>
          {items.filter((i) => i.kind === "web").map((it) => (
            <Row key={it.key} item={it} active={it.key === selKey} onClick={() => setSelKey(it.key)} />
          ))}
          {appCount > 0 && <GroupLabel icon={<Smartphone className="h-3 w-3" />}>On the App Store</GroupLabel>}
          {items.filter((i) => i.kind === "app").map((it) => (
            <Row key={it.key} item={it} active={it.key === selKey} onClick={() => setSelKey(it.key)} />
          ))}
        </div>
      </div>

      {/* RIGHT — the detail. Keyed entrance-only swap (D-016): exactly one mounts. */}
      <div id="work-detail" className="order-1 h-[64vh] max-h-[620px] min-w-0 lg:order-2 lg:h-[76vh] lg:max-h-[760px]">
        {sel && (
          <motion.div key={sel.key} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="h-full">
            {sel.kind === "web" ? <WebDetail item={sel} /> : <AppDetail item={sel} />}
          </motion.div>
        )}
      </div>
    </div>
  );
}

function GroupLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="hidden items-center gap-1.5 px-1 pb-0.5 pt-2 text-[10px] font-semibold uppercase tracking-widest text-white/30 lg:flex">
      {icon} {children}
    </p>
  );
}

function Row({ item, active, onClick }: { item: Item; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} data-key={item.key} className={`flex w-[236px] shrink-0 items-center gap-3 rounded-xl border p-2.5 text-left transition lg:w-full ${active ? "border-white/25 bg-white/[0.06]" : "border-line hover:border-white/15 hover:bg-white/[0.03]"}`}>
      <img src={item.icon} alt="" loading="lazy" decoding="async" className="h-10 w-10 shrink-0 rounded-[11px] ring-1 ring-white/10" draggable={false} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-white/90">{item.name}</span>
        <span className="block truncate text-[11px] text-white/45">{item.kind === "web" ? item.host : item.genre}</span>
      </span>
      {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: item.accent }} />}
    </button>
  );
}

/* ---------------- web detail: the live, embedded site ---------------- */
function WebDetail({ item }: { item: Extract<Item, { kind: "web" }> }) {
  const [load, setLoad] = useState(false);
  useEffect(() => {
    setLoad(false);
    const t = setTimeout(() => setLoad(true), 80);
    return () => clearTimeout(t);
  }, [item.key]);

  return (
    <div className="flex h-full flex-col">
      <div className="group relative min-h-0 flex-1">
        <div className="pointer-events-none absolute -inset-3 rounded-3xl opacity-40 blur-2xl" style={{ background: `radial-gradient(55% 55% at 50% 40%, ${item.accent}22, transparent 70%)` }} />
        <div className="relative h-full">
          <BrowserChrome url={item.host}>
            {load && item.embed ? (
              <iframe src={item.url} title={item.name} loading="lazy" sandbox="allow-scripts allow-same-origin" className="h-[200%] w-[200%] origin-top-left scale-50 border-0 bg-white" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[#0c0c10]"><Loader2 className="h-5 w-5 animate-spin text-white/40" /></div>
            )}
          </BrowserChrome>
        </div>
      </div>
      <DetailBar accent={item.accent} badge="LIVE SITE" name={item.name} sub={item.tagline} url={item.url} cta="Open live"
        meta={<div className="mt-2 flex flex-wrap gap-1.5">{item.stack.map((t) => <span key={t} className="rounded-md bg-white/[0.05] px-2 py-0.5 text-[11px] text-white/50">{t}</span>)}</div>} />
    </div>
  );
}

/* ---------------- app detail: screenshot gallery, or icon hero ---------------- */
function AppDetail({ item }: { item: Extract<Item, { kind: "app" }> }) {
  const has = item.screenshots.length > 0;
  return (
    <div className="flex h-full flex-col">
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white/[0.04] to-transparent">
        <div className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(60% 45% at 50% 30%, ${item.accent}1f, transparent 70%)` }} />
        {has ? <PhoneCoverflow shots={item.screenshots} accent={item.accent} name={item.name} /> : <IconHero icon={item.icon} name={item.name} genre={item.genre} accent={item.accent} />}
      </div>
      <DetailBar accent={item.accent} badge="APP STORE" name={item.name} sub={item.note} url={item.url} cta="App Store"
        lead={<img src={item.icon} alt="" className="h-11 w-11 shrink-0 rounded-[12px] ring-1 ring-white/10" draggable={false} />} genre={item.genre} />
    </div>
  );
}

/** Shared info bar under the detail visual. */
function DetailBar({ accent, badge, name, sub, url, cta, meta, lead, genre }: { accent: string; badge: string; name: string; sub: string; url: string; cta: string; meta?: React.ReactNode; lead?: React.ReactNode; genre?: string }) {
  return (
    <div className="mt-4 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        {lead}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide" style={{ background: `${accent}22`, color: accent }}>{badge}</span>
            {genre && <span className="text-[11px] text-white/40">{genre}</span>}
          </div>
          <h3 className="mt-1.5 truncate text-lg font-semibold tracking-tight">{name}</h3>
          <p className="mt-1 max-w-lg text-[13.5px] leading-relaxed text-white/55">{sub}</p>
          {meta}
        </div>
      </div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white/90">{cta} <ArrowUpRight className="h-4 w-4" /></a>
    </div>
  );
}

const PHONE_H = "clamp(240px, 44vh, 440px)"; // detail-gallery phone height (width derived)

/** Coverflow of real phone screenshots — the spotted-in-prod gallery. */
function PhoneCoverflow({ shots, accent, name }: { shots: string[]; accent: string; name: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 py-5" style={{ perspective: 1600 }}>
      <div className="relative flex w-full flex-1 items-center justify-center">
        {shots.map((src, i) => {
          const off = i - active;
          const abs = Math.abs(off);
          // centering via a static CSS-transform wrapper; framer animates the inner
          // button's transform separately (no transform conflict — D-016)
          return (
            <div key={i} className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%, -50%)", zIndex: 20 - abs }}>
              <motion.button
                onClick={() => setActive(i)}
                aria-label={`Screen ${i + 1}`}
                className={abs > 2 ? "pointer-events-none block" : "block"}
                style={{ height: PHONE_H, width: `calc(${PHONE_H} * 9 / 19.5)`, cursor: off === 0 ? "default" : "pointer" }}
                initial={false}
                animate={{ x: off * 128, rotateY: off * -26, scale: off === 0 ? 1 : 0.82, opacity: abs > 2 ? 0 : 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 30 }}
              >
                <ShotFrame src={src} accent={accent} active={off === 0} alt={`${name} — screen ${i + 1}`} />
              </motion.button>
            </div>
          );
        })}
      </div>
      <div className="flex shrink-0 gap-1.5">
        {shots.map((_, i) => (
          <button key={i} onClick={() => setActive(i)} aria-label={`Go to screen ${i + 1}`} className="h-1.5 rounded-full transition-all" style={{ width: i === active ? 20 : 6, background: i === active ? accent : "rgba(255,255,255,0.22)" }} />
        ))}
      </div>
    </div>
  );
}

/** A clean device bezel around a screenshot (no status overlay — screenshots vary). */
function ShotFrame({ src, accent, active, alt = "" }: { src: string | null; accent: string; active: boolean; alt?: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] bg-black" style={{ boxShadow: active ? `0 30px 80px -22px ${accent}66` : "0 24px 60px -24px rgba(0,0,0,0.85)" }}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" draggable={false} className="h-full w-full object-cover" />
      ) : (
        <div className="h-full w-full bg-[linear-gradient(160deg,#1a1a20,#0c0c10)]" />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] ring-[3px] ring-inset ring-white/10" />
    </div>
  );
}

/** For apps the App Store doesn't expose screenshots for — a designed icon hero. */
function IconHero({ icon, name, genre, accent }: { icon: string; name: string; genre: string; accent: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5 p-6 text-center">
      <motion.img src={icon} alt="" draggable={false} initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="h-28 w-28 rounded-[1.7rem] ring-1 ring-white/15" style={{ boxShadow: `0 34px 80px -22px ${accent}77` }} />
      <div>
        <p className="text-base font-semibold tracking-tight">{name}</p>
        <p className="mt-1 text-[12px] text-white/45">{genre} · live on the App Store</p>
      </div>
    </div>
  );
}

/* ================= HeroShow — the cinema (D-021) ================= */
/* An auto-running premiere reel of everything we've shipped. One product in
 * focus at a time, neighbours receding into the wings; hover a wing to pull it
 * into focus, click to open it in the showcase below. All cards stay mounted —
 * only spring transforms animate (no AnimatePresence, per D-016/D-020). */

const SHOW_MS = 2400; // fast enough to read as alive before the user scrolls on (D-023)
const POSTER_H = "clamp(280px, 40vh, 400px)";

export function HeroShow({ apps }: { apps: ShippedApp[] }) {
  const items = useShowcaseItems(apps);
  const reduce = useReducedMotion();
  const n = items.length;

  const [focus, setFocus] = useState(0);
  const [hovering, setHovering] = useState(false);
  const dwell = useRef<number | null>(null); // wing-hover intent timer (D-022)
  const playing = !reduce && !hovering && n > 1;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setFocus((f) => (f + 1) % n), SHOW_MS);
    return () => clearInterval(id);
  }, [playing, n]);
  useEffect(() => () => { if (dwell.current) clearTimeout(dwell.current); }, []);

  const open = (it: Item, idx: number) => {
    if (idx !== focus) { setFocus(idx); return; } // wings: first tap/click focuses
    window.dispatchEvent(new CustomEvent(SHOWCASE_SELECT_EVENT, { detail: it.key }));
    // land with the live view centered on screen — no post-click hunting (D-022)
    (document.getElementById("work-detail") ?? document.getElementById("work"))?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
  };

  if (n === 0) return null;
  const focused = items[focus];

  return (
    <div
      className="relative mx-auto w-full max-w-[520px] select-none overflow-x-clip"
      /* mouse-only: a touch-scroll past the reel must never freeze the show (D-022) */
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setHovering(true); }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setHovering(false); }}
      onPointerCancel={() => setHovering(false)}
    >
      {/* the strip */}
      <div className="relative h-[320px] sm:h-[430px]" style={{ perspective: 1400 }}>
        {items.map((it, i) => {
          // signed circular offset → infinite-loop feel
          let off = (((i - focus) % n) + n) % n;
          if (off > n / 2) off -= n;
          const abs = Math.abs(off);
          const visible = abs <= 2;
          return (
            <div key={it.key} className="absolute left-1/2 top-1/2" style={{ zIndex: 20 - abs, transform: "translate(-50%, -50%)" }}>
              <motion.button
                aria-label={off === 0 ? `Open ${it.name} in the showcase` : `Focus ${it.name}`}
                onClick={() => open(it, i)}
                /* dwell 300ms before a wing steals focus — a sweep across the strip
                   must not machine-gun the show (hover intent, D-022) */
                onPointerEnter={(e) => {
                  if (e.pointerType !== "mouse" || off === 0 || !visible) return;
                  if (dwell.current) clearTimeout(dwell.current);
                  dwell.current = window.setTimeout(() => setFocus(i), 300);
                }}
                onPointerLeave={() => { if (dwell.current) { clearTimeout(dwell.current); dwell.current = null; } }}
                className={visible ? "block" : "pointer-events-none block"}
                style={{ height: POSTER_H, width: `calc(${POSTER_H} * 0.62)`, cursor: "pointer" }}
                initial={false}
                animate={{ x: off * 118, rotateY: off * -24, scale: off === 0 ? 1 : abs === 1 ? 0.8 : 0.65, opacity: visible ? (off === 0 ? 1 : 0.55) : 0 }}
                transition={{ type: "spring", stiffness: 280, damping: 30 }}
              >
                <ShowPoster item={it} focused={off === 0} />
              </motion.button>
            </div>
          );
        })}
      </div>

      {/* marquee caption + progress */}
      <div className="mt-4 flex items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold tracking-tight">{focused.name}</p>
          <p className="text-[11px] text-white/45">{focused.kind === "web" ? `Live site · ${(focused as Extract<Item, { kind: "web" }>).host}` : `App Store · ${(focused as Extract<Item, { kind: "app" }>).genre}`}</p>
        </div>
        <button onClick={() => open(focused, focus)} className="inline-flex shrink-0 items-center gap-1 rounded-full border border-line px-3 py-1.5 text-[11.5px] text-white/70 transition hover:border-white/30 hover:text-white">
          Open <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
      <div className="mt-2.5 flex items-center gap-1">
        {items.map((_, i) => (
          <button key={i} onClick={() => setFocus(i)} aria-label={`Show ${items[i].name}`} className="relative h-2 flex-1 overflow-hidden">
            <span className="absolute inset-x-0 top-[3px] h-[2px] rounded-full bg-white/12" />
            {i === focus && playing && (
              <motion.span key={`p-${focus}`} className="absolute left-0 top-[3px] h-[2px] rounded-full" style={{ background: focused.accent }} initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: SHOW_MS / 1000, ease: "linear" }} />
            )}
            {i === focus && !playing && <span className="absolute left-0 top-[3px] h-[2px] w-full rounded-full" style={{ background: focused.accent }} />}
            {i < focus && <span className="absolute left-0 top-[3px] h-[2px] w-full rounded-full bg-white/25" />}
          </button>
        ))}
      </div>
    </div>
  );
}

/** A uniform cinema poster for any product. Apps always show their icon (one
 *  consistent visual grammar across the reel — screenshots live in the showcase
 *  galleries below, D-022); webs get a designed mini-site card. */
function ShowPoster({ item, focused }: { item: Item; focused: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#101014]" style={{ boxShadow: focused ? `0 30px 80px -22px ${item.accent}59` : "0 22px 55px -24px rgba(0,0,0,0.85)" }}>
      {item.kind === "app" ? (
        <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(165deg, ${item.accent}26, #0b0b0e 64%)` }}>
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3 text-center">
            <img src={item.icon} alt="" decoding="async" draggable={false} className="h-20 w-20 rounded-[1.2rem] ring-1 ring-white/15" style={{ boxShadow: `0 20px 50px -14px ${item.accent}66` }} />
            <div>
              <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-white/90">{item.name}</p>
              <p className="mt-1 text-[9.5px] uppercase tracking-widest text-white/40">{item.genre}</p>
            </div>
          </div>
          <div className="flex justify-center pb-4">
            <span className="rounded-full border border-white/15 px-2.5 py-1 text-[8.5px] font-semibold tracking-wide text-white/55">APP STORE</span>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 flex flex-col" style={{ background: `linear-gradient(165deg, ${item.accent}30, #0b0b0e 62%)` }}>
          <div className="flex items-center gap-1 p-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white/25" /><span className="h-1.5 w-1.5 rounded-full bg-white/25" /><span className="h-1.5 w-1.5 rounded-full bg-white/25" />
            <span className="ml-2 h-1.5 flex-1 rounded-full bg-white/[0.07]" />
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-2 px-3 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-bold" style={{ background: `${item.accent}26`, color: item.accent }}>{item.name[0]}</span>
            <p className="text-[13px] font-semibold text-white/90">{item.name}</p>
            <p className="font-mono text-[9.5px] text-white/40">{item.host}</p>
          </div>
          <div className="space-y-1.5 p-4">
            <span className="block h-1.5 w-3/4 rounded-full bg-white/[0.09]" />
            <span className="block h-1.5 w-1/2 rounded-full bg-white/[0.06]" />
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
    </div>
  );
}
