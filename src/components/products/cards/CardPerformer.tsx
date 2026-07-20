"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone, Globe } from "lucide-react";
import type { DesignSystem } from "@/data/designSystems";
import { gestureTransition, loopDuration } from "../engine/styleMotion";

/* ============================================================================
 * The Card product itself (D-021/D-023/D-028) — the thing on the stage and on
 * the live page, plus the two canvas exporters that render the same card to a
 * PNG sheet and a WebM spin.
 *
 * It consumes tokens ONLY: every colour, font, radius, border, shadow, icon
 * weight and timing comes from the resolved DesignSystem. Nothing here knows
 * that a style picker exists.
 * ==========================================================================*/

export type Layout = "classic" | "centered" | "split";
export type Mode = "turntable" | "float" | "manual";

export const LAYOUTS: { id: Layout; name: string }[] = [{ id: "classic", name: "Classic" }, { id: "centered", name: "Centered" }, { id: "split", name: "Split" }];
export const MODES: { id: Mode; name: string; hint: string }[] = [
  { id: "turntable", name: "Turntable", hint: "auto-rotates, shows both sides" },
  { id: "float", name: "Float", hint: "hovers gently, click to flip" },
  { id: "manual", name: "Manual", hint: "still, click to flip" },
];

export interface CardData { name: string; title: string; company: string; email: string; phone: string; site: string }
export const CARD_DEFAULTS: CardData = { name: "Nam Nguyen", title: "Founder · Design Engineer", company: "TasteLoop", email: "mailnamnv@gmail.com", phone: "", site: "" };

/**
 * The performing card — spin/float/manual poses around the two faces.
 * Shared by the Studio stage and the Live page (one implementation, D-023).
 * `replayKey` remounts the turntable so a facet change re-performs (D-014).
 */
export function CardPerformer({ ds, accent, layout, mode, data, rot, onFlip, width = "min(480px, 84vw)", replayKey = "" }: { ds: DesignSystem; accent: string; layout: Layout; mode: Mode; data: CardData; rot: number; onFlip?: () => void; width?: string; replayKey?: string | number }) {
  const reduce = useReducedMotion();
  const spinning = mode === "turntable" && !reduce;
  return (
    // w-full: the card's `width` may be a percentage, so this must have a width
    // to resolve against (a shrink-to-fit wrapper would collapse it to zero).
    <div className="flex w-full items-center justify-center" style={{ perspective: 1600 }}>
      {spinning ? (
        <motion.div key={`spin-${replayKey}`} className="relative" style={{ width, aspectRatio: "1.75", transformStyle: "preserve-3d" }}
          initial={{ rotateY: 0 }} animate={{ rotateY: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: loopDuration(ds) }}>
          <CardFace ds={ds} accent={accent} side="front" layout={layout} data={data} />
          <CardFace ds={ds} accent={accent} side="back" layout={layout} data={data} />
        </motion.div>
      ) : (
        // showcase mode passes no onFlip: don't advertise a click that does nothing
        <motion.div key="pose" className={`relative ${onFlip ? "cursor-pointer" : ""}`} style={{ width, aspectRatio: "1.75", transformStyle: "preserve-3d" }}
          animate={{ rotateY: rot, y: mode === "float" && !reduce ? [0, -10, 0] : 0, rotateX: mode === "float" && !reduce ? [2.5, -2.5, 2.5] : 0 }}
          transition={{ rotateY: reduce ? { duration: 0 } : gestureTransition(ds), y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, rotateX: { duration: 7.5, repeat: Infinity, ease: "easeInOut" } }}
          onClick={onFlip}
          onKeyDown={onFlip ? (e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onFlip(); }
          } : undefined}
          role={onFlip ? "button" : undefined}
          tabIndex={onFlip ? 0 : undefined}
          aria-label={onFlip ? "Flip the card" : undefined}>
          <CardFace ds={ds} accent={accent} side="front" layout={layout} data={data} />
          <CardFace ds={ds} accent={accent} side="back" layout={layout} data={data} />
        </motion.div>
      )}
    </div>
  );
}

