---
name: template-skill-performance
description: Measure and improve native startup, scrolling, animation and idle resource usage.
---

# Native performance

Inspect the installed SDK, affected source and callers before applying an older
report. Choose one reproducible interaction; use the
[performance guide](../../../docs/performance.md) for current scope and fixtures.

Capture a same-device release baseline before optimizing. Record build, brand,
preferences, dataset, OS/refresh rate, thermal state and network/cache conditions.
Use committed updates, mounted views and relevant native traces to locate the cost.

- Keep visible UI state and native synchronization effects. Derive values from
  existing owners; use refs for nonvisual bookkeeping. Preserve input reconciliation,
  hydration, cleanup and request/session guards.
- Reuse scoped theme subscriptions. Inspect parent renders and value identity
  before adding memoization, caching, providers or dependencies.
- Preserve overlapping startup preparation, native layout and launch recovery.
  Separate readiness from branded presentation; include first-open cost when
  deferring work. Optional integrations stay out of startup unless mounted.
- Preserve focus, foreground and Reduce Motion guards. Inspect native blur/masks
  as well as shared clocks; React freezing does not establish native idle behavior.
- Reuse bounded collection viewports with one scroll owner. Measure retained rows,
  Host costs, fling gaps, image handoff and cache/decoder memory. Repeated offline
  payloads do not measure unique-media cost; unmounting does not evict caches.

Make the smallest supported change. Preserve native behavior, RTL, accessibility,
drafts and selectors. Repeat the interaction; retain raw samples, sample counts,
median/p90 and boundaries, then derive budgets from the baseline.

Run lint, typecheck and formatting checks. Regenerate registration after fixture
edits; inspect both release graphs after entry/tooling changes. Keep developer
probes out of releases and this template free of automated test suites.

Report static/export, native-device and live-backend verification separately.
Without device measurements, mark them pending. Source inspection, state count
and JavaScript exports do not prove faster frames, startup or lower native memory;
an export without Hermes bytecode does not validate a native build.
