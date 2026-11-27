# Google Play Pre-Submission Audit Checklist

Use this checklist to catch Google Play Console policy rejections, technical compliance failures, and release regressions before uploading an `.aab`.

---

## 1. Technical & Build Requirements (`BLOCKER`)

- **Android App Bundle (`.aab`)**: New apps and updates must ship as signed `.aab`, not `.apk`.
- **Target API Level**: `targetSdkVersion` must meet Google Play's current requirement (API 35 / Android 15 or newer for active releases; verify against current Play Console requirements).
- **64-bit native libraries**: Any native `.so` libraries must include `arm64-v8a` (and `x86_64` where applicable).
- **Release build hardening**:
  - `android:debuggable` must NOT be `true` in `AndroidManifest.xml` or release buildType.
  - `android:usesCleartextTraffic="true"` must NOT be enabled in release builds.
  - `versionCode` must be strictly incremented; `versionName` must follow clean semantic versioning.
  - Signing config must use a proper release keystore (never the debug keystore) and **never** commit `.jks`/`.keystore` files or passwords into git.
- **Edge-to-edge & 16 KB page sizes**: On Android 15+, ensure edge-to-edge insets don't overlap status/navigation bars, and ensure native dependencies support 16 KB memory page sizes.

---

## 2. Permissions & Sensitive APIs (`BLOCKER`)

- **Least privilege**: Remove every `<uses-permission>` in `AndroidManifest.xml` that the app does not strictly require (check merged manifests from third-party SDKs too!).
- **High-risk permissions** (require formal Play Console justification and often trigger rejection if misused):
  - `READ_MEDIA_IMAGES` / `READ_MEDIA_VIDEO` → Use the Android **Photo Picker** for one-time or occasional media selection instead of requesting broad storage access.
  - `ACCESS_BACKGROUND_LOCATION` → Requires prominent in-app disclosure dialog *before* system prompt + Play Console video declaration.
  - `QUERY_ALL_PACKAGES`, `READ_SMS`, `CALL_LOG`, `REQUEST_INSTALL_PACKAGES`, `MANAGE_EXTERNAL_STORAGE`, `FOREGROUND_SERVICE_*` → Require explicit valid use cases and foreground service type declarations (`android:foregroundServiceType`).
- **Prominent Disclosure**: Before collecting sensitive data (location, contacts, camera, background services) or requesting restricted permissions, explain *what* is collected and *why* inside the app UI.
- **Exported components**: Every `<activity>`, `<service>`, and `<receiver>` with an `<intent-filter>` must declare `android:exported="true"` or `"false"` explicitly.

---

## 3. Privacy, Data Safety & Account Deletion (`BLOCKER`)

- **Account Deletion (In-App + Web URL)**: If users can create accounts, Google Play requires **both**:
  1. An in-app account deletion path, **and**
  2. A publicly accessible web URL where users can request account/data deletion without reinstalling the app (linked in Play Console Data Safety).
- **Data Safety form parity**: Every SDK bundled in the app (Firebase Analytics, Crashlytics, AdMob, Sentry, Meta SDK, RevenueCat, etc.) that collects device IDs, crash logs, or analytics must be accurately declared in Google Play's Data Safety section.
- **Privacy Policy**: Valid, live HTTPS Privacy Policy URL linked in Play Console and accessible inside the app.
- **Advertising ID**: If using `AD_ID` (`com.google.android.gms.permission.AD_ID`), declare it accurately in Play Console; if targeting children/families, do not transmit Ad ID.

---

## 4. Payments, Subscriptions & Content (`BLOCKER` / `WARNING`)

- **Google Play Billing**: Digital goods, premium unlocks, and subscriptions must use Google Play Billing Library (up-to-date supported major version).
- **Subscription transparency**: Clearly show price, billing cycle, renewal terms, and how to cancel before purchase.
- **App Access / Reviewer Credentials**: If any part of the app is behind login or paywall, provide working test credentials in Play Console → App Content → App Access.
- **Target Audience & Content Rating**: Complete IARC content rating accurately; if the app is not intended for children, avoid child-appealing cartoon imagery in store graphics to prevent unintended Families Policy enforcement.

---

## 5. UX & Store Listing Polish (`WARNING` / `POLISH`)

- **Adaptive Icon**: Provide high-res foreground + background adaptive icon assets (`mipmap-anydpi-v26`) and a 512×512px Play Store icon.
- **Predictive Back & Orientation**: Back button/gesture must work predictably on every screen without trapping the user or crashing.
- **De-obfuscation mapping**: Upload `mapping.txt` (ProGuard/R8) and native debug symbols so crash reports in Play Console are readable.
- **No iOS references**: Never mention "App Store", "iPhone", or show iOS screenshots/status bars in Android builds or Play Store listings.