/** PNG sheet (front + back) — shared exporter. */
export async function exportCardPng(ds: DesignSystem, accent: string, layout: Layout, data: CardData) {
  const W = 1050, H = 600, PAD = 50;
  const c = document.createElement("canvas"); c.width = W + PAD * 2; c.height = H * 2 + PAD * 3;
  const ctx = c.getContext("2d")!;
  ctx.translate(PAD, PAD); drawFace(ctx, ds, accent, "front", layout, data);
  ctx.setTransform(1, 0, 0, 1, PAD, H + PAD * 2); drawFace(ctx, ds, accent, "back", layout, data);
  const blob = await new Promise<Blob | null>((r) => c.toBlob(r, "image/png"));
  if (blob) dl(blob, `card-${ds.slug}.png`);
}

/** WebM turntable spin — shared exporter. */
export async function exportCardVideo(ds: DesignSystem, accent: string, layout: Layout, data: CardData) {
  const W = 1050, H = 600;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d")!;
  const stream = c.captureStream(30);
  const mime = MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" : "video/webm";
  const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const done = new Promise<void>((r) => { rec.onstop = () => r(); });
  rec.start();
  const DUR = 3600, t0 = performance.now();
  await new Promise<void>((resolve) => {
    const frame = (now: number) => {
      const p = Math.min(1, (now - t0) / DUR);
      const cos = Math.cos(p * Math.PI * 2);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = "#0a0a0b"; ctx.fillRect(0, 0, W, H);
      ctx.translate(W / 2, H / 2); ctx.scale(Math.max(Math.abs(cos), 0.04) * 0.86, 0.86); ctx.translate(-W / 2, -H / 2);
      drawFace(ctx, ds, accent, cos >= 0 ? "front" : "back", layout, data);
      ctx.fillStyle = `rgba(0,0,0,${(1 - Math.abs(cos)) * 0.35})`; ctx.fillRect(0, 0, W, H);
      if (p < 1) requestAnimationFrame(frame); else resolve();
    };
    requestAnimationFrame(frame);
  });
  setTimeout(() => rec.stop(), 150);
  await done;
  dl(new Blob(chunks, { type: "video/webm" }), `card-${ds.slug}.webm`);
}

