import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { detectProject } from "../scripts/detect-project.mjs";
import { runAudit, formatMarkdownReport } from "../scripts/preflight-audit.mjs";

function makeTempProject(files) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "zedev-skill-test-"));
  for (const [relPath, content] of Object.entries(files)) {
    const full = path.join(dir, relPath);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content, "utf8");
  }
  return dir;
}

test("detectProject identifies Expo / React Native mobile stack", () => {
  const dir = makeTempProject({
    "package.json": JSON.stringify({ dependencies: { expo: "52.0.0", "react-native": "0.76.0" } }),
    "app.json": JSON.stringify({ expo: { name: "Demo" } }),
  });

  try {
    const result = detectProject(dir);
    assert.ok(result.platforms.includes("expo"));
    assert.ok(result.platforms.includes("ios"));
    assert.ok(result.platforms.includes("android"));
    assert.ok(result.recommendedReferences.audit.includes("references/audit/ios-app-store.md"));
    assert.ok(result.recommendedReferences.audit.includes("references/audit/google-play.md"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("runAudit flags iOS, Android, Expo, and compliance blockers", () => {
  const dir = makeTempProject({
    "package.json": JSON.stringify({ dependencies: { expo: "52.0.0", "react-native": "0.76.0" } }),
    "app.json": JSON.stringify({
      expo: {
        name: "Demo",
        icon: "./assets/missing-icon.png",
        ios: { infoPlist: { NSCameraUsageDescription: "App needs access" } },
      },
    }),
    "ios/Info.plist": `<plist><dict>
      <key>NSAllowsArbitraryLoads</key><true/>
      <key>NSPhotoLibraryUsageDescription</key><string>TODO</string>
    </dict></plist>`,
    "android/app/src/main/AndroidManifest.xml": `<manifest><application android:debuggable="true" android:usesCleartextTraffic="true">
      <activity android:name=".MainActivity">
        <intent-filter><action android:name="android.intent.action.MAIN"/></intent-filter>
      </activity>
    </application></manifest>`,
    "android/app/build.gradle": `android { defaultConfig { targetSdkVersion 33 } }`,
    "src/App.tsx": `
      import { GoogleSignin } from "google";
      import Purchases from "react-native-purchases";
      export const hero = "Lorem ipsum dolor sit amet";
      export const endpoint = "http://api.example-prod.io/v1";
    `,
  });

  try {
    const report = runAudit(dir);
    const messages = report.findings.map((f) => f.message);

    assert.ok(report.summary.blockers >= 8, `Expected >= 8 blockers, got ${report.summary.blockers}`);
    assert.ok(messages.some((m) => m.includes("NSAllowsArbitraryLoads")));
    assert.ok(messages.some((m) => m.includes("NSPhotoLibraryUsageDescription")));
    assert.ok(messages.some((m) => m.includes("missing-icon.png")));
    assert.ok(messages.some((m) => m.includes("Sign in with Apple")));
    assert.ok(messages.some((m) => m.includes("Restore Purchases")));
    assert.ok(messages.some((m) => m.includes('android:debuggable="true"')));
    assert.ok(messages.some((m) => m.includes("missing android:exported")));
    assert.ok(messages.some((m) => m.includes("targetSdk is 33")));
    assert.ok(messages.some((m) => m.includes("Lorem ipsum")));

    const md = formatMarkdownReport(report);
    assert.ok(md.includes("## zedev-skill Pre-Flight Audit"));
    assert.ok(md.includes("| **BLOCKER** |"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("runAudit respects .zedevignore and passes clean web project with zero blockers", () => {
  const dir = makeTempProject({
    "package.json": JSON.stringify({ dependencies: { vite: "6.0.0", react: "19.0.0", "react-dom": "19.0.0" } }),
    "index.html": `<!doctype html><html lang="en"><head>
      <meta name="description" content="A clean production web app." />
      <meta property="og:image" content="https://example.com/og.png" />
    </head><body></body></html>`,
    "public/robots.txt": "User-agent: *\nAllow: /\n",
    "public/sitemap.xml": "<urlset></urlset>",
    "public/favicon.ico": "ico",
    "src/404.tsx": "export default function NotFound() { return null; }",
    "src/ignored-demo.ts": 'export const sample = "Lorem ipsum";',
    ".zedevignore": "src/ignored-demo.ts\n",
  });

  try {
    const report = runAudit(dir);
    assert.equal(report.summary.blockers, 0, `Expected 0 blockers, got: ${JSON.stringify(report.findings)}`);
    assert.equal(report.summary.warnings, 0, `Expected 0 warnings, got: ${JSON.stringify(report.findings)}`);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});
