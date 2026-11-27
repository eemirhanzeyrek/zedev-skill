#!/usr/bin/env node
/**
 * zedev-skill — Project Stack & Platform Detector
 * Zero-dependency Node.js script that inspects a project root and reports
 * detected platforms, frameworks, and which zedev-skill reference modules to load.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export function safeReadJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return null;
  }
}

export function exists(root, relPath) {
  return fs.existsSync(path.join(root, relPath));
}

export function hasFileMatching(dir, regex, maxDepth = 2, currentDepth = 0) {
  if (currentDepth > maxDepth || !fs.existsSync(dir)) return false;
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return false;
  }
  const skip = new Set([
    "node_modules",
    ".git",
    "Pods",
    "build",
    "dist",
    ".next",
    ".nuxt",
    ".gradle",
    "vendor",
    ".venv",
    "venv",
  ]);
  for (const entry of entries) {
    if (skip.has(entry.name)) continue;
    if (regex.test(entry.name)) return true;
    if (entry.isDirectory() && currentDepth < maxDepth) {
      if (hasFileMatching(path.join(dir, entry.name), regex, maxDepth, currentDepth + 1)) {
        return true;
      }
    }
  }
  return false;
}

export function detectProject(rootDir) {
  const root = path.resolve(rootDir || process.cwd());
  const platforms = new Set();
  const frameworks = new Set();
  const signals = [];

  const pkgPath = path.join(root, "package.json");
  const pkg = fs.existsSync(pkgPath) ? safeReadJson(pkgPath) : null;
  const allDeps = {
    ...(pkg?.dependencies || {}),
    ...(pkg?.devDependencies || {}),
  };

  // Expo / React Native
  if (allDeps["expo"] || exists(root, "app.json") || exists(root, "app.config.js") || exists(root, "app.config.ts")) {
    const appJson = safeReadJson(path.join(root, "app.json"));
    if (allDeps["expo"] || appJson?.expo) {
      platforms.add("expo");
      platforms.add("ios");
      platforms.add("android");
      frameworks.add("Expo");
      signals.push("Expo configuration / dependency detected");
    }
  }

  if (allDeps["react-native"]) {
    platforms.add("react-native");
    platforms.add("ios");
    platforms.add("android");
    frameworks.add("React Native");
    signals.push("react-native dependency detected");
  }

  // Flutter
  if (exists(root, "pubspec.yaml")) {
    platforms.add("flutter");
    frameworks.add("Flutter");
    signals.push("pubspec.yaml detected");
    if (exists(root, "ios")) platforms.add("ios");
    if (exists(root, "android")) platforms.add("android");
    if (exists(root, "web")) platforms.add("web");
  }

  // Native iOS
  if (
    exists(root, "ios") ||
    exists(root, "Podfile") ||
    hasFileMatching(root, /\.(xcodeproj|xcworkspace)$/, 2) ||
    hasFileMatching(root, /^Info\.plist$/, 3)
  ) {
    platforms.add("ios");
    if (!frameworks.has("React Native") && !frameworks.has("Expo") && !frameworks.has("Flutter")) {
      frameworks.add("Native iOS (Swift/ObjC)");
    }
    signals.push("iOS project structure detected");
  }

  // Native Android
  if (
    exists(root, "android") ||
    exists(root, "app/src/main/AndroidManifest.xml") ||
    exists(root, "build.gradle") ||
    exists(root, "build.gradle.kts")
  ) {
    platforms.add("android");
    if (!frameworks.has("React Native") && !frameworks.has("Expo") && !frameworks.has("Flutter")) {
      frameworks.add("Native Android (Kotlin/Java)");
    }
    signals.push("Android project structure detected");
  }

  // Web frameworks
  const webMap = [
    ["next", "Next.js"],
    ["nuxt", "Nuxt"],
    ["vite", "Vite"],
    ["astro", "Astro"],
    ["@sveltejs/kit", "SvelteKit"],
    ["svelte", "Svelte"],
    ["vue", "Vue"],
    ["react-dom", "React"],
    ["@angular/core", "Angular"],
    ["remix", "Remix"],
  ];
  for (const [dep, label] of webMap) {
    if (allDeps[dep]) {
      platforms.add("web");
      frameworks.add(label);
      signals.push(`${label} (${dep}) detected`);
    }
  }
  if (!platforms.has("web") && (exists(root, "index.html") || exists(root, "public/index.html"))) {
    platforms.add("web");
    frameworks.add("Static/HTML Web");
    signals.push("index.html detected");
  }

  // Desktop
  if (allDeps["electron"]) {
    platforms.add("desktop");
    frameworks.add("Electron");
    signals.push("Electron detected");
  }
  if (exists(root, "src-tauri")) {
    platforms.add("desktop");
    frameworks.add("Tauri");
    signals.push("Tauri (src-tauri) detected");
  }

  // Backend
  const backendDeps = ["express", "fastify", "@nestjs/core", "hono", "koa", "prisma", "drizzle-orm"];
  for (const dep of backendDeps) {
    if (allDeps[dep]) {
      platforms.add("backend");
      frameworks.add(dep);
      signals.push(`Backend dependency ${dep} detected`);
    }
  }
  if (exists(root, "go.mod")) {
    platforms.add("backend");
    frameworks.add("Go");
    signals.push("go.mod detected");
  }
  if (exists(root, "Cargo.toml") && !exists(root, "src-tauri")) {
    platforms.add("backend");
    frameworks.add("Rust");
    signals.push("Cargo.toml detected");
  }
  if (exists(root, "pyproject.toml") || exists(root, "requirements.txt")) {
    platforms.add("backend");
    frameworks.add("Python");
    signals.push("Python project detected");
  }

  const recommendedAuditRefs = new Set(["references/audit/compliance-legal.md"]);
  if (platforms.has("ios")) recommendedAuditRefs.add("references/audit/ios-app-store.md");
  if (platforms.has("android")) recommendedAuditRefs.add("references/audit/google-play.md");
  if (platforms.has("web")) recommendedAuditRefs.add("references/audit/web-launch.md");

  return {
    root,
    platforms: [...platforms],
    frameworks: [...frameworks],
    signals,
    recommendedReferences: {
      design: [
        "references/design/universal-taste.md",
        "references/design/component-recipes.md",
        "references/design/ui-states-and-a11y.md",
        "references/design/platform-ux.md",
      ],
      engineering: [
        "references/engineering/code-craft.md",
        "references/engineering/security-baseline.md",
      ],
      audit: [...recommendedAuditRefs],
    },
  };
}

// CLI execution
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
  const args = process.argv.slice(2);
  const jsonFlag = args.includes("--json");
  const targetDir = args.find((a) => !a.startsWith("-")) || process.cwd();
  const result = detectProject(targetDir);

  if (jsonFlag) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`zedev-skill Project Detection`);
    console.log(`Root:       ${result.root}`);
    console.log(`Platforms:  ${result.platforms.length ? result.platforms.join(", ") : "unknown"}`);
    console.log(`Frameworks: ${result.frameworks.length ? result.frameworks.join(", ") : "none detected"}`);
    console.log(`Audit Refs: ${result.recommendedReferences.audit.join(", ")}`);
  }
}
