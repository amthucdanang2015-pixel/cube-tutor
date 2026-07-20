import type { Design, Layer, Relief, Treatment } from "./types";

type Ctx = CanvasRenderingContext2D;

/* ---------- seeded rng (matches generate.ts) ---------- */
function hash(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); }
  return h >>> 0;
}
function rngFrom(seed: string) {
  let a = hash(seed);
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

/* ---------- noise tile (cached) ---------- */
let noiseTile: HTMLCanvasElement | null = null;
function getNoise(): HTMLCanvasElement {
  if (noiseTile) return noiseTile;
  const c = document.createElement("canvas");
  c.width = c.height = 180;
  const x = c.getContext("2d")!;
  const img = x.createImageData(c.width, c.height);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  noiseTile = c;
  return c;
}

/* ---------- hue rotation ---------- */
function rotateHue(hex: string, deg: number): string {
  if (!deg) return hex;
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16) / 255, g = parseInt(m.slice(2, 4), 16) / 255, b = parseInt(m.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b); let h = 0; const l = (max + min) / 2; const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d !== 0) { if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  h = (h + deg + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), mm = l - c / 2;
  let rr = 0, gg = 0, bb = 0;
  if (h < 60) [rr, gg, bb] = [c, x, 0]; else if (h < 120) [rr, gg, bb] = [x, c, 0]; else if (h < 180) [rr, gg, bb] = [0, c, x];
  else if (h < 240) [rr, gg, bb] = [0, x, c]; else if (h < 300) [rr, gg, bb] = [x, 0, c]; else [rr, gg, bb] = [c, 0, x];
  const hx = (v: number) => Math.round((v + mm) * 255).toString(16).padStart(2, "0");
  return `#${hx(rr)}${hx(gg)}${hx(bb)}`;
}

/* ---------- colour field ---------- */
function colorField(ctx: Ctx, layer: Layer, W: number, H: number, hue: number): CanvasGradient {
  const { angle } = layer.palette;
  const colors = hue ? layer.palette.colors.map((c) => rotateHue(c, hue)) : layer.palette.colors;
  const cx = W / 2, cy = H / 2, R = Math.min(W, H) / 2;
  let g: CanvasGradient;
  if (layer.layout === "orbit" && typeof ctx.createConicGradient === "function") {
    g = ctx.createConicGradient((layer.shape.rotation * Math.PI) / 180, cx, cy);
  } else if (layer.layout === "radial") {
    g = ctx.createRadialGradient(cx, cy, R * layer.shape.inner, cx, cy, R);
  } else {
    const a = (angle * Math.PI) / 180;
    const dx = Math.cos(a) * W, dy = Math.sin(a) * H;
    g = ctx.createLinearGradient(cx - dx / 2, cy - dy / 2, cx + dx / 2, cy + dy / 2);
  }
  const stops = colors.length;
  colors.forEach((c, i) => g.addColorStop(stops > 1 ? i / (stops - 1) : 0, c));
  if (layer.layout === "orbit") g.addColorStop(1, colors[0]); // seamless wrap
  return g;
}

/* ---------- relief helpers ---------- */
function applyDepth(ctx: Ctx, depth: number, minDim: number) {
  if (depth <= 0.01) return;
  ctx.shadowColor = `rgba(0,0,0,${0.55 * depth})`;
  ctx.shadowBlur = depth * minDim * 0.05;
  ctx.shadowOffsetX = depth * minDim * 0.012;
  ctx.shadowOffsetY = depth * minDim * 0.02;
}
function clearShadow(ctx: Ctx) { ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }

