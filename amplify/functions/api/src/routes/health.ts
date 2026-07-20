import { ok } from "../lib/response";
import type { RouteHandler } from "../lib/types";

export const health: RouteHandler = async () => ok({ status: "ok", service: "vibetoreal-api", ts: new Date().toISOString() });
