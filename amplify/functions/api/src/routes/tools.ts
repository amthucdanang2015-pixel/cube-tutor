import { ok } from "../lib/response";
import { str } from "../services/validation";
import { buildPrompt, buildMotionPrompt } from "../services/promptBuilder";
import { roast } from "../services/audit";
import type { RouteHandler } from "../lib/types";

export const promptBuilder: RouteHandler = async (ctx) => {
  const result = buildPrompt({
    productType: str(ctx.body, "productType", { required: true }),
    section: str(ctx.body, "section", { required: true }),
    style: str(ctx.body, "style", { required: true }),
    motion: str(ctx.body, "motion") || "Subtle fade",
    tool: str(ctx.body, "tool") || "v0",
  });
  return ok(result);
};

export const motionPrompt: RouteHandler = async (ctx) => {
  const result = buildMotionPrompt({
    type: str(ctx.body, "type", { required: true }),
    feel: str(ctx.body, "feel") || "Premium",
    framework: str(ctx.body, "framework") || "Motion.dev React",
  });
  return ok(result);
};

export const landingRoast: RouteHandler = async (ctx) => {
  const hero = str(ctx.body, "hero", { required: true, max: 600 });
  const result = roast(hero, str(ctx.body, "category"), str(ctx.body, "target"));
  return ok(result);
};
