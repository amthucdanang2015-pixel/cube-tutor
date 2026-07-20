import { NextResponse } from "next/server";

const ALLOWED = new Set([
  "taste-review", "first-loop", "product-loop",
  "newsletter", "contact", "service-inquiry", "reference",
  // Compatibility with old, redirected forms until those implementations retire.
  "screen-rescue", "product-rescue", "vibe-audit", "sprint", "rescue", "retainer", "pro-waitlist",
]);

const MAX_FIELDS = 20;
const MAX_FIELD_LENGTH = 5000;

export async function POST(request: Request) {
  let body: { leadType?: string; fields?: Record<string, unknown>; hp?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  if (body.hp) return NextResponse.json({ ok: true });

  const leadType = (body.leadType || "").trim();
  if (!ALLOWED.has(leadType)) return NextResponse.json({ ok: false, error: "invalid_lead_type" }, { status: 422 });

  const rawFields = body.fields && typeof body.fields === "object" && !Array.isArray(body.fields) ? body.fields : {};
  const entries = Object.entries(rawFields);
  if (entries.length === 0 || entries.length > MAX_FIELDS) return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 422 });
  if (entries.some(([key, value]) => key.length > 80 || typeof value !== "string" || value.length > MAX_FIELD_LENGTH)) {
    return NextResponse.json({ ok: false, error: "invalid_fields" }, { status: 422 });
  }

  const fields = Object.fromEntries(entries) as Record<string, string>;
  if (!Object.values(fields).some((value) => value.trim().length > 1)) return NextResponse.json({ ok: false, error: "empty_submission" }, { status: 422 });
  const email = (fields.email || "").trim().toLowerCase();
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });

  const endpoint = process.env.API_BASE_URL?.replace(/\/$/, "");
  if (!endpoint) {
    return NextResponse.json({ ok: false, error: "lead_capture_unconfigured" }, { status: 503 });
  }

  try {
    const upstream = await fetch(`${endpoint}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadType, fields, source: "tasteloop-web", ts: Date.now() }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    const result = await upstream.json().catch(() => null) as { ok?: boolean } | null;
    if (!upstream.ok || result?.ok !== true) return NextResponse.json({ ok: false, error: "lead_backend_rejected" }, { status: 502 });
  } catch {
    return NextResponse.json({ ok: false, error: "lead_backend_unavailable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
