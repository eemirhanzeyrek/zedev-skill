#!/usr/bin/env bash
set -euo pipefail

SKILL_NAME="zedev-skill"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SCOPE="global"
PROJECT_DIR="$(pwd)"
TARGETS=()

usage() {
  cat <<EOF
Usage: ./install.sh [OPTIONS] [TARGETS...]

Install ${SKILL_NAME} into one or more AI coding agents.

Targets:
  claude        Claude Code (~/.claude/skills or ./.claude/skills)
  codex         OpenAI Codex (~/.agents/skills or ./.agents/skills)
  antigravity   Google Antigravity (~/.gemini/antigravity/skills or ./.agents/skills)
  copilot       GitHub Copilot (~/.copilot/skills or ./.github/skills)
  all           Install for all supported agents (default if no target given)

Options:
  --global            Install into user home skill directories (default)
  --project [DIR]     Install into a specific project directory (defaults to cwd)
  -h, --help          Show this help message

Examples:
  ./install.sh all
  ./install.sh claude codex antigravity
  ./install.sh --project /path/to/my-app copilot claude
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --global)
      SCOPE="global"
      shift
      ;;
    --project)
      SCOPE="project"
      if [[ $# -gt 1 && ! "$2" =~ ^- && "$2" != "claude" && "$2" != "codex" && "$2" != "antigravity" && "$2" != "copilot" && "$2" != "all" ]]; then
        PROJECT_DIR="$2"
        shift 2
      else
        shift
      fi
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    claude|codex|antigravity|copilot|all)
      TARGETS+=("$1")
      shift
      ;;
    *)
      echo "Unknown option or target: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

if [[ ${#TARGETS[@]} -eq 0 ]]; then
  TARGETS=("all")
fi

# Expand 'all'
RESOLVED_TARGETS=()
for t in "${TARGETS[@]}"; do
  if [[ "$t" == "all" ]]; then
    RESOLVED_TARGETS=("claude" "codex" "antigravity" "copilot")
    break
  else
    RESOLVED_TARGETS+=("$t")
  fi
done

install_to_dir() {
  local label="$1"
  local dest="$2"

  mkdir -p "$dest"
  rm -rf "${dest:?}/SKILL.md" "${dest:?}/references" "${dest:?}/scripts"
  cp "$SCRIPT_DIR/SKILL.md" "$dest/SKILL.md"
  cp -R "$SCRIPT_DIR/references" "$dest/references"
  cp -R "$SCRIPT_DIR/scripts" "$dest/scripts"
  chmod +x "$dest/scripts/"*.mjs 2>/dev/null || true

  echo "Installed ${SKILL_NAME} for ${label} -> ${dest}"
}

SEEN_DIRS=""
for target in "${RESOLVED_TARGETS[@]}"; do
  case "$target" in
    claude)
      if [[ "$SCOPE" == "global" ]]; then
        DEST="$HOME/.claude/skills/$SKILL_NAME"
      else
        DEST="$PROJECT_DIR/.claude/skills/$SKILL_NAME"
      fi
      ;;
    codex)
      if [[ "$SCOPE" == "global" ]]; then
        DEST="$HOME/.agents/skills/$SKILL_NAME"
      else
        DEST="$PROJECT_DIR/.agents/skills/$SKILL_NAME"
      fi
      ;;
    antigravity)
      if [[ "$SCOPE" == "global" ]]; then
        DEST="$HOME/.gemini/antigravity/skills/$SKILL_NAME"
      else
        DEST="$PROJECT_DIR/.agents/skills/$SKILL_NAME"
      fi
      ;;
    copilot)
      if [[ "$SCOPE" == "global" ]]; then
        DEST="$HOME/.copilot/skills/$SKILL_NAME"
      else
        DEST="$PROJECT_DIR/.github/skills/$SKILL_NAME"
      fi
      ;;
  esac

  if [[ "$SEEN_DIRS" == *"|$DEST|"* ]]; then
    echo "Already installed ${SKILL_NAME} for ${target} (shared path: ${DEST})"
    continue
  fi
  SEEN_DIRS="${SEEN_DIRS}|$DEST|"
  install_to_dir "$target" "$DEST"
done

echo ""
echo "Done! Restart or start a new session in your agent to load ${SKILL_NAME}."
