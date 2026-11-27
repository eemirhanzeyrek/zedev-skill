# zedev-skill

**Design, Build & Ship Without Rejections.**

`zedev-skill` is a cross-agent, full-lifecycle product craft skill for **Codex**, **Claude Code**, **Antigravity**, and **GitHub Copilot**. It combines universal UI/UX design taste, clean engineering & security standards, and a deterministic **Pre-Flight Store & Web Launch Auditor** so you can catch App Store, Google Play, and web production blockers—and fix them—before shipping.

---

## What It Does

`zedev-skill` uses **progressive disclosure** and **automatic stack detection** so your agent only loads the rules relevant to your project (iOS, Android, React Native / Expo, Flutter, Web/SaaS, Desktop, or Backend):

1. **Design Mode (Universal Taste & UX)**
   - Enforces strong visual hierarchy, disciplined spacing (4/8px), balanced typography, semantic color tokens, and dark/light mode parity.
   - Eliminates generic "AI template" clichés.
   - Ensures all 5 real UI states (default, loading, empty, error, offline), accessibility (WCAG AA, touch targets, screen readers), and platform-native conventions (iOS HIG, Material 3, Web).
2. **Engineering Mode (Craft & Security)**
   - Enforces cohesive architecture, explicit error boundaries, main-thread performance, and resource cleanup.
   - Guards against hardcoded secrets, insecure `http://`, unsafe storage, and client-side auth bypasses.
3. **Pre-Flight Audit Mode (Store & Launch Readiness)**
   - Runs a zero-dependency Node.js scanner (`scripts/preflight-audit.mjs`) across your codebase.
   - Cross-checks Apple App Store Review Guidelines, Google Play policies, Web launch checklists, and legal/compliance rules (Sign in with Apple, Restore Purchases, `PrivacyInfo.xcprivacy`, `Info.plist` usage descriptions, Android `targetSdk`, in-app Account Deletion, `robots.txt`, secrets).
   - Groups findings into `BLOCKER`, `WARNING`, and `POLISH`, then helps fix them and re-verifies.

---

## Installation

Clone the repository and run `./install.sh`:

```bash
git clone https://github.com/eemirhanzeyrek/zedev-skill.git
cd zedev-skill
chmod +x install.sh
```

### Install for All Agents (Global)

```bash
./install.sh all
```

### Install for Specific Agents

```bash
./install.sh claude
./install.sh codex
./install.sh antigravity
./install.sh copilot
```

### Install Into a Specific Project Only

```bash
./install.sh --project /path/to/your-app all
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

# Machine-readable JSON output
node scripts/preflight-audit.mjs /path/to/your-app --json
```

---

## Repository Structure

```text
zedev-skill/
├── SKILL.md                        # Core router & execution rules (Agent Skills spec)
├── README.md                       # Documentation
├── LICENSE                         # MIT License
├── .gitignore                      # Secret, OS, IDE & build artifact exclusions
├── install.sh                      # Multi-agent installer (Claude, Codex, Antigravity, Copilot)
├── references/
│   ├── design/
│   │   ├── universal-taste.md      # Visual hierarchy, typography, color, anti-cliché rules
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
└── scripts/
    ├── detect-project.mjs          # Zero-dependency project/platform detector
    └── preflight-audit.mjs         # Zero-dependency static pre-flight scanner
```

---

## License

zedev-skill is available under the MIT license. See the [LICENSE](LICENSE) file for more info.

## Authors

[@eemirhanzeyrek](https://github.com/eemirhanzeyrek)
