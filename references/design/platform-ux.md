# Platform-Native UX Conventions

Great products feel at home on the platform they run on. Follow these platform-specific conventions when building or auditing UI.

---

## 1. iOS (SwiftUI / UIKit / React Native / Flutter on iOS)

- **Navigation**: Bottom Tab Bar (3–5 top-level destinations), standard back-swipe gesture from the left edge, and large navigation titles that collapse smoothly on scroll.
- **Modals & Sheets**: Use native sheet detents (medium/large) with drag indicators for contextual tasks; keep destructive actions clearly separated in action sheets or confirmation dialogs.
- **Haptics**: Use subtle, meaningful haptic feedback (`selection`, `impactLight`, `notificationSuccess/Error`) on key interactions—never spam haptics on every scroll or tap.
- **System integration**: Support Dynamic Type, Dark Mode, Safe Areas, iPad/landscape layout adaptation (especially if iPad is enabled in project targets—Apple rejects stretched iPhone-only layouts on iPad!), and Sign in with Apple whenever third-party social login is offered.
- **No Android-isms on iOS**: Avoid Material floating action buttons (FABs) when a navigation bar action fits better, and avoid "Exit app" buttons (iOS users never "quit" apps via an in-app button).

---

## 2. Android (Jetpack Compose / XML / React Native / Flutter on Android)

- **Edge-to-Edge & System Bars**: Draw behind transparent status and navigation bars properly with `WindowInsets` padding (mandatory on Android 15 / API 35+).
- **Predictive Back Navigation**: Respect the system back gesture/button cleanly—never trap users in screens or unexpectedly exit without confirmation when unsaved changes exist.
- **Material 3 Patterns**: Use clear tonal surface hierarchy, bottom navigation bar (3–5 items) or navigation rail on tablets/foldables, snackbars with undo actions for reversible operations, and `48×48dp` minimum touch targets.
- **Adaptive Icons**: Provide foreground + background adaptive icon layers (plus monochrome layer for themed icons) so the icon never gets awkwardly cropped inside circles, squircles, or rounded squares.
- **Hardware & Density Diversity**: Avoid hardcoding screen widths or assuming a single aspect ratio; test layouts against narrow phones, large phones, and tablets.

---

## 3. Web & SaaS (React, Next.js, Vue, Svelte, Astro, etc.)

- **URL as state**: Filters, tabs, pagination, and modal/detail views should be shareable and work with browser Back/Forward navigation.
- **Instant feedback & navigation**: Use real `<a href>` links for navigation (so Cmd/Ctrl-click, right-click open in new tab, and hover previews work).
- **Desktop + Mobile ergonomics**:
  - Hover states must never be required to discover or trigger critical functionality on touch devices.
  - Support keyboard shortcuts where natural (`Cmd/Ctrl+K` for search/command palette, `Escape` to close modals).
- **Forms & Tables**: Sticky headers on long tables, horizontal scroll containers on mobile tables (or responsive card transformation), and clear inline feedback on async mutations.

---

## 4. Desktop (Electron / Tauri / macOS / Windows)

- Respect native window chrome, title bar drag regions, standard OS shortcuts (`Cmd` on macOS, `Ctrl` on Windows/Linux), and window resize minimums.
- Support native menus, drag-and-drop where appropriate, and crisp rendering on HiDPI / Retina displays.
