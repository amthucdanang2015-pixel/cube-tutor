import { defineAuth } from "@aws-amplify/backend";

/**
 * Email-based auth. Members sign in with a magic-link / email + password.
 * The `member` entitlement itself lives in DynamoDB (flipped by the Stripe
 * webhook), not in Cognito — keep auth about identity, billing about access.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
