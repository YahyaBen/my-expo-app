---
name: template-skill-performance
description: Measure and improve native startup, scrolling, animation and idle resource usage.
---

# Native performance

Define one reproducible interaction and record its device, build, dataset and
measurement. Compare release builds under the same conditions. Historical reports
and development render highlighting identify leads, not measured current regressions.
Use the [performance guide](../../../docs/performance.md) for scenarios and results.

| Area             | Inspect and preserve                                                                                                                                                                               |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Startup          | Separate preference/font/session readiness, native layout, configured launch presentation and interactivity. Measure first-use cost when deferring work; keep recovery reachable.                  |
| Motion and idle  | Inspect native blur/mask consumers as well as the shared clock. React freezing alone does not stop native animation. Preserve focus, AppState, background/resume and Reduce Motion guards.         |
| Collections      | Measure actual row count, geometry and native Host/cell costs. Grouped List and bounded Table serve different purposes from a virtualized feed. Keep one feed scrolling owner.                     |
| Updates and data | Profile subscriptions and derived work before memoizing or splitting providers. Preserve equal-auth-snapshot suppression, cancellation, session guards, exact refresh keys and bounded pagination. |
| Media            | Measure payload, decoding, caching and retained memory on the affected feature. Use display-sized assets and stable geometry where useful.                                                         |

Make the smallest change supported by evidence. Preserve branding, native hosting,
RTL, safe areas and accessibility. Performance work does not imply an SDK upgrade,
redesign, replacement state system or new dependency.

Run lint and typecheck, then repeat the same measurement and affected interaction
checks. Record before/after results and verification limits. Without a device,
complete useful static analysis or instrumentation and mark native measurements
as pending; do not claim faster frames from source inspection.
