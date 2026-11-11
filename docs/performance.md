# Native performance

## Current scope

The Expo SDK 58 release renders the
[template screen](../src/features/template/template-screen.tsx), component pages
and an on-demand Settings feature. Settings native permission/location integrations
are evaluated when that tab is opened. Optional
auth/query providers are not mounted by the release root.

Template retains its ordinary page and Settings in separate React Activities
after the first Settings visit. Hidden Activities retain state/native views and
clean up React effects; they do not establish native idle behavior. Settings is
not prerendered or imported before that first visit. Compare retained memory and
hidden native work as well as tab-switch frame costs.

The root stack enables [Expo Router Activity](https://docs.expo.dev/router/advanced/react-activity/)
on iOS and Android. A route hides when two screens are above it, preserving the
previous scene for Back transitions. Hidden routes retain state and clean up
effects until revealed. SDK 58's native stack does not use `freezeOnBlur`; Activity
owns this lifecycle. Native transition and resource measurements remain pending.

Current code isolates palette, appearance and motion subscriptions,
virtualizes carousel images, supports bounded grid rows and limits stacked
indicators. Controlled inputs reconcile changed text; OTP errors derive from
status. These are implementation facts. Native startup, frame and memory
measurements remain pending.

## Measurement workflow

1. Choose one reproducible interaction. Record revision, build profile, brand,
   preferences, dataset, device/OS/refresh rate, thermal state and network/cache
   conditions. Compare release builds on the same physical iPhone and Android.
2. Capture a baseline before changing behavior: committed updates, mounted views,
   startup milestones and relevant frame/CPU/memory traces. Development probes
   identify leads; inspect native images, layout, blur and masks when React work
   does not explain slow frames.
3. Make the smallest change supported by evidence. Keep visible UI state and
   native synchronization effects; derive values from existing owners and use
   refs for nonvisual bookkeeping. State count alone does not measure render cost.
4. Repeat the same interaction. Keep raw samples, sample count, median/p90 and
   measurement boundaries; derive regression budgets from the baseline. Include
   first-open cost when deferring work. Twenty launches per startup condition are
   a useful initial sample.

## Native regression checks

Use app screens and component pages for manual checks. Add representative datasets
to a local development harness when measurements need larger workloads.

| Scenario                      | Check                                                                                                                                                                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Native lists                  | Compare eager scrolling, FlashList and native ListForEach with representative mixed-height multilingual data. Inspect mounted rows, native Host cost, fast-fling gaps and settled memory.                                                    |
| Theme preferences             | After startup settles, change one preference and inspect committed updates.                                                                                                                                                                  |
| Native input and OTP examples | Type, reject, reset, paste/autofill and dismiss while pending. Preserve focus, drafts, callbacks, countdown lifetime and duplicate-request guards. Local simulations do not verify a backend.                                                |
| Settings                      | Reopen, return from system Settings and toggle location. Check permission refresh, retryable writes, request cleanup and language-sheet dismissal.                                                                                           |
| Template tabs and menu        | Repeat Components/Settings switches after the first visit. Check retained scroll/drafts, header blur restoration and hidden permission/motion work. Capture menu closed, opening, settled open and closed again separately on the same page. |
| Navigation and activity       | Repeat push/Back and background/resume. Restore blur, touch shielding, drafts and scroll position; pause decorative work while hidden.                                                                                                       |
| Launch screen                 | Check that preparation overlaps the visible hold without restarting it.                                                                                                                                                                      |
| Photo components              | Check forward/reverse swipes, snaps, overlapping-card order, resize alignment and source replacement. Exercise later-row expansion, drag/cancel/close and thumbnail return with representative large datasets.                               |

Repeat affected paths in Arabic/RTL, large text, both appearances and Reduce Motion.
Check keyboard and safe areas after layout changes. Headers use one rectangular
native blur backdrop with no artwork clock or mask. Check native blur behavior
when React Activity hides and reveals retained screens.

The [photo viewport](../src/components/ui/photo/photo-scroll-view.tsx) owns the carousel
window and geometry alignment. Measure its initial and retained windows rather
than treating the current settings as a device budget. Large grids need a bounded
viewport with one vertical scroll owner; small inline grids stay eager.
Preserve the grid's native image-display handoff and selection cleanup when cells
unmount. Component contracts live in the matching entries in the
[skill index](skills.md).

Offline photo examples do not establish unique-media decoding or network cost.
Windowing does not evict native image caches
or bound caller data; measure cache/decoder memory separately from mounted views.

## Startup boundaries

The [root layout](../src/app/_layout.tsx) overlaps font loading and preference
hydration, then waits for native page layout and launch exit. Font failure allows
native fallback. Startup does not restore auth, contact a backend, request
permissions or check store updates. The branded hold counts visible foreground
time from its first layout, overlaps preparation and excludes background time.
Keep that presentation separate from technical readiness.

The [performance adapter](../src/lib/performance.ts) uses
[SDK 58 Observe](https://docs.expo.dev/versions/v58.0.0/sdk/observe/) when both native
metrics modules exist; otherwise it supplies a Fragment and stable no-op marker.
Reporting is best effort and requires a matching native build. Custom startup
events occur once per JS runtime; `elapsedMs` starts at performance-module
evaluation, not process creation. `getStartupTimings()` retains a bounded snapshot
without native metrics.

| Event                         | Milestone                                                    |
| ----------------------------- | ------------------------------------------------------------ |
| app.startup.fonts_ready       | Selected fonts resolved, including fallback                  |
| app.startup.preferences_ready | Appearance, language, motion and device preferences hydrated |
| app.startup.page_layout_ready | Initial usable page reported native layout                   |
| app.startup.content_ready     | Fonts, preferences and layout ready beneath the overlay      |
| app.startup.interactive       | Overlay exited and usable content is foregrounded            |

[PageFrame](../src/components/ui/page/page-frame.tsx) uses
[usePageLayout](../src/hooks/use-page-layout.ts) after focus, foreground,
native layout and launch exit. Its layout marker does not establish completion of
child fetches, animations or native transitions. Observe marks interactivity once
per screen instance; an initial React commit may still render null for fonts.

## Verification and results

- **Static:** run `npm run lint`, `npm run typecheck` and formatting checks; validate
  local documentation links. Keep
  this template free of automated test suites.
- **Export:** inspect both native release graphs after entry/tooling changes. Developer probes
  must be absent. `--no-bytecode` can inspect the graph when Hermes is unavailable;
  it does not validate bytecode or replace a native build.
- **Native device:** repeat the affected interactions and before/after measurements.
  Source inspection, static checks and exports do not prove faster startup,
  smoother frames or lower native memory. Mark unavailable measurements pending.
- **Live backend:** the release wireframe has no backend workflow. When a feature
  uses the optional kit, verify cancellation, session ownership, refresh keys,
  pagination and duplicate submissions against its real backend separately.

Record results with raw samples or traces:

| Field                                                      | Result |
| ---------------------------------------------------------- | ------ |
| Revision/build/brand; device/OS/refresh rate/thermal state |        |
| Scenario/dataset/preferences; network/cache conditions     |        |
| Baseline/changed sample counts, median/p90 and boundaries  |        |
| Frame/CPU/memory observations and interaction regressions  |        |
| Static, native-device and live-backend checks; limitations |        |
