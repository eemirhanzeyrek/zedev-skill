#!/usr/bin/env node
/**
 * zedev-skill — Deterministic Pre-Flight Store & Web Launch Auditor
 * Zero-dependency static scanner that flags App Store, Google Play, Web launch,
 * security, and compliance blockers before submission.
 */

import fs from "node:fs";
import path from "node:path";
import { detectProject, safeReadJson } from "./detect-project.mjs";

const SKIP_DIRS = new Set([
  "node_modules",
  ".git",
  "Pods",
  "build",
  "dist",
  "out",
  ".next",
  ".nuxt",
  ".turbo",
  ".gradle",
  ".dart_tool",
  "DerivedData",
  "coverage",
  "vendor",
  ".venv",
  "venv",
  "__pycache__",
]);

const SOURCE_EXTS = new Set([
  ".js",
  ".jsx",
  ".ts",
  ".tsx",
  ".mjs",
  ".cjs",
  ".swift",
  ".m",
  ".mm",
  ".kt",
  ".java",
  ".dart",
  ".vue",
  ".svelte",
  ".astro",
  ".html",
  ".py",
  ".rb",
  ".go",
  ".rs",
]);

const MAX_FILE_BYTES = 512 * 1024; // 512 KB per source file

function loadIgnorePatterns(root) {
  const ignorePath = path.join(root, ".zedevignore");
  if (!fs.existsSync(ignorePath)) return [];
  try {
    return fs
      .readFileSync(ignorePath, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"));
  } catch {
    return [];
  }
}

function isIgnored(relPath, patterns) {
  if (!patterns.length) return false;
  const normalized = relPath.split(path.sep).join("/");
  for (const pat of patterns) {
    const clean = pat.replace(/\/+$/, "");
    if (!clean) continue;
    if (normalized === clean || normalized.startsWith(`${clean}/`)) return true;
    if (clean.includes("*")) {
      const escaped = clean.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
      if (new RegExp(`^${escaped}$`).test(normalized) || new RegExp(`(^|/)${escaped}$`).test(normalized)) {
        return true;
      }
    }
  }
  return false;
}

function walkFiles(dir, root, ignorePatterns, collector = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return collector;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const relPath = path.relative(root, full);
    if (isIgnored(relPath, ignorePatterns)) continue;
    if (entry.isDirectory()) {
      walkFiles(full, root, ignorePatterns, collector);
    } else if (entry.isFile()) {
      collector.push(full);
    }
  }
  return collector;
}

function rel(root, filePath) {
  return path.relative(root, filePath) || filePath;
}

