import { defineStorage } from "@aws-amplify/backend";

/**
 * S3 bucket for showcase demo media (screenshots, GIFs, and Phase-2
 * Remotion-rendered MP4s). Served publicly via CloudFront in front of the
 * bucket (CDN configured in backend.ts / console). Read is public; writes are
 * admin-only (you, via the console or an authed admin role).
 */
export const storage = defineStorage({
  name: "showcaseMedia",
  access: (allow) => ({
    "media/*": [allow.guest.to(["read"]), allow.authenticated.to(["read"])],
  }),
});
