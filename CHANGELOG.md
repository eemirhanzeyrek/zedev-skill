# Changelog

All notable changes to `zedev-skill` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2026-11-27

### Fixed
- Fixed CLI entrypoint detection in `scripts/detect-project.mjs` and `scripts/preflight-audit.mjs` using `fileURLToPath(import.meta.url)` so paths with spaces, non-ASCII characters, or Windows drive letters work reliably.
- Eliminated false-positive `.env` / secret file blockers when those files are already excluded by `.gitignore`.

### Added
- Next.js App Router root `layout.(tsx|jsx|ts|js)` audit for `metadata` / `generateMetadata` exports and `<html lang>`.
- Flutter `pubspec.yaml` check for unmodified default `"A new Flutter project."` descriptions.
- Documented `--json` and `--markdown` audit flags in `SKILL.md` and expanded `tests/audit.test.mjs` coverage.

## [1.0.0] - 2026-11-27

### Added
- **Core Skill (`SKILL.md`)**: Progressive-disclosure router supporting Design, Engineering, and Pre-Flight Audit modes across Codex, Claude Code, Antigravity, and GitHub Copilot.
- **Universal Design Standards (`references/design/`)**: Visual hierarchy, spacing/typography/color rules, concrete Do/Don't examples, 5 required UI states, WCAG AA accessibility, and platform-native UX conventions (iOS HIG, Material 3, Web, Desktop).
- **Engineering & Security Craft (`references/engineering/`)**: Clean architecture, error boundaries, performance fundamentals, secret hygiene, secure storage, and release hardening.
- **Pre-Flight Store & Launch Checklists (`references/audit/`)**: Apple App Store Review Guidelines, Google Play policies, Web launch checklist, and cross-platform legal/compliance rules.
- **Zero-Dependency CLI Scripts (`scripts/`)**:
  - `detect-project.mjs` for automatic platform and framework detection.
  - `preflight-audit.mjs` for deterministic static scanning (`BLOCKER`, `WARNING`, `POLISH`) with `--json`, `--markdown`, and `.zedevignore` support.
- **Multi-Agent Installer (`install.sh`)**: Global and `--project` install/uninstall support for Claude Code, Codex, Antigravity, and GitHub Copilot.
- **Tests & CI (`tests/audit.test.mjs`, `.github/workflows/ci.yml`)**: Zero-dependency `node:test` verification suite and automated GitHub Actions CI.

[Unreleased]: https://github.com/eemirhanzeyrek/zedev-skill/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/eemirhanzeyrek/zedev-skill/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/eemirhanzeyrek/zedev-skill/releases/tag/v1.0.0
