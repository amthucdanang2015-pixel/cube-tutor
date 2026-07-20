import { NextResponse } from "next/server";

/**
 * Checkout session creator.
 *
 * Production: create a Stripe (or Lemon Squeezy) Checkout Session here and
 * return its hosted URL. The provider webhook then calls the Amplify Lambda
 * (/webhooks/stripe), which flips `member=true` on the User in DynamoDB.
 *
 * v1: if STRIPE_SECRET_KEY isn't set, return no URL — the client unlocks Pro
 * locally so the full loop is demoable without billing configured.
 */
export async function POST(req: Request) {
  let body: { plan?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* optional */
  }

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    return NextResponse.json({ ok: true, url: null, demo: true, plan: body.plan ?? "pro_monthly" });
  }

  // TODO when keys are set:
  // const stripe = new Stripe(key);
  // const session = await stripe.checkout.sessions.create({ ... });
  // return NextResponse.json({ ok: true, url: session.url });

  return NextResponse.json({ ok: true, url: null });
}
