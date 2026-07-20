import { json } from "./response";
import type { ApiResponse } from "./types";

export class ApiError extends Error {
  constructor(public status: number, public code: string, message?: string) {
    super(message ?? code);
  }
}

export const badRequest = (code = "bad_request", msg?: string) => new ApiError(400, code, msg);
export const unauthorized = (msg?: string) => new ApiError(401, "unauthorized", msg);
export const forbidden = (msg?: string) => new ApiError(403, "forbidden", msg);
export const notFound = (msg?: string) => new ApiError(404, "not_found", msg);
export const unprocessable = (code: string, msg?: string) => new ApiError(422, code, msg);

/** Convert any thrown value into a clean client response (never leak internals). */
export function toResponse(err: unknown): ApiResponse {
  if (err instanceof ApiError) {
    return json(err.status, { error: err.code, message: err.message });
  }
  return json(500, { error: "internal" });
}
