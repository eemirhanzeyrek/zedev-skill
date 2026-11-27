# Universal Design Taste & Visual Craft

Apply these standards to every UI—mobile, web, or desktop—so the product feels intentionally designed, timeless, and cohesive rather than assembled from generic templates.

---

## 1. Visual Hierarchy & Layout Discipline

- **One focal point per screen/section**: Every viewport must have a single unmistakable primary action or focal element. Secondary actions must visually recede (ghost, text, or muted surface).
- **Consistent spacing rhythm**: Use a strict 4px/8px spatial scale (`4, 8, 12, 16, 24, 32, 48, 64`). Related items sit closer together (8–12px); distinct groups separate clearly (24–48px).
- **Generous breathing room**: Never cram borders, badges, and micro-copy into tight boxes. Whitespace is an active structural element, not wasted space.
- **Alignment & optical balance**: Align edges on a clear grid. Adjust icon + text baselines optically, and keep padding inside cards and buttons symmetrical (horizontal padding slightly larger than vertical padding on buttons, e.g., `12px 20px`).
- **Restrained surface layering**: Limit elevation to 2–3 distinct levels (canvas, raised surface, floating overlay). Prefer subtle 1px hairline borders or gentle tonal contrast over heavy drop shadows.

---

## 2. Typography

- **Clear typographic scale**: Limit each screen to 3–4 distinct sizes (Display/Page Title, Section Heading, Body, Caption/Meta). Differentiate hierarchy with weight, size, and color opacity—not by introducing multiple unrelated font families.
- **Readable line length & height**:
  - Body text: 15–17px on mobile/web, line-height `1.45–1.6`, max measure `55–70ch` for reading blocks.
  - Headings: tighter line-height (`1.1–1.25`) and slightly tighter letter-spacing (`-0.01em` to `-0.03em`) on large display text.
  - Tabular numbers (`font-variant-numeric: tabular-nums`) for prices, counters, timers, tables, and metrics so digits never jitter.
- **No all-caps abuse**: Reserve uppercase for short micro-labels (11–12px with `+0.04em` to `+0.08em` tracking).
- **High-craft font pairings** (pick one cohesive system, never mix 3+ families):
  - *Native Mobile*: **SF Pro** (iOS) / **Roboto** or **Google Sans** (Android) — system fonts render sharpest, support Dynamic Type natively, and feel immediately trustworthy.
  - *Modern Product / SaaS (Web)*: **Geist** or **Inter** (UI + Headings) paired with **Geist Mono** / **JetBrains Mono** (code, IDs, metrics).
  - *Editorial / Brand-Forward (Web)*: **Instrument Serif** or **Newsreader** (Display headings) paired with **Inter** or **Plus Jakarta Sans** (clean UI body).

---

## 3. Color System & Contrast

- **60 / 30 / 10 rule**:
  - ~60% neutral background / canvas
  - ~30% secondary surfaces, text hierarchy, borders
  - ~10% primary brand accent reserved for interactive focus and primary CTAs
- **Semantic tokens only**: Define colors by role (`surface`, `surface-elevated`, `text-primary`, `text-secondary`, `border-subtle`, `accent`, `danger`, `warning`, `success`), never scattered raw hex literals.
- **Neutral surface ladders (reference baseline)**:
  - *Light Mode*: Canvas `#FFFFFF` or `#FAFAFB`, subtle secondary `#F4F5F7`, hairline border `rgba(0, 0, 0, 0.08)`, primary text `#111318`, secondary text `#5C6370`.
  - *Dark Mode*: Canvas `#0B0D10`, elevated surface `#13171D`, floating popover `#1B2028`, hairline border `rgba(255, 255, 255, 0.09)`, primary text `#F3F4F6`, secondary text `#9CA3AF`.
- **Dark & Light mode parity**:
  - Desaturate vibrant accents slightly in dark mode so they don't vibrate against dark surfaces.
- **Contrast non-negotiables**: At least **4.5:1** for body text and **3:1** for large text, icons, and input borders (WCAG AA).

---

## 4. Anti-Cliché Checklist (Avoiding "AI Template" UI)

Explicitly avoid these low-craft patterns unless the user specifically asks for them:
- Gratuitous purple-to-cyan gradients on every hero, button, and card.
- Neon glow box-shadows and glassmorphism stacked over noisy backgrounds.
- Overcrowded "bento grids" where every tile has a random icon, badge, and 3 lines of marketing fluff.
- Generic stock marketing copy ("Supercharge your workflow", "Unlock the power of AI", "Seamless synergy"). Write concise, concrete, user-centric copy.
- Decorative icons that add no meaning or inconsistent icon stroke weights/libraries mixed on the same screen.
- Fake metrics, placeholder `Lorem ipsum`, or unstyled default browser form controls.

---

## 5. Motion & Micro-Interactions

- **Purposeful motion only**: Every animation must clarify spatial continuity, confirm an action, or guide attention—never delay the user.
- **Snappy durations**:
  - Micro-feedback (button press, toggle, checkbox): `100–150ms`
  - UI transitions (modals, sheets, tabs, drawers): `200–300ms`
  - Use natural deceleration easing (`cubic-bezier(0.2, 0.8, 0.2, 1)` or platform spring physics).
- **Respect reduced motion**: Honor `prefers-reduced-motion` (web) and system Reduce Motion settings (iOS/Android) by replacing spatial movement with subtle opacity fades.

---

## 6. Concrete Do / Don't Reference

| Area | Don't (Generic / Low-Craft) | Do (Intentional / Production) |
| :--- | :--- | :--- |
| **Hero / CTA Copy** | *"Supercharge your workflow with seamless AI synergy."* | *"Audit your app for App Store rejections in 10 seconds."* |
| **Action Hierarchy** | Three filled solid buttons side-by-side (`Save`, `Share`, `Delete`). | One solid primary (`Save`), one subtle secondary (`Share`), destructive action separated (`Delete`). |
| **Paywall Pricing** | Tiny gray `"$59.99/year"` under giant `"$4.99/mo"`. | Clear billed price (`$59.99 / year`) as the primary figure, with secondary per-month context and visible `Restore Purchases`. |
| **Card Surfaces** | Heavy drop shadow + glowing gradient border + 4 colored badges per card. | Crisp 1px subtle border or light tonal elevation, generous internal padding (`16–24px`), max 1 status indicator. |

---

## 7. The 5-Second Visual Craft Self-Audit

Before finalizing any UI, verify all five checks:
1. **Squint Test**: If you squint at the screen, does one unmistakable primary focal point/CTA stand out immediately?
2. **Density Cap**: Does every card stay within 3–4 data points, with clear whitespace separating unrelated sections?
3. **Alignment & Optical Rhythm**: Are edges aligned to a consistent grid and spacing multiples of 4/8px?
4. **Zero Slop**: Are all generic gradients, neon glows, filler marketing buzzwords, and unstyled defaults eliminated?
5. **Real-World Stress**: Does it still look composed with a 40-character username, an empty list, dark mode enabled, and a 375px viewport?


