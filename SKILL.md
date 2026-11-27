---
name: zedev-skill
description: Full-lifecycle product craft skill for design, engineering, and pre-release store/web launch auditing. Use when designing UI/UX, building or refactoring features across mobile (iOS, Android, React Native, Expo, Flutter), web, desktop, or backend apps, or running a pre-submission audit before shipping to the Apple App Store, Google Play Store, or production web to catch rejection blockers, security leaks, and UX gaps and fix them.
---

# zedev-skill — Design, Build & Ship Without Rejections

`zedev-skill` is a universal product craft and release-readiness skill. It elevates AI coding agents from generating generic output to shipping production-grade software that looks intentional, behaves reliably, and passes Apple App Store, Google Play, and web launch reviews on the first try.

---

## Step 1: Identify the Mode & Detect the Project

Determine which mode(s) the user's request requires. Multiple modes can be combined when building end-to-end.

1. **Design Mode (Taste & UX)** — Triggered when creating, styling, reviewing, or improving interfaces, layouts, design systems, animations, or user flows.
2. **Engineering Mode (Craft & Security)** — Triggered when writing, refactoring, architecting, debugging, or optimizing application code, APIs, state, or data flows.
3. **Pre-Flight Audit Mode (Ship & Store Review)** — Triggered when preparing an app for App Store, Google Play, or web launch, checking for missing requirements, scanning for rejection risks, or fixing audit findings.

When working inside an existing codebase, detect the project stack first:

```bash
node <skill-dir>/scripts/detect-project.mjs [project-root]
```

Use the detected platforms (`ios`, `android`, `react-native`, `expo`, `flutter`, `web`, `backend`, `desktop`) to load **only** the relevant reference modules below. Do not load unrelated platform files.

---

## Step 2: Load Only the Relevant Modules (Progressive Disclosure)

### Mode 1: Design (Taste & UX)
Read these before designing or modifying UI:
- Universal visual craft & anti-cliché rules: `references/design/universal-taste.md`
- Complete UI states, responsiveness & accessibility: `references/design/ui-states-and-a11y.md`
- Platform-native UX conventions (iOS HIG, Material 3, Web): `references/design/platform-ux.md`

### Mode 2: Engineering (Craft & Security)
Read these before writing or refactoring production code:
- Architecture, resilience, performance & code quality: `references/engineering/code-craft.md`
- Security, secrets, auth & data protection baseline: `references/engineering/security-baseline.md`

### Mode 3: Pre-Flight Audit (App Store, Google Play & Web Launch)
Run the automated scanner first to get deterministic, file-level findings:

```bash
node <skill-dir>/scripts/preflight-audit.mjs [project-root]
# Optional structured output: --json or --markdown
```

Then read only the checklists matching the detected platform(s):
- Apple App Store Review Guidelines & rejection blockers: `references/audit/ios-app-store.md`
- Google Play policies & technical requirements: `references/audit/google-play.md`
- Web / SaaS production launch checklist (SEO, CWV, headers): `references/audit/web-launch.md`
- Cross-platform legal, privacy, IAP & account deletion compliance: `references/audit/compliance-legal.md`

---

## Step 3: Execution Rules

### In Design Mode
- Establish a clear visual hierarchy, deliberate typography scale, disciplined spacing grid (4/8px), and restrained color palette before writing markup or styles.
- Avoid generic "AI template" aesthetics (gratuitous purple-blue gradients, neon glow cards, overcrowded bento grids, low-contrast text, placeholder copy).
- Implement **all** real UI states: default, loading (skeleton/progress), empty, error (with recovery action), and offline where applicable.
- Respect platform conventions: safe areas, dynamic type / font scaling, minimum touch targets (44pt iOS / 48dp Android), keyboard avoidance, and dark/light mode parity.

### In Engineering Mode
- Keep modules cohesive, small, and easy to delete or replace. Avoid speculative abstractions.
- Handle failures explicitly at boundaries (network, storage, permissions, external APIs); never swallow errors silently.
- Never hardcode secrets, API keys, private tokens, or insecure `http://` endpoints.
- Optimize for perceived performance first: avoid blocking the main thread, paginate lists, clean up listeners/timers, and memoize only where measured or structurally necessary.

### In Pre-Flight Audit Mode
1. **Scan deterministically** using `scripts/preflight-audit.mjs` and inspect the actual project manifests, configs, and source files.
2. **Cross-check** against the loaded `references/audit/*.md` guidelines (especially runtime behaviors the static script cannot verify, such as demo login credentials, account deletion flow, Restore Purchases, and paywall disclosures).
3. **Report findings** grouped strictly by severity:
   - `BLOCKER` — Guaranteed or high-probability store rejection, crash, or security leak. Must be fixed before submission.
   - `WARNING` — Policy risk, missing metadata, degraded UX, or technical debt that may trigger manual review delays.
   - `POLISH` — High-impact craft improvements (accessibility, performance, store metadata, visual polish).
4. **Propose & apply fixes**: For every finding, provide the exact file path, reason, and concrete fix. When the user asks to fix issues (or in an end-to-end audit-and-fix request), fix `BLOCKER` items first, then `WARNING`, re-run `scripts/preflight-audit.mjs` to verify zero remaining blockers, and summarize what was resolved vs. what requires manual portal action (e.g., App Store Connect / Play Console forms).

---

## Non-Negotiable Principles

- **Never fabricate compliance**: If a privacy policy URL, legal document, signing key, or store console setting does not exist, flag it clearly as a required user action instead of inventing fake URLs or dummy keys.
- **Zero placeholder shipping**: Flag and eliminate `Lorem ipsum`, `TODO` in user-facing strings, broken asset links, hardcoded test credentials, and debug flags left enabled in release configs.
- **Evidence-based auditing**: Every audit finding must cite a specific file, config key, or verified absence—never vague generic advice.
