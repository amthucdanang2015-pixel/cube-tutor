/**
 * Amplify entry for the API function. Thin shim — all logic lives in the
 * modular router under ./src (router.ts → routes/* → services/* + lib/*).
 *
 * Routes (see src/router.ts):
 *   GET  /health
 *   GET  /categories /patterns /patterns/:slug /prompts /prompts/:slug
 *        /skills /skills/:slug /teardowns /teardowns/:slug /showcase /showcase/:slug
 *   POST /tools/prompt-builder /tools/motion-prompt-generator /tools/landing-page-roast
 *        /tools/vibe-audit /leads /leads/:type /leads/pro-waitlist /submissions/reference
 *        /uploads/presign
 *   GET  /admin/leads /admin/audits /admin/submissions   (x-admin-key)
 *   POST /admin/seed                                       (x-admin-key)
 *
 * Data: one on-demand DynamoDB table (VTR_TABLE_NAME), single-table design with
 * GSI1 (category/leadtype/status) and GSI2 (type + featured rank).
 */
export { handler } from "./src/index";
