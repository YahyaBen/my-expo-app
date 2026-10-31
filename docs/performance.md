# Native performance

## Current scope

The Expo SDK 58 release renders the
[template screen](../src/features/template/template-screen.tsx). Galleries,
Preferences and stress fixtures belong to development-only Storybook. Optional
auth/query providers are not mounted by the release root.

Current code isolates palette, appearance, header and motion subscriptions,
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

## Native fixtures and regression checks

Use the [Storybook workflow](storybook.md). Fixture registration establishes
availability; it does not establish device results.

| Fixture                                                      | Check                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Performance/Native Lists/Playground                          | Compare eager native scrolling, FlashList and native ListForEach with 24/200/1,000 mixed-height multilingual rows. Inspect mounted rows, native Host cost, fast-fling gaps and settled memory.                                                        |
| Components/Theme Tokens/Playground, `example: subscriptions` | After startup settles, change one preference and inspect the matching `[theme-subscription]` committed-update logs.                                                                                                                                   |
| Native input and OTP examples                                | Type, reject, reset, paste/autofill and dismiss while pending. Preserve focus, drafts, callbacks, countdown lifetime and duplicate-request guards. Local simulations do not verify a backend.                                                         |
| Wireframes/Preferences                                       | Reopen, return from system Settings and toggle location. Check permission refresh, retryable writes, request cleanup and language-sheet dismissal.                                                                                                    |
| Motion/Transitions/NativeStack and PausedContent             | Repeat push/Back and background/resume. Restore blur, touch shielding, drafts and scroll position; pause decorative work while hidden.                                                                                                                |
| Components/Launch Screen/Playground                          | Let the visible hold elapse before clearing waiting. Check that preparation overlaps the hold without restarting it.                                                                                                                                  |
| Home photo stories                                           | Use carousel datasets `large-200`/`large-1000` and grid counts 200/1,000. Check forward/reverse swipes, snaps, overlapping-card order, resize alignment and source replacement. Exercise later-row expansion, drag/cancel/close and thumbnail return. |

Repeat affected paths in Arabic/RTL, large text, both appearances and Reduce Motion;
check keyboard and safe areas after layout changes. The configured UX theme
disables page-header artwork, so a saved wave preference alone is not an active
animation workload. React freezing does not prove native blur/mask consumers idle.

The [photo viewport](../src/components/ui/photo-scroll-view.tsx) owns the carousel
window and geometry alignment. Measure its initial and retained windows rather
than treating the current settings as a device budget. The large-grid fixture uses
a bounded viewport with one vertical scroll owner; small inline grids stay eager.
Preserve the grid's native image-display handoff and selection cleanup when cells
unmount. Component contracts live in the matching entries in the
[skill index](skills.md).

Photo fixtures repeat twelve offline payloads. They exercise view lifetime, not
unique-media decoding or network cost. Windowing does not evict native image caches
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

| Event                         | Milestone                                                   |
| ----------------------------- | ----------------------------------------------------------- |
| app.startup.fonts_ready       | Selected fonts resolved, including fallback                 |
| app.startup.preferences_ready | Appearance, language and header/device preferences hydrated |
| app.startup.page_layout_ready | Initial usable page reported native layout                  |
| app.startup.content_ready     | Fonts, preferences and layout ready beneath the overlay     |
| app.startup.interactive       | Overlay exited and usable content is foregrounded           |

[PageFrame](../src/components/ui/page/page-frame.tsx) uses
[usePagePerformance](../src/hooks/use-page-performance.ts) after focus, foreground,
native layout and launch exit. Its layout marker does not establish completion of
child fetches, animations or native transitions. Observe marks interactivity once
per screen instance; an initial React commit may still render null for fonts.

## Verification and results

- **Static:** run `npm run lint`, `npm run typecheck` and formatting checks; validate
  local documentation links. Regenerate registration after fixture edits. Keep
  this template free of automated test suites.
- **Export:** inspect both native release graphs after entry/tooling changes using
  the [release boundary workflow](storybook.md#release-boundary). Developer probes
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
