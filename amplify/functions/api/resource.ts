import { defineFunction } from "@aws-amplify/backend";

/**
 * Single Node.js Lambda that handles every REST path via an internal router
 * (see handler.ts). Kept as one function for v1 simplicity; split by domain
 * later if cold-starts or scale demand it.
 */
export const apiFunction = defineFunction({
  name: "api",
  entry: "./handler.ts",
  runtime: 20,
  timeoutSeconds: 20,
  memoryMB: 256,
});
