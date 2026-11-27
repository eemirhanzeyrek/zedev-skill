# zedev-skill

[![CI](https://github.com/eemirhanzeyrek/zedev-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/eemirhanzeyrek/zedev-skill/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Design, Build & Ship Without Rejections.**

`zedev-skill` is a cross-agent, full-lifecycle product craft skill for **Codex**, **Claude Code**, **Antigravity**, and **GitHub Copilot**. It combines universal UI/UX design taste, clean engineering & security standards, and a deterministic **Pre-Flight Store & Web Launch Auditor** so you can catch App Store, Google Play, and web production blockers—and fix them—before shipping.

---

## What It Does

`zedev-skill` uses **progressive disclosure** and **automatic stack detection** so your agent only loads the rules relevant to your project (iOS, Android, React Native / Expo, Flutter, Web/SaaS, Desktop, or Backend):

1. **Design Mode (Universal Taste & UX)**
   - Enforces strong visual hierarchy, disciplined spacing (4/8px), proven font pairings, neutral light/dark surface ladders, and a 5-second visual self-audit.
   - Provides concrete component recipes (navigation, heroes, cards, KPI dashboards, data tables, paywalls, forms, modals) and eliminates generic "AI template" clichés.
   - Ensures all 5 real UI states (default, loading, empty, error, offline), accessibility (WCAG AA, touch targets, screen readers), and platform-native conventions (iOS HIG, Material 3, Web).
2. **Engineering Mode (Craft & Security)**
   - Enforces cohesive architecture, explicit error boundaries, main-thread performance, and resource cleanup.
   - Guards against hardcoded secrets, insecure `http://`, unsafe storage, and client-side auth bypasses.
3. **Pre-Flight Audit Mode (Store & Launch Readiness)**
   - Runs a zero-dependency Node.js scanner (`scripts/preflight-audit.mjs`) across your codebase.
   - Cross-checks Apple App Store Review Guidelines, Google Play policies, Web launch checklists, and legal/compliance rules (Sign in with Apple, Restore Purchases, `PrivacyInfo.xcprivacy`, `Info.plist` usage descriptions, Android `targetSdk` & `android:exported`, in-app Account Deletion, `robots.txt`, meta tags, secrets).
   - Groups findings into `BLOCKER`, `WARNING`, and `POLISH`, supports `--json`, `--markdown`, and `.zedevignore`, then helps fix issues and re-verifies.

---

## Installation

### Quick Install (Open Agent Skills CLI)

```bash
npx skills add eemirhanzeyrek/zedev-skill
```

### Manual / Multi-Agent Installer (`install.sh`)

Clone the repository and run `./install.sh`:

```bash
git clone https://github.com/eemirhanzeyrek/zedev-skill.git
cd zedev-skill
chmod +x install.sh
```

#### Install for All Agents (Global)

```bash
./install.sh all
```

#### Install for Specific Agents

```bash
./install.sh claude
./install.sh codex
./install.sh antigravity
./install.sh copilot
```

#### Install Into a Specific Project Only

```bash
./install.sh --project /path/to/your-app all
```

#### Uninstall

```bash
./install.sh --uninstall all
./install.sh --uninstall --project /path/to/your-app all
```

| Agent | Global Install Path | Project-Local Path |
| :--- | :--- | :--- |
| **Claude Code** | `~/.claude/skills/zedev-skill` | `./.claude/skills/zedev-skill` |
| **OpenAI Codex** | `~/.agents/skills/zedev-skill` | `./.agents/skills/zedev-skill` |
| **Google Antigravity** | `~/.gemini/antigravity/skills/zedev-skill` | `./.agents/skills/zedev-skill` |
| **GitHub Copilot** | `~/.copilot/skills/zedev-skill` | `./.github/skills/zedev-skill` |

---

## Usage Examples

Once installed, simply prompt your agent naturally:

- **Design:** *"Use zedev-skill to redesign the onboarding and paywall screens with clean visual hierarchy, dark mode parity, and proper empty/error states."*
- **Engineering:** *"Build the subscription checkout flow following zedev-skill engineering and security standards."*
- **Pre-Release Store Audit:** *"Run a zedev-skill pre-flight audit on this app before I submit it to the App Store and Google Play, list every blocker, and fix what can be fixed in code."*

### Running the Built-In CLI Scripts Directly

Both scripts require **Node.js 18+** and have **zero external dependencies**:

```bash
# Detect project platforms and recommended reference modules
node scripts/detect-project.mjs /path/to/your-app

# Run the deterministic pre-flight audit
node scripts/preflight-audit.mjs /path/to/your-app

# Export as Markdown (great for PRs / release notes) or JSON
node scripts/preflight-audit.mjs /path/to/your-app --markdown
node scripts/preflight-audit.mjs /path/to/your-app --json
```

#### Example Audit Output

```text
=== zedev-skill Pre-Flight Audit ===
Project:    /path/to/my-mobile-app
Platforms:  expo, ios, android, react-native
Frameworks: Expo, React Native
Summary:    3 BLOCKER | 2 WARNING | 1 POLISH

[BLOCKER] [ios-app-store] Info.plist permission 'NSCameraUsageDescription' has an empty or overly generic description ("App needs access") (ios/Info.plist:4)
   -> Fix: Write a clear, user-facing explanation of the exact feature that requires this permission (Apple Guideline 5.1.1).
[BLOCKER] [ios-app-store] Third-party social login detected without Sign in with Apple (Apple Guideline 4.8)
   -> Fix: Add Sign in with Apple as an equivalent login option alongside Google/Facebook/social login.
[BLOCKER] [google-play] <activity> with <intent-filter> is missing android:exported attribute (Android 12+ requirement) (android/app/src/main/AndroidManifest.xml:12)
   -> Fix: Explicitly declare android:exported="true" (for launchers/deep links) or android:exported="false" on <activity>.
[WARNING] [compliance] Account authentication detected, but no in-app Account Deletion flow was found in source
   -> Fix: Both Apple (Guideline 5.1.1(v)) and Google Play require an in-app Account Deletion option if users can create accounts.
```

#### Ignoring Specific Paths (`.zedevignore`)

Create a `.zedevignore` file in your project root (one path or wildcard pattern per line) to skip intentional demo/fixture files:

```gitignore
# Skip demo fixtures
src/demo/
*.fixture.ts
```

---

## Repository Structure

```text
zedev-skill/
├── SKILL.md                        # Core router & execution rules (Agent Skills spec)
├── README.md                       # Documentation
├── CHANGELOG.md                    # Release history (Keep a Changelog)
├── LICENSE                         # MIT License
├── .gitignore                      # Secret, OS, IDE & build artifact exclusions
├── install.sh                      # Multi-agent installer & uninstaller
├── .github/
│   └── workflows/
│       └── ci.yml                  # Automated Node test & installer verification CI
├── references/
│   ├── design/
│   │   ├── universal-taste.md      # Visual hierarchy, font/surface ladders, 5-sec craft audit
│   │   ├── component-recipes.md    # Concrete recipes for nav, hero, cards, tables, paywalls, modals
│   │   ├── ui-states-and-a11y.md   # 5 UI states, forms, responsiveness, WCAG accessibility
│   │   └── platform-ux.md          # iOS HIG, Material 3, Web & Desktop conventions
│   ├── engineering/
│   │   ├── code-craft.md           # Architecture, resilience, performance, testing
│   │   └── security-baseline.md    # Secrets, transport, storage, auth & binary hardening
│   └── audit/
│       ├── ios-app-store.md        # App Store Review Guidelines & rejection blockers
│       ├── google-play.md          # Google Play policy & technical requirements
│       ├── web-launch.md           # SEO, metadata, Core Web Vitals & security headers
│       └── compliance-legal.md     # Account deletion, Privacy Policy, IAP, UGC & AI rules
├── scripts/
│   ├── detect-project.mjs          # Zero-dependency project/platform detector
│   └── preflight-audit.mjs         # Zero-dependency static pre-flight scanner
└── tests/
    └── audit.test.mjs              # Zero-dependency node:test verification suite
```

---

## License

zedev-skill is available under the MIT license. See the [LICENSE](LICENSE) file for more info.

## Authors

[@eemirhanzeyrek](https://github.com/eemirhanzeyrek)
