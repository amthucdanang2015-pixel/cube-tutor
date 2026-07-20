import { ok } from "../lib/response";
import { notFound } from "../lib/errors";
import { get, queryGsi } from "../services/dynamo";
import type { RouteHandler } from "../lib/types";

/**
 * Public content reads. Items live under PK <TYPE>#<slug> / SK META, and are
 * listable via GSI2 (TYPE#<TYPE>). Seed with POST /admin/seed. While the DB is
 * empty the frontend serves the same content statically from web/src/content.
 */
function listType(type: string): RouteHandler {
  return async () => {
    const items = await queryGsi({ index: "GSI2", pk: `TYPE#${type}` });
    return ok({ items });
  };
}
function getBySlug(prefix: string): RouteHandler {
  return async (ctx) => {
    const item = await get(`${prefix}#${ctx.params.slug}`);
    if (!item) throw notFound(`No ${prefix.toLowerCase()} with slug ${ctx.params.slug}`);
    return ok({ item });
  };
}

export const listPatterns = listType("PATTERN");
export const getPattern = getBySlug("PATTERN");
export const listPrompts = listType("PROMPT");
export const getPrompt = getBySlug("PROMPT");
export const listSkills = listType("SKILL");
export const getSkill = getBySlug("SKILL");
export const listTeardowns = listType("TEARDOWN");
export const getTeardown = getBySlug("TEARDOWN");
export const listShowcase = listType("SHOWCASE");
export const getShowcase = getBySlug("SHOWCASE");
export const listCategories = listType("CATEGORY");
