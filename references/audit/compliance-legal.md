# Cross-Platform Legal, Privacy & Compliance Checklist

Apply these rules across iOS, Android, Web, and SaaS whenever the product handles user accounts, payments, user-generated content (UGC), or AI features.

---

## 1. Account Lifecycle & Deletion (`BLOCKER` on Mobile, `WARNING` on Web)

- If users can register an account, provide a clear, self-service **Delete Account** flow in Settings:
  - Clearly explain what data will be permanently deleted vs. retained (e.g., legal/billing invoices).
  - Require intentional confirmation (e.g., re-authentication or typing confirmation) to prevent accidental deletion.
  - Actually revoke active sessions/tokens (including Apple Sign-In token revocation on iOS!) and delete or anonymize user records.
  - For Google Play: also expose a public web deletion request page.

---

## 2. Privacy Policy, Terms & Consent (`BLOCKER`)

- **Live, real URLs**: Both Privacy Policy and Terms of Service must be live HTTPS pages accessible without logging in. Never ship `#`, `example.com`, or placeholder text.
- **Accurate disclosures**: The Privacy Policy must reflect actual third-party processors (analytics, crash reporting, auth, payment processors, AI/LLM providers).
- **Cookie & Tracking Consent**: If serving EU/UK/California users with non-essential analytics or ad cookies, implement explicit opt-in consent before firing tracking scripts.

---

## 3. Subscriptions, Payments & Refunds (`BLOCKER`)

- Never hide pricing, renewal frequency, or trial-to-paid conversion terms in tiny low-contrast text ("dark patterns" trigger immediate App Store / Play Store rejections and legal risk).
- Ensure cancellation instructions are easy to find (deep-link to Apple/Google subscription management on mobile, or one-click billing portal on web).
- Sync entitlement state reliably with backend webhooks—never grant permanent access solely from a client-side callback without receipt/server verification.

---

## 4. User-Generated Content (UGC) & Social Features (`BLOCKER` on Mobile)

If users can post text, images, comments, profiles, or messages visible to other users, Apple (Guideline 1.2) and Google Play **strictly require**:
- **Content filtering / moderation** mechanism for objectionable content.
- **Report content** button on every user-generated item.
- **Block user** feature that immediately hides that user's content from the blocker's feed.
- **Terms / EULA acceptance** stating zero tolerance for abusive content, plus a working developer contact/moderation process.

---

## 5. AI / LLM Features (`WARNING`)

- Disclose when content or responses are AI-generated where users could be misled.
- Implement content safety guardrails / moderation on user prompts and AI outputs (especially for image generation or open chat).
- Disclose in the Privacy Policy if user data/prompts are sent to third-party AI APIs, and never send sensitive PII or health/financial data without explicit user consent.
