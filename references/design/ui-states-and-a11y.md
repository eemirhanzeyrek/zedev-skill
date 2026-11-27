# UI States, Responsiveness & Accessibility

A polished interface is judged by how it handles imperfect conditions—slow networks, empty accounts, long names, small screens, and assistive technologies.

---

## 1. The 5 Required UI States

Every data-driven screen or component must handle all applicable states explicitly:

1. **Default / Populated**: Real-looking hierarchy, graceful text truncation (`ellipsis` or clean wrapping) for long usernames, titles, and localized strings.
2. **Loading**:
   - Use layout-matched skeletons for initial page/list loads to prevent layout shift (CLS).
   - Use inline spinners with disabled state on submitted buttons to prevent double-submission.
   - Avoid flashing spinners for sub-200ms operations when possible.
3. **Empty**:
   - Never leave a blank white/black screen.
   - Show a concise explanation of what belongs here and a single clear primary CTA (e.g., "Create your first project") or reset filter button when an empty state comes from search/filtering.
4. **Error**:
   - Explain what failed in plain language (never raw stack traces, `undefined`, or `HTTP 500`).
   - Always provide a recovery path: **Retry** button, **Go Back**, or **Contact Support**.
5. **Offline / Degraded Network** (critical for mobile & PWAs):
   - Detect connectivity loss gracefully, display a non-blocking banner or inline notice, preserve unsaved user input, and retry cleanly when back online.

---

## 2. Forms & Interactive Controls

- Always pair inputs with visible labels (never rely solely on placeholders, which vanish on typing).
- Show clear focus rings (`:focus-visible`) for keyboard navigation; never set `outline: none` without a visible replacement.
- Validate inline on blur or submit with specific, helpful error messages positioned directly under the field.
- Use appropriate input types and keyboard hints (`email`, `tel`, `numeric`, `url`, `autocomplete`, `returnKeyType`, `textContentType`) so autofill and mobile keyboards work seamlessly.
- Protect destructive actions (delete account, revoke key, clear data) with clear confirmation dialogs that name the consequence explicitly.

---

## 3. Responsiveness & Layout Resilience

- **No horizontal overflow**: Test mental layout at `320px`–`375px` (small phones), `768px` (tablets), and `1280px+` (desktop).
- **Safe areas**: Respect iOS notches, Dynamic Island, home indicators, and Android edge-to-edge system bars (`SafeAreaView`, `env(safe-area-inset-*)`, `WindowInsets`).
- **Keyboard avoidance**: Inputs near the bottom of a screen must never be obscured by the on-screen keyboard.
- **Dynamic font scaling**: Avoid fixed pixel heights on containers holding text; allow text to grow up to 200% (Dynamic Type / Android font scale / browser zoom) without clipping or overlapping.

---

## 4. Accessibility (a11y) Baseline

- **Touch targets**: Minimum `44×44pt` on iOS, `48×48dp` on Android, and `40×40px` on web touch surfaces.
- **Screen readers**:
  - Every icon-only button must have an `aria-label` / `accessibilityLabel` / `contentDescription`.
  - Decorative images use empty alt text (`alt=""`) or are hidden from accessibility trees; meaningful images describe their content.
  - Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<header>`, `<label>`, heading hierarchy `h1` → `h2` → `h3`) rather than clickable `<div>`s.
- **Color is never the sole indicator**: Pair error/status colors with icons or text labels for color-blind users.
- **Keyboard traps**: Modals and drawers must trap focus while open, close on `Escape`, and return focus to the triggering element on close.

---

## 5. Concrete State Copy Examples

- **Empty State**
  - *Don't*: `"No data found."`
  - *Do*: `"No invoices yet"` + `"Create your first invoice to start tracking payments."` + `[New Invoice]` button.
- **Error State**
  - *Don't*: `"Error 500: TypeError: Cannot read properties of undefined"`
  - *Do*: `"We couldn't load your projects. Check your connection and try again."` + `[Retry]` button.
- **Destructive Confirmation**
  - *Don't*: `"Are you sure? [Cancel] [OK]"`
  - *Do*: `"Delete account permanently? All saved projects and billing history will be erased."` + `[Cancel]` `[Delete Account]`.

