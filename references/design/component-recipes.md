# High-Craft Component Recipes

Apply these concrete composition and density rules whenever building or refining specific UI components so every screen looks intentionally art-directed rather than assembled from generic defaults.

---

## 1. Navigation (Web Topbar / Sidebar & Mobile Tab Bar)

- **Web Topbar**: Height `56–64px`, subtle `1px` bottom border (or translucent backdrop blur on scroll), max **4–6** top-level links, **1** primary CTA on the right. Never crowd the header with search bar + 4 icon buttons + 2 solid CTAs.
- **Web Sidebar (SaaS / Dashboard)**: Width `240–260px` (collapsible to `64–72px`), grouped into 2–3 logical sections with subtle uppercase/muted section labels (`11–12px`), active item indicated by a soft tonal pill + crisp text weight (never harsh saturated blocks).
- **Mobile Tab Bar**: Strictly **3–5** top-level destinations. Consistent icon stroke weight, clear active vs. inactive contrast, short 1-word labels. Never put a hamburger menu on mobile when a Tab Bar fits.

---

## 2. Hero & Marketing Sections (Web / Onboarding)

- **Headline discipline**: 5–9 concrete words, tight line-height (`1.05–1.15`), slight negative tracking (`-0.02em` to `-0.03em`).
- **Subheadline**: Max 1–2 short sentences (`max-width: 56ch`) in muted secondary text.
- **CTA budget**: Maximum **2** buttons — 1 high-contrast solid primary CTA + 1 quiet secondary CTA (ghost/outline/text).
- **Visual proof over fluff**: Showcase a crisp, real product interface preview, interactive demo, or clean screenshot rather than generic floating 3D shapes, abstract purple blobs, or stock handshake photos.

---

## 3. Cards & Information Density

- **Data point cap**: Maximum **3–4** distinct pieces of information per card (e.g., Title, Subtitle/Meta, Key Value/Status, Optional Action). If a card needs more, promote it to a detail view or table row.
- **No nested cards**: Avoid placing bordered cards inside bordered cards; use spacing and hairline dividers instead.
- **Padding & radius harmony**:
  - Card padding: `16px` (compact/mobile) to `24px` (desktop).
  - Inner corner radius rule: `innerRadius = outerRadius - padding` (or visibly tighter than the parent container) so nested buttons/media look optically concentric.
- **Restrained badges**: Maximum 1 status badge per card; use soft tinted backgrounds (10–15% opacity) with crisp readable foreground text.

---

## 4. Dashboards, KPIs & Data Tables

- **KPI / Metric cards**: Label on top (`12–13px`, muted), large tabular figure (`28–36px`, `font-variant-numeric: tabular-nums`), concise delta indicator (`+12.4% vs last 30d` with directional icon). Keep all KPI cards in a row identical in height and structure.
- **Data tables**:
  - Left-align text columns; **right-align** numeric, currency, and percentage columns (with `tabular-nums`).
  - Row height `48–56px`, subtle horizontal row dividers (no heavy vertical grid lines), sticky header on scroll, subtle hover state.
  - Keep row actions quiet (reveal on hover on desktop, or a single clean `•••` overflow menu accessible on touch).

---

## 5. Paywalls & Pricing Tables

- **Clarity builds trust**: Make the actual billed price the most prominent number (`$49.99 / year`), with optional per-month equivalence clearly secondary.
- **Recommended tier**: Highlight 1 plan using a crisp accent border (`1.5–2px`) and a clean `"Most Popular"` pill — avoid garish rainbow borders or flashing countdown timers.
- **Store-safe footer (Mobile)**: Always include clearly tappable **Restore Purchases**, **Terms of Use**, and **Privacy Policy** links directly beneath the primary CTA, plus concise auto-renewal disclosure.

---

## 6. Forms, Settings, Modals & Sheets

- **Forms**: Single-column layout for focus (`max-width: 480–560px` on desktop), grouped into logical sections with clear headings, generous vertical gap (`16–20px` between fields, `6–8px` between label and input).
- **Settings screens**: Inset grouped rows with consistent icon/label/chevron alignment. Isolate destructive actions (`Log Out`, `Delete Account`) in a clearly separated bottom section.
- **Modals & Sheets**:
  - Desktop modal width: `400–520px` for confirmations/forms; `640–760px` for rich previews.
  - Clear title + concise body + max 2 footer buttons aligned consistently (`Cancel` secondary + `Confirm` primary/destructive).
  - Mobile bottom sheets: visible drag handle, rounded top corners (`20–24px`), safe-area bottom padding.
