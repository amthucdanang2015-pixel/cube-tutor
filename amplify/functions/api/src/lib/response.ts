import type { ApiResponse } from "./types";

const CORS = {
  "content-type": "application/json",
  "access-control-allow-origin": process.env.CORS_ORIGIN ?? "*",
  "access-control-allow-headers": "content-type, authorization, x-user-sub, x-admin-key",
  "access-control-allow-methods": "GET, POST, OPTIONS",
};

export function json(statusCode: number, data: unknown): ApiResponse {
  return { statusCode, headers: CORS, body: JSON.stringify(data) };
}

export const ok = (data: unknown) => json(200, data);
export const created = (data: unknown) => json(201, data);
export const noContent = () => json(204, {});