/* ---------- per-layout drawing ---------- */
function drawLayer(ctx: Ctx, layer: Layer, relief: Relief, W: number, H: number, hue: number) {
  const { shape } = layer;
  const minDim = Math.min(W, H);
  const cx = W / 2, cy = H / 2;
  const field = colorField(ctx, layer, W, H, hue);
  const rng = rngFrom(layer.layout + shape.count + shape.rotation.toFixed(2));

  const fillEl = (path: () => void, shade?: (p: () => void) => void) => {
    ctx.save();
    applyDepth(ctx, relief.depth, minDim);
    ctx.fillStyle = field;
    path(); ctx.fill();
    clearShadow(ctx);
    // top shadow (lighting) clipped to element
    if (relief.topShadow > 0.02 && shade) { ctx.save(); path(); ctx.clip(); shade(path); ctx.restore(); }
    if (relief.seam > 0.005) { ctx.lineWidth = Math.max(1, relief.seam * minDim * 0.25); ctx.strokeStyle = `rgba(0,0,0,${Math.min(1, relief.seam * 9)})`; path(); ctx.stroke(); }
    ctx.restore();
  };

  if (layer.layout === "linear") {
    const n = shape.count;
    const gap = shape.margin * (W / n);
    const bw = (W - gap * (n - 1)) / n;
    for (let i = 0; i < n; i++) {
      const x = i * (bw + gap);
      const hh = H * (0.35 + (1 - 0.35) * (0.5 + 0.5 * Math.sin(i * 1.7) * (1 - shape.jitter) + (rng() - 0.5) * shape.jitter));
      const y = H - hh;
      fillEl(
        () => { ctx.beginPath(); ctx.rect(x, y, bw, hh); },
        () => { const g = ctx.createLinearGradient(0, y, 0, H); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${relief.topShadow * 0.85})`); ctx.fillStyle = g; ctx.fillRect(x, y, bw, hh); },
      );
    }
    return;
  }

  // radial + orbit (annulus bands)
  const R = minDim / 2 * 0.96;
  const inner = R * shape.inner;
  const total = R - inner;
  const isOrbit = layer.layout === "orbit";
  const start = (shape.rotation * Math.PI) / 180;
  const span = isOrbit ? shape.spread * Math.PI * 2 : Math.PI * 2;
  const n = shape.count;
  // jittered band weights
  const weights = Array.from({ length: n }, () => 1 + (rng() - 0.5) * shape.jitter * 1.4);
  const wsum = weights.reduce((a, b) => a + b, 0);
  const gapR = shape.margin * (total / n);
  let r0 = inner;
  for (let i = 0; i < n; i++) {
    const bw = ((total - gapR * (n - 1)) * weights[i]) / wsum;
    const r1 = r0 + bw;
    const segs = isOrbit ? Math.max(1, shape.segments) : (shape.segments > 3 ? shape.segments * 2 : 1);
    const segGap = segs > 1 ? span * 0.02 : 0;
    const segSpan = (span - segGap * (segs - 1)) / segs;
    for (let s = 0; s < segs; s++) {
      const a0 = start + s * (segSpan + segGap);
      const a1 = a0 + segSpan;
      const rr1 = r1 - (segs > 1 ? rng() * shape.jitter * bw * 0.5 : 0); // stepped radius
      fillEl(
        () => { ctx.beginPath(); ctx.arc(cx, cy, rr1, a0, a1); ctx.arc(cx, cy, r0, a1, a0, true); ctx.closePath(); },
        () => { const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, rr1); g.addColorStop(0, `rgba(0,0,0,${relief.topShadow * 0.7})`); g.addColorStop(0.5, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${relief.topShadow * 0.85})`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, rr1, a0, a1); ctx.arc(cx, cy, r0, a1, a0, true); ctx.closePath(); ctx.fill(); },
      );
    }
    r0 = r1 + gapR;
  }
}