/* ---------------- one side of the card, in three layouts ---------------- */
function CardFace({ ds, accent, side, layout, data }: { ds: DesignSystem; accent: string; side: "front" | "back"; layout: Layout; data: CardData }) {
  const t = ds.t;
  const reduce = useReducedMotion();
  const upper = t.upper ? ("uppercase" as const) : ("none" as const);
  const iconSw = ds.iconSw ?? 1.75; // the Icons facet, on a printed card
  const contacts = [
    { Icon: Mail, value: data.email },
    { Icon: Phone, value: data.phone },
    { Icon: Globe, value: data.site },
  ].filter(({ value }) => value.trim().length > 0);
  return (
    <div className="absolute inset-0 overflow-hidden"
      style={{ background: t.bg, color: t.text, fontFamily: t.font, border: `${t.borderW} solid ${t.border}`, borderRadius: t.radius === "0px" ? 6 : `max(${t.radius}, 8px)`, boxShadow: t.shadow === "none" ? "0 30px 70px -24px rgba(0,0,0,0.8)" : t.shadow, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: side === "back" ? "rotateY(180deg)" : undefined }}>
      <motion.div className="pointer-events-none absolute -left-[20%] -top-[45%] h-[130%] w-[65%] rounded-full blur-[46px]" style={{ background: accent, opacity: 0.2 }}
        animate={reduce ? {} : { x: [0, 26, -10, 0], y: [0, 14, -8, 0] }} transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="pointer-events-none absolute -bottom-[45%] -right-[15%] h-[110%] w-[55%] rounded-full blur-[50px]" style={{ background: accent, opacity: 0.12 }}
        animate={reduce ? {} : { x: [0, -20, 8, 0], y: [0, -12, 6, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />

      {side === "front" ? (
        layout === "classic" ? (
          <div className="relative flex h-full flex-col justify-between p-[7%]">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0" style={{ background: accent, borderRadius: t.ctlRadius === "0px" ? 0 : 99 }} />
              <span className="truncate tracking-wide" style={{ color: t.muted, textTransform: upper, letterSpacing: "0.08em", fontSize: "clamp(9px, 2.6cqw, 13px)" }}>{data.company || "Company"}</span>
            </div>
            <div>
              <p className="truncate leading-tight" style={{ fontWeight: t.headWeight, fontSize: "clamp(18px, 6.4cqw, 32px)", textTransform: upper, letterSpacing: t.upper ? "0.04em" : "-0.02em" }}>{data.name || "Your name"}</p>
              <p className="mt-1 truncate" style={{ color: t.muted, fontSize: "clamp(10px, 3cqw, 15px)" }}>{data.title || "Title"}</p>
            </div>
          </div>
        ) : layout === "centered" ? (
          <div className="relative flex h-full flex-col items-center justify-center gap-2 p-[7%] text-center">
            <span className="h-3 w-3" style={{ background: accent, borderRadius: t.ctlRadius === "0px" ? 0 : 99 }} />
            <p className="max-w-full truncate leading-tight" style={{ fontWeight: t.headWeight, fontSize: "clamp(18px, 6.2cqw, 30px)", textTransform: upper, letterSpacing: t.upper ? "0.04em" : "-0.02em" }}>{data.name || "Your name"}</p>
            <p className="max-w-full truncate" style={{ color: t.muted, fontSize: "clamp(10px, 3cqw, 14px)" }}>{data.title || "Title"}</p>
            <p className="mt-1 max-w-full truncate tracking-[0.14em]" style={{ color: t.muted, fontSize: "clamp(8px, 2.2cqw, 11px)", textTransform: "uppercase" }}>{data.company || "Company"}</p>
          </div>
        ) : (
          <div className="relative flex h-full">
            <div className="flex w-[30%] items-center justify-center" style={{ background: accent }}>
              <span className="text-center leading-none" style={{ color: t.accentText, fontWeight: 800, fontSize: "clamp(20px, 7cqw, 40px)" }}>{initials(data.name)}</span>
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between p-[6%]">
              <span className="truncate tracking-wide" style={{ color: t.muted, textTransform: upper, letterSpacing: "0.08em", fontSize: "clamp(9px, 2.4cqw, 12px)" }}>{data.company || "Company"}</span>
              <div>
                <p className="truncate leading-tight" style={{ fontWeight: t.headWeight, fontSize: "clamp(16px, 5.4cqw, 28px)", textTransform: upper }}>{data.name || "Your name"}</p>
                <p className="mt-1 truncate" style={{ color: t.muted, fontSize: "clamp(10px, 2.8cqw, 14px)" }}>{data.title || "Title"}</p>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className={`relative flex h-full items-center p-[7%] ${layout === "centered" ? "justify-center text-center" : ""}`}>
          <div className="min-w-0 space-y-[4.5%]">
            {contacts.map(({ Icon, value }) => (
              <p key={Icon.displayName ?? value} className="flex items-center gap-2 truncate" style={{ fontSize: "clamp(10px, 3cqw, 14px)" }}>
                <Icon className="h-[1em] w-[1em] shrink-0" strokeWidth={iconSw} style={{ color: accent }} />
                <span className="truncate">{value}</span>
              </p>
            ))}
          </div>
          {layout !== "centered" && (
            <span className="absolute bottom-[8%] right-[7%] flex h-[18%] items-center justify-center px-3 font-bold" style={{ background: accent, color: t.accentText, fontSize: "clamp(9px,2.6cqw,12px)", borderRadius: t.ctlRadius === "0px" ? 0 : t.ctlRadius === "999px" ? 99 : 6, textTransform: upper }}>
              {(data.company || "Logo").slice(0, 12)}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------------- canvas renderer (shared by PNG + video export) ---------------- */
function drawFace(ctx: CanvasRenderingContext2D, ds: DesignSystem, accent: string, side: "front" | "back", layout: Layout, data: CardData, W = 1050, H = 600) {
  const t = ds.t;
  const r = t.radius === "0px" ? 14 : Math.min(Math.max((parseInt(t.radius) || 12) * 2.2, 16), 64);
  ctx.save();
  rounded(ctx, 0, 0, W, H, r); ctx.clip();
  ctx.fillStyle = t.bg; ctx.fillRect(0, 0, W, H);
  blob(ctx, W * 0.1, H * 0.02, W * 0.42, accent, 0.2);
  blob(ctx, W * 0.9, H * 0.98, W * 0.38, accent, 0.12);
  const font = (w: number, s: number) => `${w} ${s}px ${t.font}`;
  const upperize = (s: string) => (t.upper ? s.toUpperCase() : s);
  if (side === "front") {
    if (layout === "classic") {
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(84, 86, 11, 0, 7); ctx.fill();
      ctx.fillStyle = t.muted; ctx.font = font(600, 24); ctx.fillText(upperize(data.company || "Company"), 112, 94);
      ctx.fillStyle = t.text; ctx.font = font(t.headWeight, 62); ctx.fillText(upperize(data.name || "Your name"), 76, H - 118);
      ctx.fillStyle = t.muted; ctx.font = font(400, 28); ctx.fillText(data.title || "Title", 76, H - 72);
    } else if (layout === "centered") {
      ctx.textAlign = "center";
      ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(W / 2, H / 2 - 96, 13, 0, 7); ctx.fill();
      ctx.fillStyle = t.text; ctx.font = font(t.headWeight, 58); ctx.fillText(upperize(data.name || "Your name"), W / 2, H / 2 - 6);
      ctx.fillStyle = t.muted; ctx.font = font(400, 27); ctx.fillText(data.title || "Title", W / 2, H / 2 + 40);
      ctx.font = font(600, 20); ctx.fillText((data.company || "Company").toUpperCase(), W / 2, H / 2 + 96);
      ctx.textAlign = "left";
    } else {
      ctx.fillStyle = accent; ctx.fillRect(0, 0, W * 0.3, H);
      ctx.fillStyle = t.accentText; ctx.font = font(800, 76); ctx.textAlign = "center"; ctx.fillText(initials(data.name), W * 0.15, H / 2 + 26); ctx.textAlign = "left";
      ctx.fillStyle = t.muted; ctx.font = font(600, 22); ctx.fillText(upperize(data.company || "Company"), W * 0.3 + 64, 96);
      ctx.fillStyle = t.text; ctx.font = font(t.headWeight, 54); ctx.fillText(upperize(data.name || "Your name"), W * 0.3 + 64, H - 116);
      ctx.fillStyle = t.muted; ctx.font = font(400, 26); ctx.fillText(data.title || "Title", W * 0.3 + 64, H - 72);
    }
  } else {
    const cx = layout === "centered" ? W / 2 : 96;
    if (layout === "centered") ctx.textAlign = "center";
    const lines = [data.email, data.phone, data.site].filter((value) => value.trim().length > 0);
    lines.forEach((v, i) => {
      const y = H / 2 + 10 - ((lines.length - 1) * 62) / 2 + i * 62;
      if (layout !== "centered") { ctx.fillStyle = accent; ctx.beginPath(); ctx.arc(cx - 26, y - 8, 6, 0, 7); ctx.fill(); }
      ctx.fillStyle = t.text; ctx.font = font(400, 27); ctx.fillText(v, cx, y);
    });
    ctx.textAlign = "left";
    if (layout !== "centered") {
      const label = (data.company || "Logo").slice(0, 12);
      ctx.font = font(700, 24);
      const w = ctx.measureText(t.upper ? label.toUpperCase() : label).width + 56;
      ctx.fillStyle = accent; rounded(ctx, W - w - 72, H - 132, w, 62, t.ctlRadius === "0px" ? 0 : t.ctlRadius === "999px" ? 31 : 12); ctx.fill();
      ctx.fillStyle = t.accentText; ctx.fillText(t.upper ? label.toUpperCase() : label, W - w - 72 + 28, H - 92);
    }
  }
  ctx.restore();
  ctx.save();
  rounded(ctx, 1, 1, W - 2, H - 2, r);
  ctx.strokeStyle = t.border; ctx.lineWidth = Math.max((parseInt(t.borderW) || 1) * 2, 2); ctx.stroke();
  ctx.restore();
}
function rounded(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function blob(ctx: CanvasRenderingContext2D, x: number, y: number, rad: number, color: string, alpha: number) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
  g.addColorStop(0, hexA(color, alpha)); g.addColorStop(1, hexA(color, 0));
  ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
}
function hexA(hex: string, a: number) {
  const m = /^#?([\da-f]{6})/i.exec(hex);
  if (!m) return hex;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
function initials(name: string) {
  return (name || "YN").split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}
function dl(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const el = document.createElement("a");
  el.href = url; el.download = filename; el.click();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
