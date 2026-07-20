import { toResponse, notFound } from "./lib/errors";
import { json } from "./lib/response";
import { logger } from "./lib/logger";
import type { ApiEvent, ApiResponse, RouteHandler, RouteContext } from "./lib/types";

import { health } from "./routes/health";
import * as content from "./routes/content";
import * as tools from "./routes/tools";
import * as leads from "./routes/leads";
import * as admin from "./routes/admin";
import { presign } from "./routes/uploads";

interface Route {
  method: string;
  pattern: string; // e.g. /patterns/:slug
  handler: RouteHandler;
}

const routes: Route[] = [
  { method: "GET", pattern: "/health", handler: health },

  // Public content
  { method: "GET", pattern: "/categories", handler: content.listCategories },
  { method: "GET", pattern: "/patterns", handler: content.listPatterns },
  { method: "GET", pattern: "/patterns/:slug", handler: content.getPattern },
  { method: "GET", pattern: "/prompts", handler: content.listPrompts },
  { method: "GET", pattern: "/prompts/:slug", handler: content.getPrompt },
  { method: "GET", pattern: "/skills", handler: content.listSkills },
  { method: "GET", pattern: "/skills/:slug", handler: content.getSkill },
  { method: "GET", pattern: "/teardowns", handler: content.listTeardowns },
  { method: "GET", pattern: "/teardowns/:slug", handler: content.getTeardown },
  { method: "GET", pattern: "/showcase", handler: content.listShowcase },
  { method: "GET", pattern: "/showcase/:slug", handler: content.getShowcase },

  // Tools
  { method: "POST", pattern: "/tools/prompt-builder", handler: tools.promptBuilder },
  { method: "POST", pattern: "/tools/motion-prompt-generator", handler: tools.motionPrompt },
  { method: "POST", pattern: "/tools/landing-page-roast", handler: tools.landingRoast },
  { method: "POST", pattern: "/tools/vibe-audit", handler: leads.createLead },

  // Leads / capture
  { method: "POST", pattern: "/leads", handler: leads.createLead },
  { method: "POST", pattern: "/leads/pro-waitlist", handler: leads.joinWaitlist },
  { method: "POST", pattern: "/leads/:type", handler: leads.createLead },
  { method: "POST", pattern: "/submissions/reference", handler: leads.submitReference },

  // Uploads
  { method: "POST", pattern: "/uploads/presign", handler: presign },

  // Admin (x-admin-key)
  { method: "GET", pattern: "/admin/leads", handler: admin.listLeads },
  { method: "GET", pattern: "/admin/audits", handler: admin.listAudits },
  { method: "GET", pattern: "/admin/submissions", handler: admin.listSubmissions },
  { method: "POST", pattern: "/admin/seed", handler: admin.seed },
];

/** Match a concrete path against a pattern with :params. Returns params or null. */
function match(pattern: string, path: string): Record<string, string> | null {
  const pp = pattern.split("/").filter(Boolean);
  const xp = path.split("/").filter(Boolean);
  if (pp.length !== xp.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pp.length; i++) {
    if (pp[i].startsWith(":")) params[pp[i].slice(1)] = decodeURIComponent(xp[i]);
    else if (pp[i] !== xp[i]) return null;
  }
  return params;
}

function parseBody(raw?: string | null): Record<string, unknown> {
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

export async function route(event: ApiEvent): Promise<ApiResponse> {
  const method = event.requestContext?.http?.method ?? "GET";
  const rawPath = event.requestContext?.http?.path ?? event.rawPath ?? "/";
  const path = rawPath.replace(/\/+$/, "") || "/";

  if (method === "OPTIONS") return json(204, {});

  // More specific patterns (fewer params) win; routes are ordered specific-first.
  for (const r of routes) {
    if (r.method !== method) continue;
    const params = match(r.pattern, path);
    if (!params) continue;
    const ctx: RouteContext = {
      method,
      path,
      params,
      query: (event.queryStringParameters as Record<string, string>) ?? {},
      body: parseBody(event.body),
      headers: Object.fromEntries(Object.entries(event.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v ?? ""])),
    };
    try {
      return await r.handler(ctx);
    } catch (err) {
      logger.error("route_error", { path, method, err: String(err) });
      return toResponse(err);
    }
  }

  return toResponse(notFound(`No route for ${method} ${path}`));
}
