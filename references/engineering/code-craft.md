# Engineering Craft, Architecture & Performance

Write code that is boringly reliable, easy to reason about, fast in real-world conditions, and simple for the next engineer to modify.

---

## 1. Architecture & Maintainability

- **Cohesion over premature abstraction**: Group code by feature/domain rather than scattering a single flow across 10 shallow utility files. Only extract a shared abstraction once there are 2–3 real, non-trivial call sites.
- **Clear boundaries**: Separate UI rendering, business logic, and I/O (network, database, filesystem, native APIs) so business logic can be tested without mocking the entire UI framework.
- **Strict typing & contracts**: Validate external inputs at system boundaries (API responses, form payloads, deep links, environment variables) using schemas or strict runtime guards—never blindly trust external JSON or route params.
- **Predictable naming**: Name files, functions, and variables after what they represent in the domain, not generic buckets (`helpers.ts`, `utils2.ts`, `data`, `temp`).
- **Clean diffs**: Remove dead code, commented-out blocks, unused imports, and debug logs before finishing.

---

## 2. Resilience & Error Handling

- **Fail loudly at boundaries, recover gracefully in UI**:
  - Never write empty `catch {}` blocks that swallow errors silently.
  - Log structured diagnostic context internally (without leaking PII or secrets) and surface actionable, user-friendly messages in the UI.
- **Idempotency & race conditions**:
  - Guard against duplicate form submissions, double taps on payment/checkout buttons, and stale async responses (use `AbortController`, request IDs, or query libraries that handle cancellation).
- **Resource cleanup**:
  - Always clean up event listeners, WebSockets, intervals, subscriptions, file handles, and camera/location streams on unmount or shutdown.
- **Network resilience**:
  - Set sensible timeouts on HTTP requests.
  - Handle pagination, empty arrays, null fields, and HTTP 401/403/429/5xx explicitly.

---

## 3. Performance Fundamentals

- **Main-thread hygiene**: Keep UI frames smooth (60/120fps). Move heavy parsing, image compression, encryption, or large list filtering off the render path.
- **Lists & media**:
  - Virtualize long lists (`FlatList`/`FlashList`, `RecyclerView`, `LazyVStack`, `ListView.builder`, virtual tables).
  - Resize and compress images (WebP/AVIF on web, properly scaled `@2x/@3x` or vector assets on mobile), lazy-load offscreen media, and reserve aspect-ratio dimensions to avoid layout shift.
- **Bundle & startup time**:
  - Avoid importing entire monolithic libraries when a single function or native API exists.
  - Defer non-critical SDK initialization (analytics, secondary tabs, heavy modals) until after the first meaningful frame.
- **Database & API efficiency**:
  - Eliminate N+1 queries, index frequently filtered/sorted columns, paginate large collections, and cache immutable or slow-changing responses cleanly.

---

## 4. Testing & Verification

- Write targeted tests for high-risk logic: auth, billing/entitlements, state transitions, data transformations, and edge cases (empty, boundary, malformed input).
- Before declaring a task done, run the project's actual type-checker, linter, build, and relevant tests—never assume code compiles cleanly.
