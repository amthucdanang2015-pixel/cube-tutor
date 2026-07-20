import { ok } from "../lib/response";
import { put } from "../services/dynamo";
import { email as validateEmail, notEmpty } from "../services/validation";
import { newId, now } from "../services/slug";
import type { Entity, RouteHandler } from "../lib/types";

const LEAD_TYPES = new Set([
  "taste-review", "first-loop", "product-loop",
  "newsletter", "contact", "service-inquiry", "reference",
  "screen-rescue", "product-rescue", "vibe-audit", "sprint", "rescue", "retainer", "pro-waitlist",
]);

/**
 * Generic lead capture. Body: { leadType, fields }.
 * Stores LEAD#<id> with GSI1 = LEADTYPE#<type> for admin listing by type.
 * vibe-audit also doubles as the AUDIT entity (status pipeline) via GSI2.
 */
export const createLead: RouteHandler = async (ctx) => {
  const leadType = (typeof ctx.body.leadType === "string" ? ctx.body.leadType : ctx.params.type || "contact").trim();
  if (!LEAD_TYPES.has(leadType)) return ok({ ok: false, error: "invalid_lead_type" });

  const fields = (ctx.body.fields as Record<string, unknown>) ?? {};
  notEmpty(fields);
  const entries = Object.entries(fields);
  if (entries.length > 20 || entries.some(([key, value]) => key.length > 80 || typeof value !== "string" || value.length > 5000)) {
    return ok({ ok: false, error: "invalid_fields" });
  }
  if ("email" in fields) validateEmail({ email: String(fields.email ?? "") });

  const id = newId();
  const ts = now();
  const isAudit = leadType === "vibe-audit";
  const item: Entity = {
    PK: `LEAD#${id}`,
    SK: "META",
    GSI1PK: `LEADTYPE#${leadType}`,
    GSI1SK: `${ts}#${id}`,
    ...(isAudit ? { GSI2PK: "STATUS#new", GSI2SK: `${ts}#${id}` } : {}),
    id,
    type: isAudit ? "AUDIT" : "LEAD",
    leadType,
    status: "new",
    fields,
    source: typeof ctx.body.source === "string" ? ctx.body.source : "web",
    createdAt: ts,
    updatedAt: ts,
  };
  await put(item);
  return ok({ ok: true, id });
};

/** Pro waitlist: WAITLIST#<email>, idempotent by email. */
export const joinWaitlist: RouteHandler = async (ctx) => {
  const fields = (ctx.body.fields as Record<string, unknown>) ?? ctx.body;
  const e = validateEmail({ email: String(fields.email ?? ctx.body.email ?? "") });
  const ts = now();
  await put({
    PK: `WAITLIST#${e}`,
    SK: "META",
    GSI1PK: "WAITLIST#PRO",
    GSI1SK: `${ts}#${e}`,
    id: e,
    type: "WAITLIST",
    email: e,
    status: "waiting",
    createdAt: ts,
    updatedAt: ts,
  });
  return ok({ ok: true });
};

/** Reference/pattern submission: SUBMISSION#<id>, status pipeline. */
export const submitReference: RouteHandler = async (ctx) => {
  const fields = (ctx.body.fields as Record<string, unknown>) ?? {};
  notEmpty(fields);
  const id = newId();
  const ts = now();
  await put({
    PK: `SUBMISSION#${id}`,
    SK: "META",
    GSI1PK: "STATUS#new",
    GSI1SK: `${ts}#${id}`,
    id,
    type: "SUBMISSION",
    status: "new",
    fields,
    createdAt: ts,
    updatedAt: ts,
  });
  return ok({ ok: true, id });
};
