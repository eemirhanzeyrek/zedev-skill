# Apple App Store Pre-Submission Audit Checklist

Use this checklist to catch the most common Apple App Store Review rejections **before** uploading to App Store Connect.

---

## 1. Guideline 2.1 — App Completeness & Crashes (`BLOCKER`)

- **Zero crashes & broken flows**: Every button, tab, link, and onboarding step must work on real devices, including iPad if `TARGETED_DEVICE_FAMILY` includes iPad (Apple frequently tests iPhone apps on iPad!).
- **No placeholder content**: Eliminate `Lorem ipsum`, "Coming soon" dead tabs, broken images, `TODO` strings, or unconfigured test banners.
- **Reviewer demo access**: If the app requires login, provide a working demo account (without SMS/2FA dead-ends or geo-blocks) in App Store Connect Review Notes, and ensure login works reliably on IPv6-only networks.
- **Offline & empty states**: Launching with no network or a fresh account must show a graceful state—never an infinite spinner or crash.

---

## 2. Guideline 5.1 — Privacy, Permissions & `PrivacyInfo.xcprivacy` (`BLOCKER`)

- **Privacy Manifest (`PrivacyInfo.xcprivacy`)**: Required for apps (and third-party SDKs) using Required Reason APIs (`NSUserDefaults`, file timestamps, disk space, system boot time, active keyboards). Verify `PrivacyInfo.xcprivacy` exists and declares accurate `NSPrivacyAccessedAPITypes`.
- **Specific `Info.plist` usage descriptions**: Every permission used in code or linked SDKs (`NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSLocationWhenInUseUsageDescription`, `NSMicrophoneUsageDescription`, `NSContactsUsageDescription`, `NSUserTrackingUsageDescription`, `NSBluetoothAlwaysUsageDescription`, `NSFaceIDUsageDescription`) must have a **clear, concrete, user-facing explanation** of *why* the app needs it (e.g., *"Used to scan receipts for expense tracking"*, NEVER *"App needs camera access"*).
- **Remove unused permissions**: Unused permission keys or frameworks trigger unnecessary review scrutiny.
- **App Tracking Transparency (ATT)**: If the app uses IDFA, ad SDKs, or cross-app tracking, request permission via `ATTrackingManager` **before** tracking, include `NSUserTrackingUsageDescription`, and never gate app functionality behind allowing tracking.
- **In-app Account Deletion (Guideline 5.1.1(v))**: If users can create an account in the app, they **must** be able to initiate permanent account deletion *inside* the app (not merely "email support" or "deactivate").
- **Privacy Policy**: Must be accessible both in App Store Connect metadata and inside the app (e.g., Settings + Sign-up/Paywall).

---

## 3. Guideline 3.1 — In-App Purchases & Subscriptions (`BLOCKER`)

- **Digital goods & features**: Must use Apple StoreKit / In-App Purchase (never external Stripe/PayPal links for digital unlocks unless explicitly eligible under regional external-link entitlements).
- **Restore Purchases button**: Every screen offering non-consumable IAPs or auto-renewable subscriptions **must** include a clearly visible, working **Restore Purchases** button.
- **Clear subscription disclosures**: Before purchase, display:
  - Subscription title & duration (e.g., Monthly / Yearly)
  - Full price (and price per period if showing a monthly breakdown of a yearly plan—the billed price must be the most prominent!)
  - Auto-renewal terms & cancellation notice
  - Functional links to **Privacy Policy** and **Terms of Use (EULA)**
- **No forced purchase before core value or broken paywall**: Paywall must load real StoreKit products gracefully even in Sandbox, handle purchase cancellation silently without showing an error alert, and never leave a spinning loader forever.

---

## 4. Guideline 4.8 — Sign in with Apple (`BLOCKER`)

- If the app offers **any** third-party or social login (Google, Facebook, GitHub, X, etc.), it **must** also offer **Sign in with Apple** as an equivalent, equally prominent option.
- Respect Apple's Private Relay email and optional name fields (never crash if name is `null` on subsequent logins—Apple only sends the user's name on the very first sign-in!).

---

## 5. Guideline 4.0 & 2.3 — Design, Metadata & Build Hygiene (`WARNING` / `BLOCKER`)

- **App Icon & Launch Screen**: 1024×1024px App Store icon with **no alpha channel / transparency** and no rounded corners baked in. Launch screen must not look like a splash advertisement or break on different aspect ratios.
- **Minimum functionality (4.2)**: The app must offer genuine native value beyond wrapping a marketing website in a WebView.
- **Transport security**: Avoid setting `NSAllowsArbitraryLoads = true` globally in `Info.plist`.
- **Versioning**: `CFBundleShortVersionString` (marketing version) and `CFBundleVersion` (build number) must be valid and strictly incremented per upload.
- **Screenshots & copy**: No Android status bars/hardware frames in iOS screenshots, no unverified claims ("#1 app"), no mentions of beta/test/demo in metadata, and no references to other platforms ("Android", "Google Play") inside iOS UI or metadata.
- **Export compliance**: Set `ITSAppUsesNonExemptEncryption` in `Info.plist` (`false` if only using standard HTTPS/TLS) to avoid repeated export compliance prompts on every TestFlight/App Store upload.
