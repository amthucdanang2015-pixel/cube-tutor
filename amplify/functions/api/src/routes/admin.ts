import { ok } from "../lib/response";
import { forbidden } from "../lib/errors";
import { env } from "../lib/env";
import { queryGsi, put } from "../services/dynamo";
import { SEED } from "../seed/seedData";
import type { RouteContext, RouteHandler } from "../lib/types";

/** Require a matching x-admin-key header. Never expose this key client-side. */
function requireAdmin(ctx: RouteContext) {
  const key = ctx.headers["x-admin-key"];
  if (!env.adminKey || key !== env.adminKey) throw forbidden("admin key required");
}

export const listLeads: RouteHandler = async (ctx) => {
  requireAdmin(ctx);
  const type = ctx.query.type ?? "contact";
  const items = await queryGsi({ index: "GSI1", pk: `LEADTYPE#${type}` });
  return ok({ leadType: type, count: items.length, items });
};

export const listAudits: RouteHandler = async (ctx) => {
  requireAdmin(ctx);
  const items = await queryGsi({ index: "GSI1", pk: "LEADTYPE#vibe-audit" });
  return ok({ count: items.length, items });
};

export const listSubmissions: RouteHandler = async (ctx) => {
  requireAdmin(ctx);
  const items = await queryGsi({ index: "GSI1", pk: "STATUS#new" });
  return ok({ count: items.length, items: items.filter((i) => i.type === "SUBMISSION") });
};

/** Idempotent: writes representative content items so GET routes work. */
export const seed: RouteHandler = async (ctx) => {
  requireAdmin(ctx);
  let count = 0;
  for (const item of SEED) {
    await put(item);
    count++;
  }
  return ok({ ok: true, seeded: count });
};