function readTextSafe(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (stat.size > MAX_FILE_BYTES) return null;
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function findLineNumber(content, index) {
  return content.slice(0, index).split("\n").length;
}

export function runAudit(rootDir) {
  const detection = detectProject(rootDir);
  const root = detection.root;
  const platforms = new Set(detection.platforms);
  const ignorePatterns = loadIgnorePatterns(root);
  const files = walkFiles(root, root, ignorePatterns);
  const findings = [];

  const add = (severity, category, message, file = null, line = null, fix = null) => {
    findings.push({ severity, category, message, file, line, fix });
  };

  // 1. Committed sensitive files check
  const sensitiveFileRegex = /^(\.env(\..+)?|.*\.(p12|p8|jks|keystore|mobileprovision|pem|key))$/i;
  for (const f of files) {
    const base = path.basename(f);
    if (sensitiveFileRegex.test(base) && !base.endsWith(".example") && !base.endsWith(".sample")) {
      add(
        "BLOCKER",
        "security",
        `Sensitive file present in repository tree: ${base}`,
        rel(root, f),
        null,
        "Ensure this file is gitignored and never committed to source control."
      );
    }
  }

  // 2. Source code scan (secrets, insecure http, placeholders, compliance signals)
  const secretPatterns = [
    { name: "Stripe Live Secret Key", regex: /\bsk_live_[0-9a-zA-Z]{16,}\b/g, severity: "BLOCKER" },
    { name: "AWS Access Key ID", regex: /\bAKIA[0-9A-Z]{16}\b/g, severity: "BLOCKER" },
    { name: "GitHub Personal Access Token", regex: /\bghp_[0-9a-zA-Z]{30,}\b/g, severity: "BLOCKER" },
    { name: "Private Key Block", regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g, severity: "BLOCKER" },
    { name: "OpenAI / Anthropic Secret Key", regex: /\b(?:sk-ant-[a-zA-Z0-9\-_]{20,}|sk-proj-[a-zA-Z0-9\-_]{20,})\b/g, severity: "BLOCKER" },
    { name: "Hardcoded Google API Key", regex: /\bAIza[0-9A-Za-z\-_]{35}\b/g, severity: "WARNING" },
  ];

  const httpRegex = /['"`](http:\/\/(?!localhost\b|127\.0\.0\.1\b|0\.0\.0\.0\b|10\.0\.2\.2\b|schemas\.android\.com|www\.w3\.org|ns\.adobe\.com|example\.com)[^'"`\s]+)['"`]/g;
  const loremRegex = /\blorem ipsum\b/i;

  let totalConsoleLogs = 0;
  let hasSocialLogin = false;
  let hasAppleSignIn = false;
  let hasAuthSignals = false;
  let hasDeleteAccount = false;
  let hasIAP = false;
  let hasRestorePurchases = false;
  let hasPrivacyPolicy = false;
  let dangerousHtmlHits = 0;

  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    if (!SOURCE_EXTS.has(ext)) continue;
    const rPath = rel(root, f);
    if (/(^|\/)(__tests__|tests?|spec|mocks?|fixtures?)\//i.test(rPath) || /\.(test|spec)\.[jt]sx?$/i.test(rPath)) {
      continue;
    }

    const content = readTextSafe(f);
    if (!content) continue;

    // Secrets
    for (const sp of secretPatterns) {
      sp.regex.lastIndex = 0;
      const match = sp.regex.exec(content);
      if (match) {
        add(
          sp.severity,
          "security",
          `Potential ${sp.name} hardcoded in source`,
          rPath,
          findLineNumber(content, match.index),
          "Move secret to server-side environment variables and rotate the exposed credential immediately."
        );
      }
    }

    // Insecure HTTP
    httpRegex.lastIndex = 0;
    const httpMatch = httpRegex.exec(content);
    if (httpMatch) {
      add(
        "WARNING",
        "security",
        `Plaintext HTTP URL detected (${httpMatch[1].slice(0, 60)})`,
        rPath,
        findLineNumber(content, httpMatch.index),
        "Upgrade endpoint to HTTPS to satisfy iOS ATS, Android cleartext restrictions, and browser mixed-content rules."
      );
    }

    // Lorem ipsum placeholder
    const loremMatch = loremRegex.exec(content);
    if (loremMatch) {
      add(
        "BLOCKER",
        "completeness",
        "Placeholder 'Lorem ipsum' copy found in source",
        rPath,
        findLineNumber(content, loremMatch.index),
        "Replace placeholder copy with real production copy before submission."
      );
    }

    // Debug logs count
    const logMatches = content.match(/\bconsole\.log\s*\(/g);
    if (logMatches) totalConsoleLogs += logMatches.length;

    // Dangerous web patterns
    if (/\bdangerouslySetInnerHTML\b|\beval\s*\(/.test(content)) {
      dangerousHtmlHits++;
    }

    // Compliance heuristic signals
    if (/GoogleSignin|GIDSignIn|GoogleAuthProvider|signInWithGoogle|LoginManager|FBSDKLogin|oauth.*google|sign_in_with_google/i.test(content)) {
      hasSocialLogin = true;
    }
    if (/ASAuthorizationAppleIDProvider|AppleAuthentication|SignInWithApple|sign_in_with_apple|apple\.com\/auth/i.test(content)) {
      hasAppleSignIn = true;
    }
    if (/signUp|createUser|registerAccount|createAccount|auth\.signIn|login/i.test(content)) {
      hasAuthSignals = true;
    }
    if (/deleteAccount|delete_account|delete-account|Delete Account|removeAccount|permanently delete/i.test(content)) {
      hasDeleteAccount = true;
    }
    if (/StoreKit|RevenueCat|react-native-iap|react-native-purchases|in_app_purchase|SKPaymentQueue|Purchases\.purchase/i.test(content)) {
      hasIAP = true;
    }
    if (/restorePurchases|restoreCompletedTransactions|restore_purchases|Restore Purchases/i.test(content)) {
      hasRestorePurchases = true;
    }
    if (/privacy[-_\s]?policy|Privacy Policy/i.test(content)) {
      hasPrivacyPolicy = true;
    }
  }

  if (totalConsoleLogs > 15) {
    add(
      "POLISH",
      "hygiene",
      `Found ${totalConsoleLogs} console.log() calls in source files`,
      null,
      null,
      "Strip or gate debug logs behind a development flag to avoid leaking data and slowing down release builds."
    );
  }

  if (platforms.has("web") && dangerousHtmlHits > 0) {
    add(
      "WARNING",
      "security",
      `Found ${dangerousHtmlHits} file(s) using dangerouslySetInnerHTML or eval()`,
      null,
      null,
      "Verify strict sanitization (e.g., DOMPurify) or replace with safe rendering to prevent XSS."
    );
  }

  // 3. iOS-specific checks
  if (platforms.has("ios")) {
    const infoPlists = files.filter(
      (f) => path.basename(f) === "Info.plist" && !/Tests?\//i.test(rel(root, f))
    );
    const hasPrivacyManifest = files.some((f) => path.basename(f) === "PrivacyInfo.xcprivacy");

    if (infoPlists.length > 0 && !hasPrivacyManifest) {
      add(
        "WARNING",
        "ios-app-store",
        "No PrivacyInfo.xcprivacy manifest found in iOS project",
        null,
        null,
        "Add PrivacyInfo.xcprivacy declaring Required Reason APIs (e.g., NSUserDefaults, file timestamps) per Apple Guideline 5.1."
      );
    }

    for (const plist of infoPlists) {
      const content = readTextSafe(plist);
      if (!content) continue;
      const rPath = rel(root, plist);

      if (/<key>NSAllowsArbitraryLoads<\/key>\s*<true\s*\/>/i.test(content)) {
        add(
          "BLOCKER",
          "ios-app-store",
          "NSAllowsArbitraryLoads is enabled globally in Info.plist",
          rPath,
          null,
          "Remove NSAllowsArbitraryLoads or scope exceptions strictly to specific legacy domains."
        );
      }

      if (!/<key>ITSAppUsesNonExemptEncryption<\/key>/i.test(content)) {
        add(
          "POLISH",
          "ios-app-store",
          "ITSAppUsesNonExemptEncryption key not set in Info.plist",
          rPath,
          null,
          "Add ITSAppUsesNonExemptEncryption (<false/> if using only standard HTTPS/TLS) to skip manual export compliance prompts on every build."
        );
      }

      const usageRegex = /<key>(NS[A-Za-z]+UsageDescription)<\/key>\s*<string>([\s\S]*?)<\/string>/g;
      let m;
      while ((m = usageRegex.exec(content)) !== null) {
        const key = m[1];
        const desc = m[2].trim();
        if (desc.length < 15 || /needs access|permission|todo|placeholder/i.test(desc)) {
          add(
            "BLOCKER",
            "ios-app-store",
            `Info.plist permission '${key}' has an empty or overly generic description ("${desc}")`,
            rPath,
            findLineNumber(content, m.index),
            "Write a clear, user-facing explanation of the exact feature that requires this permission (Apple Guideline 5.1.1)."
          );
        }
      }
    }

    // Expo app.json deep checks for iOS
    const appJson = safeReadJson(path.join(root, "app.json"));
    if (appJson?.expo) {
      if (!appJson.expo.ios?.bundleIdentifier) {
        add(
          "BLOCKER",
          "ios-app-store",
          "Missing expo.ios.bundleIdentifier in app.json",
          "app.json",
          null,
          "Set a unique reverse-DNS bundleIdentifier (e.g., com.company.appname) before building for iOS."
        );
      }

      if (appJson.expo.icon && !fs.existsSync(path.join(root, appJson.expo.icon))) {
        add(
          "BLOCKER",
          "ios-app-store",
          `Expo icon path '${appJson.expo.icon}' does not exist on disk`,
          "app.json",
          null,
          "Provide a valid 1024x1024 PNG app icon (without transparency) at the configured path."
        );
      }

      const expoPlist = appJson.expo.ios?.infoPlist;
      if (expoPlist && typeof expoPlist === "object") {
        for (const [key, val] of Object.entries(expoPlist)) {
          if (/^NS[A-Za-z]+UsageDescription$/.test(key)) {
            const desc = String(val || "").trim();
            if (desc.length < 15 || /needs access|permission|todo|placeholder/i.test(desc)) {
              add(
                "BLOCKER",
                "ios-app-store",
                `Expo ios.infoPlist '${key}' has an empty or generic description ("${desc}")`,
                "app.json",
                null,
                "Write a specific explanation of how the app uses this permission."
              );
            }
          }
        }
      }
    }

    // Cross-checks for iOS compliance
    if (hasSocialLogin && !hasAppleSignIn) {
      add(
        "BLOCKER",
        "ios-app-store",
        "Third-party social login detected without Sign in with Apple (Apple Guideline 4.8)",
        null,
        null,
        "Add Sign in with Apple as an equivalent login option alongside Google/Facebook/social login."
      );
    }

    if (hasIAP && !hasRestorePurchases) {
      add(
        "BLOCKER",
        "ios-app-store",
        "In-App Purchases / Subscriptions detected without a 'Restore Purchases' flow (Apple Guideline 3.1.1)",
        null,
        null,
        "Add a clearly visible, working 'Restore Purchases' button on your paywall and/or settings screen."
      );
    }
  }

  // 4. Android-specific checks
  if (platforms.has("android")) {
    const manifests = files.filter(
      (f) => path.basename(f) === "AndroidManifest.xml" && !/debug|test|androidTest/i.test(rel(root, f))
    );

    for (const mf of manifests) {
      const content = readTextSafe(mf);
      if (!content) continue;
      const rPath = rel(root, mf);

      if (/android:debuggable\s*=\s*"true"/i.test(content)) {
        add(
          "BLOCKER",
          "google-play",
          'android:debuggable="true" found in AndroidManifest.xml',
          rPath,
          null,
          "Remove android:debuggable from the manifest; Gradle sets it automatically for debug builds."
        );
      }

      if (/android:usesCleartextTraffic\s*=\s*"true"/i.test(content)) {
        add(
          "BLOCKER",
          "google-play",
          'android:usesCleartextTraffic="true" enabled in main AndroidManifest.xml',
          rPath,
          null,
          "Disable cleartext traffic in release builds and use HTTPS endpoints."
        );
      }

      // Android 12+ requires android:exported on components with <intent-filter>
      const componentRegex = /<(activity|service|receiver)\b([^>]*)>([\s\S]*?)<\/\1>/gi;
      let compMatch;
      while ((compMatch = componentRegex.exec(content)) !== null) {
        const [, tagName, attrs, inner] = compMatch;
        if (/<intent-filter\b/i.test(inner) && !/android:exported\s*=/i.test(attrs)) {
          add(
            "BLOCKER",
            "google-play",
            `<${tagName}> with <intent-filter> is missing android:exported attribute (Android 12+ requirement)`,
            rPath,
            findLineNumber(content, compMatch.index),
            `Explicitly declare android:exported="true" (for launchers/deep links) or android:exported="false" on <${tagName}>.`
          );
        }
      }

      const highRiskPerms = [
        "READ_MEDIA_IMAGES",
        "READ_MEDIA_VIDEO",
        "ACCESS_BACKGROUND_LOCATION",
        "QUERY_ALL_PACKAGES",
        "READ_SMS",
        "MANAGE_EXTERNAL_STORAGE",
      ];
      for (const perm of highRiskPerms) {
        if (content.includes(perm)) {
          add(
            "WARNING",
            "google-play",
            `High-risk Android permission '${perm}' declared in AndroidManifest.xml`,
            rPath,
            null,
            "Verify this permission is strictly required (prefer Android Photo Picker for media) and prepare Play Console policy declarations."
          );
        }
      }
    }

    // Gradle targetSdk check
    const gradleFiles = files.filter((f) => /^build\.gradle(\.kts)?$/.test(path.basename(f)));
    for (const gf of gradleFiles) {
      const content = readTextSafe(gf);
      if (!content) continue;
      const rPath = rel(root, gf);
      const targetMatch = content.match(/targetSdk(?:Version)?\s*(?:=|\s)\s*(\d+)/);
      if (targetMatch) {
        const sdk = parseInt(targetMatch[1], 10);
        if (sdk < 34) {
          add(
            "BLOCKER",
            "google-play",
            `Android targetSdk is ${sdk} (below Google Play minimum requirements)`,
            rPath,
            findLineNumber(content, targetMatch.index),
            "Update targetSdk to API 35 (Android 15) or newer and verify edge-to-edge behavior."
          );
        } else if (sdk === 34) {
          add(
            "WARNING",
            "google-play",
            `Android targetSdk is ${sdk}; Google Play requires API 35+ for new releases/updates`,
            rPath,
            findLineNumber(content, targetMatch.index),
            "Upgrade targetSdk to 35+ and test edge-to-edge WindowInsets."
          );
        }
      }
    }

    // Expo app.json check for Android
    const appJson = safeReadJson(path.join(root, "app.json"));
    if (appJson?.expo && !appJson.expo.android?.package) {
      add(
        "BLOCKER",
        "google-play",
        "Missing expo.android.package in app.json",
        "app.json",
        null,
        "Set a unique Android package name (e.g., com.company.appname) in app.json."
      );
    }
  }

  // 5. Mobile cross-platform compliance checks
  if (platforms.has("ios") || platforms.has("android")) {
    if (hasAuthSignals && !hasDeleteAccount) {
      add(
        "WARNING",
        "compliance",
        "Account authentication detected, but no in-app Account Deletion flow was found in source",
        null,
        null,
        "Both Apple (Guideline 5.1.1(v)) and Google Play require an in-app Account Deletion option if users can create accounts."
      );
    }
    if (!hasPrivacyPolicy) {
      add(
        "WARNING",
        "compliance",
        "No Privacy Policy reference found in application source",
        null,
        null,
        "Link a live HTTPS Privacy Policy inside Settings and on Sign-up / Paywall screens."
      );
    }
  }

  // 6. Web launch checks
  if (platforms.has("web")) {
    const robotsFile = files.find((f) => /^robots\.(txt|ts|js)$/i.test(path.basename(f)));
    const sitemapFile = files.find((f) => /^sitemap\.(xml|ts|js)$/i.test(path.basename(f)));
    const faviconFile = files.find((f) => /^(favicon\.|icon\.(svg|png|ico))/i.test(path.basename(f)));
    const notFoundFile = files.find((f) => /^(not-found|404)\.(tsx|jsx|ts|js|vue|svelte|astro|html)$/i.test(path.basename(f)));
    const indexHtml = files.find((f) => path.basename(f) === "index.html");

    if (!robotsFile) {
      add("WARNING", "web-launch", "No robots.txt (or robots.ts) found", null, null, "Add robots.txt to control search engine indexing.");
    } else if (robotsFile.endsWith(".txt")) {
      const robotsContent = readTextSafe(robotsFile) || "";
      if (/User-agent:\s*\*\s*\r?\n\s*Disallow:\s*\/\s*($|\r?\n)/i.test(robotsContent)) {
        add(
          "BLOCKER",
          "web-launch",
          "robots.txt currently blocks all crawlers (Disallow: /)",
          rel(root, robotsFile),
          null,
          "Allow indexing in production unless this site is intentionally private."
        );
      }
    }

    if (indexHtml) {
      const htmlContent = readTextSafe(indexHtml) || "";
      const rHtml = rel(root, indexHtml);
      if (/<html(?![^>]*\blang\s*=)/i.test(htmlContent)) {
        add("WARNING", "web-launch", "Missing lang attribute on <html> element", rHtml, null, 'Add lang="en" (or your primary locale) to <html> for accessibility and SEO.');
      }
      if (!/<meta[^>]+name=["']description["']/i.test(htmlContent)) {
        add("WARNING", "web-launch", 'Missing <meta name="description"> in index.html', rHtml, null, "Add a concise 120–160 character meta description.");
      }
      if (!/<meta[^>]+property=["']og:image["']/i.test(htmlContent)) {
        add("POLISH", "web-launch", 'Missing Open Graph <meta property="og:image"> in index.html', rHtml, null, "Add an absolute 1200x630 og:image URL for crisp social link previews.");
      }
    }

    if (!sitemapFile) {
      add("WARNING", "web-launch", "No sitemap.xml (or sitemap.ts) found", null, null, "Add a sitemap for discoverability on public web apps.");
    }
    if (!faviconFile) {
      add("POLISH", "web-launch", "No favicon / app icon detected", null, null, "Add favicon.ico / SVG icon and apple-touch-icon.png.");
    }
    if (!notFoundFile) {
      add("WARNING", "web-launch", "No custom 404 / not-found page detected", null, null, "Add a styled 404 page with a clear navigation link home.");
    }
  }

  const order = { BLOCKER: 0, WARNING: 1, POLISH: 2 };
  findings.sort((a, b) => order[a.severity] - order[b.severity]);

  const summary = {
    blockers: findings.filter((f) => f.severity === "BLOCKER").length,
    warnings: findings.filter((f) => f.severity === "WARNING").length,
    polish: findings.filter((f) => f.severity === "POLISH").length,
  };

  return { detection, summary, findings };
}

export function formatMarkdownReport(report) {
  const lines = [
    `## zedev-skill Pre-Flight Audit`,
    ``,
    `- **Platforms:** ${report.detection.platforms.join(", ") || "none detected"}`,
    `- **Frameworks:** ${report.detection.frameworks.join(", ") || "none detected"}`,
    `- **Summary:** **${report.summary.blockers} BLOCKER** · **${report.summary.warnings} WARNING** · **${report.summary.polish} POLISH**`,
    ``,
  ];

  if (report.findings.length === 0) {
    lines.push("No static issues detected. Proceed with manual runtime & checklist verification.");
    return lines.join("\n");
  }

  lines.push("| Severity | Category | Finding | Location |");
  lines.push("| :--- | :--- | :--- | :--- |");
  for (const f of report.findings) {
    const loc = f.file ? `\`${f.file}${f.line ? `:${f.line}` : ""}\`` : "—";
    lines.push(`| **${f.severity}** | \`${f.category}\` | ${f.message.replace(/\|/g, "\\|")} | ${loc} |`);
  }
  lines.push("");
  return lines.join("\n");
}

// CLI execution
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const args = process.argv.slice(2);
  const jsonFlag = args.includes("--json");
  const mdFlag = args.includes("--markdown") || args.includes("--md");
  const targetDir = args.find((a) => !a.startsWith("-")) || process.cwd();
  const report = runAudit(targetDir);

  if (jsonFlag) {
    console.log(JSON.stringify(report, null, 2));
  } else if (mdFlag) {
    console.log(formatMarkdownReport(report));
  } else {
    console.log(`\n=== zedev-skill Pre-Flight Audit ===`);
    console.log(`Project:    ${report.detection.root}`);
    console.log(`Platforms:  ${report.detection.platforms.join(", ") || "none detected"}`);
    console.log(`Frameworks: ${report.detection.frameworks.join(", ") || "none detected"}`);
    console.log(
      `Summary:    ${report.summary.blockers} BLOCKER | ${report.summary.warnings} WARNING | ${report.summary.polish} POLISH\n`
    );

    if (report.findings.length === 0) {
      console.log("No static issues detected. Proceed with manual runtime & checklist verification.");
    } else {
      for (const f of report.findings) {
        const loc = f.file ? ` (${f.file}${f.line ? `:${f.line}` : ""})` : "";
        console.log(`[${f.severity}] [${f.category}] ${f.message}${loc}`);
        if (f.fix) console.log(`   -> Fix: ${f.fix}`);
      }
    }
    console.log("");
  }

  process.exit(report.summary.blockers > 0 ? 1 : 0);
}
