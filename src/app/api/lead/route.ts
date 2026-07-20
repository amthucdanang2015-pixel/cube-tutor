import { NextResponse } from "next/server";

/**
 * Lead capture. In v1 this just acknowledges and (optionally) forwards to the
 * Amplify REST endpoint if configured. Wire NEXT_PUBLIC nothing here — keep the
 * backend URL + any secret server-side via env when you deploy.
 *
 * Production path: POST -> Amplify Lambda router (/leads) -> DynamoDB Lead table
 * -> trigger Resend/Loops welcome drip.
 */
export async function POST(req: Request) {
  let body: { email?: string; source?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 422 });
  }

  const endpoint = process.env.API_BASE_URL;
  if (endpoint) {
    try {
      await fetch(`${endpoint}/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: body.source ?? "web", ts: Date.now() }),
      });
    } catch {
      /* don't block the user if the backend hiccups */
    }
  } else {
    console.log(`[lead] ${email} (${body.source ?? "web"})`);
  }

  return NextResponse.json({ ok: true });
}
