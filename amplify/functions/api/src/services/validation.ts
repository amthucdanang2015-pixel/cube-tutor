import { unprocessable } from "../lib/errors";
import type { Json } from "../lib/types";

export function str(body: Json, key: string, opts: { required?: boolean; max?: number } = {}): string {
  const v = body[key];
  if (v == null || v === "") {
    if (opts.required) throw unprocessable("missing_field", `Missing field: ${key}`);
    return "";
  }
  if (typeof v !== "string") throw unprocessable("invalid_field", `Field must be a string: ${key}`);
  const trimmed = v.trim();
  if (opts.max && trimmed.length > opts.max) throw unprocessable("field_too_long", `Field too long: ${key}`);
  return trimmed;
}

export function email(body: Json, key = "email", required = true): string {
  const v = str(body, key, { required, max: 320 }).toLowerCase();
  if (v && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) throw unprocessable("invalid_email", "Invalid email");
  return v;
}

export function oneOf(body: Json, key: string, allowed: string[], required = false): string {
  const v = str(body, key, { required });
  if (v && !allowed.includes(v)) throw unprocessable("invalid_value", `Invalid value for ${key}`);
  return v;
}

/** Cheap spam guard: at least one meaningful field present. */
export function notEmpty(fields: Record<string, unknown>): void {
  const filled = Object.values(fields).filter((v) => typeof v === "string" && v.trim().length > 1);
  if (filled.length === 0) throw unprocessable("empty_submission", "Submission is empty");
}
