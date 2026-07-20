import { NextResponse } from "next/server";
import { getShippedApps } from "@/lib/apps";

/** Cached proxy for the App Store catalogue (see lib/apps). Refreshes daily. */
export const revalidate = 86400;

export async function GET() {
  const apps = await getShippedApps();
  return NextResponse.json({ apps });
}
