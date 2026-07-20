/** Tiny structured logger. Logs JSON lines so CloudWatch stays queryable. */
type Level = "info" | "warn" | "error";

function log(level: Level, msg: string, meta?: Record<string, unknown>) {
  const line = { level, msg, ts: new Date().toISOString(), ...(meta ?? {}) };
  // eslint-disable-next-line no-console
  (level === "error" ? console.error : console.log)(JSON.stringify(line));
}

export const logger = {
  info: (msg: string, meta?: Record<string, unknown>) => log("info", msg, meta),
  warn: (msg: string, meta?: Record<string, unknown>) => log("warn", msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => log("error", msg, meta),
};
