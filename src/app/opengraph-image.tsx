import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TasteLoop — The difference is the loop.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", overflow: "hidden", padding: 78, background: "#0d0d0b", color: "#f2f0e8", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ position: "absolute", width: 430, height: 430, borderRadius: 999, right: -80, top: -140, border: "2px solid rgba(217,255,99,.28)", display: "flex" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: 999, right: 50, top: -10, border: "2px solid rgba(255,122,89,.25)", display: "flex" }} />
        <div style={{ position: "absolute", right: 258, top: 65, height: 280, width: 10, borderRadius: 99, background: "#f2f0e8", transform: "rotate(16deg)", display: "flex" }} />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 25, fontWeight: 800, letterSpacing: 2 }}>
            <span>TASTE</span><span style={{ color: "#d9ff63" }}>/</span><span>LOOP</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ maxWidth: 840, fontSize: 76, fontWeight: 700, letterSpacing: -3, lineHeight: 0.98, display: "flex" }}>The difference is the loop.</div>
            <div style={{ marginTop: 30, fontSize: 25, color: "rgba(242,240,232,.58)", display: "flex" }}>Human taste, built into every loop.</div>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "center", fontSize: 18, color: "rgba(242,240,232,.45)" }}>
            <span>Agents make.</span><span style={{ color: "#d9ff63" }}>Humans decide.</span><span>Reality corrects the loop.</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
