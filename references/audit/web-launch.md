# Web & SaaS Pre-Launch Audit Checklist

Use this checklist before deploying a web application, landing page, or SaaS product to production.

---

## 1. Security & Production Hygiene (`BLOCKER`)

- **No exposed server secrets**: Audit `NEXT_PUBLIC_*`, `VITE_*`, `REACT_APP_*`, and client bundles to guarantee no private API keys, database URLs, or signing secrets leak to the browser.
- **HTTPS & Security Headers**: Enforce HTTPS redirects and configure `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options` (or CSP `frame-ancestors`), and a sensible `Content-Security-Policy`.
- **Auth & API protection**: Verify every mutation and private route checks authentication + authorization on the server, validates input schemas, and applies rate limiting on auth/AI/contact endpoints.
- **Zero debug leaks**: Remove `console.log` of sensitive objects, exposed source maps (unless intentionally uploaded privately to Sentry), and mock/bypass auth flags.

---

## 2. SEO, Metadata & Social Sharing (`WARNING`)

- **Document metadata**: Every public route has a unique, concise `<title>` (50–60 chars) and `<meta name="description">` (120–160 chars).
- **Open Graph & Twitter/X Cards**: Include `og:title`, `og:description`, `og:image` (1200×630px, absolute HTTPS URL), `og:url`, `og:type`, and `twitter:card="summary_large_image"`.
- **Canonical URLs & Crawlability**:
  - Set `<link rel="canonical">` to avoid duplicate-content penalties.
  - Provide `/robots.txt` and `/sitemap.xml` (ensure staging/preview environments return `noindex` and production does **not** accidentally block crawlers with `Disallow: /`).
- **Icons & Manifest**: Provide `favicon.ico` / SVG favicon, `apple-touch-icon.png` (180×180), and `site.webmanifest` (for PWAs or installable web apps).
- **Language attribute**: Set `<html lang="...">` accurately.

---

## 3. Reliability, Routing & UX Completeness (`BLOCKER` / `WARNING`)

- **Custom error pages**: Provide styled, helpful `404` and `500` / error-boundary pages with a working link back to safety.
- **Zero broken links & assets**: Verify internal routes, external legal links, images, and fonts load with `200 OK`.
- **Forms & emails**: Test real form submissions, validation errors, transactional emails (SPF/DKIM/DMARC configured), and webhook endpoints in production/staging.
- **Mobile & Cross-Browser**: Verify layout at `375px`, `768px`, and `1440px` across Chrome, Safari, and Firefox; confirm zero horizontal scrollbars.

---

## 4. Performance & Core Web Vitals (`WARNING` / `POLISH`)

- **LCP (Largest Contentful Paint < 2.5s)**: Preload hero image/font, serve modern formats (WebP/AVIF) with explicit `width`/`height`, and avoid render-blocking scripts.
- **CLS (Cumulative Layout Shift < 0.1)**: Reserve space for images, embeds, banners, and dynamically loaded UI; use `font-display: swap` or matched fallback fonts.
- **INP (Interaction to Next Paint < 200ms)**: Keep client bundles lean, code-split heavy routes/charts/editors, and avoid long synchronous tasks on user input.
- **Observability**: Configure production error monitoring (e.g., Sentry) and basic uptime/health checks (`/api/health`) before launch.