/* ---------- post effects (all drawImage/pattern based — fast at any res) ---------- */
function applyGrain(ctx: Ctx, W: number, H: number, alpha: number) {
  if (alpha <= 0.01) return;
  const pat = ctx.createPattern(getNoise(), "repeat");
  if (!pat) return;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = "overlay";
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
function applyEffect(ctx: Ctx, t: Treatment, W: number, H: number) {
  const k = t.intensity;
  if (t.effect === "grain") return applyGrain(ctx, W, H, 0.25 + k * 0.6);
  if (t.effect === "scanlines") {
    ctx.save(); ctx.globalAlpha = 0.15 + k * 0.5; ctx.fillStyle = "#000";
    const step = Math.max(2, t.scale);
    for (let y = 0; y < H; y += step) ctx.fillRect(0, y, W, Math.max(1, step * 0.45));
    ctx.restore();
  }
  if (t.effect === "chromatic") {
    const snap = document.createElement("canvas"); snap.width = W; snap.height = H;
    snap.getContext("2d")!.drawImage(ctx.canvas, 0, 0);
    const dx = Math.round((2 + k * 14));
    const tint = (color: string, off: number) => {
      const tc = document.createElement("canvas"); tc.width = W; tc.height = H;
      const x = tc.getContext("2d")!; x.drawImage(snap, 0, 0); x.globalCompositeOperation = "multiply"; x.fillStyle = color; x.fillRect(0, 0, W, H);
      ctx.save(); ctx.globalCompositeOperation = "screen"; ctx.drawImage(tc, off, 0); ctx.restore();
    };
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H); ctx.restore();
    tint("#ff0000", -dx); tint("#00ff00", 0); tint("#0000ff", dx);
  }
  if (t.effect === "halftone") {
    ctx.save(); ctx.globalCompositeOperation = "multiply"; ctx.globalAlpha = 0.2 + k * 0.55;
    const c = Math.max(3, t.scale * 1.6);
    for (let y = 0; y < H; y += c) for (let x = 0; x < W; x += c) { ctx.beginPath(); ctx.arc(x + c / 2, y + c / 2, c * 0.32, 0, Math.PI * 2); ctx.fillStyle = "#000"; ctx.fill(); }
    ctx.restore();
  }
  if (t.effect === "dither") {
    ctx.save(); ctx.globalCompositeOperation = "overlay"; ctx.globalAlpha = 0.3 + k * 0.5;
    const c = Math.max(2, t.scale);
    for (let y = 0; y < H; y += c) for (let x = 0; x < W; x += c) { if (((x / c) + (y / c)) % 2 === 0) { ctx.fillStyle = "#fff"; ctx.fillRect(x, y, c * 0.5, c * 0.5); ctx.fillStyle = "#000"; ctx.fillRect(x + c * 0.5, y + c * 0.5, c * 0.5, c * 0.5); } }
    ctx.restore();
  }
}

function applyGlow(ctx: Ctx, W: number, H: number, amount: number) {
  if (amount <= 0.01) return;
  const snap = document.createElement("canvas"); snap.width = W; snap.height = H;
  snap.getContext("2d")!.drawImage(ctx.canvas, 0, 0);
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = Math.min(1, amount);
  ctx.filter = `blur(${Math.max(2, (amount * Math.min(W, H)) / 28)}px)`;
  ctx.drawImage(snap, 0, 0);
  ctx.restore();
}
function applyVignette(ctx: Ctx, W: number, H: number, amount: number) {
  if (amount <= 0.01) return;
  const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.32, W / 2, H / 2, Math.max(W, H) * 0.72);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, `rgba(0,0,0,${Math.min(0.92, amount)})`);
  ctx.save(); ctx.globalCompositeOperation = "source-over"; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore();
}

/* ---------- main render ---------- */
export function render(ctx: Ctx, design: Design, W: number, H: number) {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  if (design.bgGradient) {
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, design.background); bg.addColorStop(1, design.background2);
    ctx.fillStyle = bg;
  } else {
    ctx.fillStyle = design.background;
  }
  ctx.fillRect(0, 0, W, H);

  const tr = design.transform;
  ctx.save();
  ctx.translate(W / 2 + tr.x * W, H / 2 + tr.y * H);
  ctx.rotate((tr.rotate * Math.PI) / 180);
  ctx.scale(tr.scale, tr.scale);
  ctx.translate(-W / 2, -H / 2);
  design.layers.forEach((layer) => {
    if (!layer.visible) return;
    ctx.save();
    ctx.globalCompositeOperation = (layer.blend === "normal" ? "source-over" : layer.blend) as GlobalCompositeOperation;
    ctx.globalAlpha = layer.opacity;
    drawLayer(ctx, layer, design.relief, W, H, tr.hue);
    ctx.restore();
  });
  ctx.restore();

  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  applyGlow(ctx, W, H, design.glow);
  applyGrain(ctx, W, H, design.relief.grain * 0.5);
  if (design.treatment.effect !== "none") applyEffect(ctx, design.treatment, W, H);
  applyVignette(ctx, W, H, design.vignette);
  ctx.restore();
}

/** Render to a detached canvas (for export + history thumbnails). */
export function renderToCanvas(design: Design, W: number, H: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  render(c.getContext("2d")!, design, W, H);
  return c;
}
