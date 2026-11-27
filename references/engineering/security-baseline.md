# Security & Data Protection Baseline

Apply these security checks across every mobile, web, desktop, and backend codebase before shipping.

---

## 1. Secrets & Configuration Hygiene

- **Zero hardcoded secrets**: Never commit API keys, private keys, JWT secrets, database URLs, Stripe secret keys (`sk_live_`, `sk_test_`), AWS keys (`AKIA...`), Firebase admin credentials, or OAuth client secrets in source code.
- **Client vs. server separation**:
  - Anything bundled into a mobile binary (`.ipa`/`.apk`) or web frontend bundle (`NEXT_PUBLIC_*`, `VITE_*`, `EXPO_PUBLIC_*`) is **public** and extractable by anyone.
  - Privileged keys (LLM keys, payment secret keys, admin database credentials, third-party paid APIs) must live strictly on a backend/edge proxy, never inside the client app.
- **Environment hygiene**: Ensure `.env` and local secret files are listed in `.gitignore`, and provide a sanitized `.env.example` with empty placeholder values.

---

## 2. Transport & Storage Security

- **HTTPS / TLS everywhere**: Never use plaintext `http://` endpoints in production.
  - On iOS: do not disable App Transport Security (`NSAllowsArbitraryLoads = true`) globally.
  - On Android: do not set `android:usesCleartextTraffic="true"` in release manifests.
- **Secure credential storage**:
  - Mobile: store tokens and sensitive data in **iOS Keychain** / **Android Keystore** (`expo-secure-store`, `flutter_secure_storage`, `EncryptedSharedPreferences`), never in `AsyncStorage`, `UserDefaults`, or unencrypted `SharedPreferences`.
  - Web: prefer `HttpOnly`, `Secure`, `SameSite=Lax/Strict` cookies for session tokens rather than `localStorage` when XSS risk applies.
- **No sensitive data in logs**: Never log passwords, access tokens, credit cards, full emails/PII, or raw authorization headers in production logs or crash reporters.

---

## 3. Authentication, Authorization & Input Safety

- **Server-side authorization**: Never rely on client-side UI hiding or client-sent `isAdmin` / `isPro` flags. Enforce permissions and subscription entitlements on the server for every protected endpoint and database query (e.g., Row-Level Security / ownership checks).
- **Injection & XSS prevention**:
  - Always use parameterized queries / ORM bindings—never concatenate user input into SQL, shell commands, or regexes.
  - Avoid `dangerouslySetInnerHTML`, `innerHTML`, `eval()`, `new Function()`, or unsanitized WebView `javascript:` injection.
- **Web security headers & CORS**:
  - Configure strict CORS allowlists (never `*` combined with `credentials: true`).
  - Set security headers (`Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Strict-Transport-Security`, `X-Frame-Options` or `frame-ancestors`).
- **Rate limiting & abuse protection**: Protect auth endpoints (login, signup, password reset, OTP), AI/paid API proxies, and public forms against brute force and spam.

---

## 4. Mobile Binary & Release Hardening

- Disable debug flags (`android:debuggable="false"`, strip dev menus, disable verbose network loggers) in release builds.
- Enable code shrinking / obfuscation (`minifyEnabled true`, `shrinkResources true` with tested ProGuard/R8 rules on Android).
- Lock down exported Android components (`android:exported="false"` unless intentionally exposed to other apps or deep links) and validate all incoming deep link URLs and parameters.
