"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Client-side access state for v1.
 * - `email`  : captured lead (unlocks copying FREE prompts)
 * - `member` : paid Pro subscriber (unlocks all gated prompts)
 *
 * This is intentionally simple for launch. When the Amplify backend is wired,
 * swap the localStorage reads for an authenticated `/api/me` call and let the
 * Stripe/Lemon webhook flip `member` in DynamoDB. The component API stays the same.
 */

const EMAIL_KEY = "v2r_email";
const MEMBER_KEY = "v2r_member";

export function useAccess() {
  const [email, setEmail] = useState<string | null>(null);
  const [member, setMember] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setEmail(localStorage.getItem(EMAIL_KEY));
      setMember(localStorage.getItem(MEMBER_KEY) === "1");
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const captureEmail = useCallback(async (value: string) => {
    try {
      await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, source: "prompt-gate" }),
      });
    } catch {
      /* network optional in v1 */
    }
    try {
      localStorage.setItem(EMAIL_KEY, value);
    } catch {
      /* ignore */
    }
    setEmail(value);
  }, []);

  const becomeMember = useCallback(() => {
    try {
      localStorage.setItem(MEMBER_KEY, "1");
    } catch {
      /* ignore */
    }
    setMember(true);
  }, []);

  return { email, member, ready, captureEmail, becomeMember };
}

export type Access = ReturnType<typeof useAccess>;
