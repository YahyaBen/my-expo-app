# Native performance

[Documentation index](index.md) · [Performance skill](../.agents/skills/template-skill-performance/SKILL.md)

Use this guide to make Foodiya performance investigations repeatable. The
[implementation skill](../.agents/skills/template-skill-implementation/SKILL.md) owns
architecture and verification rules; component skills own native composition.
Source inspection and passing static checks do not establish device performance.

## Measurement conditions

Compare baseline and changed release builds on the same physical device with the
same brand, environment, saved preferences and dataset. Start with a modest
Android device and a supported iPhone. Record OS, refresh rate, build revision,
network/cache condition and thermal state. Keep development profiling results
separate from release timings.

Repeat launches and interactions rather than relying on a single recording.
Twenty launches per launch condition are a useful initial sample; report sample
count, median and p90 with the raw observations. Run baseline and changed builds
in comparable sessions and repeat noisy results. Set device-specific regression
budgets from those observations instead of adopting Discord's percentages.

## Scenarios

| Scenario             | Procedure                                                                           | Observe                                                                    |
| -------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Cold and warm launch | Open Home signed out and with a cached session; record launch conditions explicitly | Native startup, JS loading, technical readiness and visible interactivity  |
| Session recovery     | Repeat offline, expired-session and restoration-error paths                         | Usable recovery, duplicate work, retry latency and retained cached content |
| Retained tabs        | Visit every tab, then repeat the same idle and scroll recording                     | UI/render work, CPU, memory and growth after repeated navigation           |
| Search               | Type and clear the same query against fixed datasets                                | Input latency, expensive commits and derived-data work                     |
| Motion               | Compare Default/Dunes/Rain, then background/resume and navigate Back                | Decorative activity, blur correctness, slow frames and native hit targets  |
| Collections          | Scroll fixed 24/200/1,000-row fixtures with mixed heights and long text             | Mounted rows, blank gaps, frame deadlines and memory settling              |
| Future media feeds   | Repeat with realistic thumbnails, cache hits/misses and failed loads                | Decode/request cost, stable row geometry and retained image memory         |

Repeat affected scenarios with Arabic/RTL, large text and reduced motion. Verify
keyboard, safe-area and touch behavior when page geometry or native ownership
changes. Use the existing [Storybook workflow](storybook.md) for deterministic
fixtures; keep synthetic stress results distinct from real feature observations.

The `Performance/Native Lists` stories compare the same mixed-height multilingual
rows in an eager native scroll container and a recycled FlashList. Select
`Native24`, `Native200` or `Native1000` for the baseline, then the matching
`Recycled24`, `Recycled200` or `Recycled1000`; `RecycledRtl` and `RecycledDark`
cover direction and appearance. The count and renderer controls let a single
fixture reproduce each workload. Story registration is development-only, so
these fixtures establish reproducible stress cases rather than release timings.

## Startup interpretation

The [root layout](../src/app/_layout.tsx) owns fonts, saved preferences, session
restoration, initial page layout and launch completion. The
[launch-screen skill](../.agents/skills/template-skill-ui-launch-screen/SKILL.md) owns the
configured presentation lifecycle. Record readiness and presentation separately:
the branded hold and slide are intentional product timing, not evidence of slow
storage or rendering.

[The performance adapter](../src/lib/performance.ts) uses the installed SDK's
[Expo Observe API](https://docs.expo.dev/versions/v57.0.0/sdk/observe/).
`configurePerformance(brand.variant)` runs before mounting; `PerformanceRoot`
provides Observe when both native modules are present and otherwise falls back
to a Fragment. Expo Go and older development clients remain usable without
Observe events. Use a matching native build to verify telemetry. Release builds
keep Observe's default dispatch behavior; debug event dispatch is not enabled.

The adapter records these once-per-JS-runtime events. Their `elapsedMs`
attribute starts when the performance module is evaluated, **not at native
process creation**. `getStartupTimings()` returns a bounded snapshot even when
the native metrics modules are absent.

| Event                              | Milestone                                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| `app.startup.fonts_ready`          | Heading fonts resolved, including the fallback on load error                                       |
| `app.startup.preferences_ready`    | Appearance, language and header preferences hydrated                                               |
| `app.startup.session_ready`        | Authentication restoration resolved without a restoration error                                    |
| `app.startup.page_layout_ready`    | The initial page or recovery frame reported native layout                                          |
| `app.startup.content_ready`        | Fonts, preferences, successful session resolution and initial layout are ready beneath the overlay |
| `app.startup.interactive`          | Successful startup is laid out, the launch overlay has exited and the app is active                |
| `app.startup.recovery_interactive` | A recovery frame is laid out, the launch overlay has exited and the app is active                  |

Preference/session hydration runs concurrently with font loading. Native content
still waits for fonts or their fallback. Keep the once-per-runtime milestones
separate from navigation metrics and repeat launches in a fresh runtime. Recovery
may later succeed after a retry; its initial event does not claim a successful
session.

[PageFrame](../src/components/ui/page/page-frame.tsx) uses
[the page performance hook](../src/hooks/use-page-performance.ts) to mark an
active, focused frame after native layout and the root launch overlay's exit.
These markers carry `readiness: 'frame-layout'`. They establish that boundary,
not completion of every child fetch, animation or screen transition. Route
interactivity is recorded once per screen instance by Observe. Navigation
render timings and the root's first React commit also have different boundaries:
the initial commit can render null while fonts load, so it is not necessarily a
visible frame. Interpret the named custom milestones alongside native startup
and route metrics instead of treating them as interchangeable.

When startup is slow, inspect the measured critical path before changing order.
Optional code may be evaluated through imports, and deferring it can move its
cost to first use. Measure both sides of that tradeoff. Preserve cached-session
restoration and the deferred store-update check. Keep native device results
marked pending until those conditions have been measured.

## Rendering, lists and resource lifetime

For retained screens, trace native mask/blur consumers as well as JS renders.
The shared wave clock and the surfaces that consume it have different lifetimes.
Freezing a React subtree does not prove that native consumers are idle. Verify
that returning to a retained page restores correct blur, touch shielding and
draft/scroll state.

Read the [List](../.agents/skills/template-skill-ui-list/SKILL.md),
[Table](../.agents/skills/template-skill-ui-table/SKILL.md) and
[Page](../.agents/skills/template-skill-ui-page/SKILL.md) contracts for collection work.
Bounded native rows remain appropriate for small content. A growing feed needs
its own scrolling composition and a benchmark of recycling, native Host costs,
row geometry and pagination. Check the actual source before treating a sample
dataset or an installed list package as an implemented production feed.

The tab destination sheet displays ten illustrative journeys in a single-column
FlashList, which remains its only scrolling container. Its intrinsic native
cell Hosts have an RN minimum height derived from the row's
spacing and scaled text sizes, so a pending native measurement cannot report a
zero-height cell and make the list progressively mount the whole dataset. The
minimum is a floor; native wrapping can still make a row taller. Time formatters
are reused per supported language, and only rendered cells format their times.

The destination list caps `maxItemsInRecyclePool` at 3 spare native cells. This
bounds the spare recycle pool; it does not cap visible/buffered cells, total
mounted cells or the first visible batch. Recycling remains enabled. The cap's
performance and memory effects still need comparison on devices.

Android development-build timings, release performance and scrolling/large-text
checks remain pending on devices.

Profile repeated parsing, translated search text and broad subscriptions where
they affect the scenario. Preserve the existing query/session safeguards. For
media features, compare appropriately sized thumbnails and progressive previews
using actual image/network conditions. Retained memory should settle after
navigation and scrolling rather than increase indefinitely.

## Results template

Copy this table into a dated investigation report and link it from the index
when the report is useful to retain. Attach raw timing samples or native traces.

| Field                                                | Result |
| ---------------------------------------------------- | ------ |
| Revision, build profile, brand and environment       |        |
| Device, OS, refresh rate and thermal condition       |        |
| Scenario, dataset, cache and network state           |        |
| Baseline and changed sample counts                   |        |
| Median/p90 and units; JS/native measurement start    |        |
| Frame/CPU/memory observations relevant to the change |        |
| Repeated benefit and regression budget               |        |
| Native product-state checks                          |        |
| Static checks and separate live-backend checks       |        |
| Remaining limitations                                |        |

When measurements are unavailable, write **pending** and describe what was
implemented and statically checked. A fixture registration, code path or preview
selector is not a recorded performance result.

## Background reading

- [Discord's 2019 iOS investigation](https://discord.com/blog/how-discord-achieves-native-ios-performance-with-react-native)
  demonstrates tracing data processing, native work, hidden animation and startup
  separately.
- [Discord's 2025 mobile improvements](https://discord.com/blog/supercharging-discord-mobile-our-journey-to-a-faster-app)
  show workload-specific list choices, recycling and media optimizations tested
  on inexpensive devices.
- [Margelo's 2026 Discord investigation](https://margelo.com/blog/margelo-discord-react-native-performance)
  explains a native rendering/animation interaction that React render counts alone
  could not explain.

Translate historical fixes to the installed stack. For example, the old RAM
bundle recommendation is incompatible with Hermes; see
[current React Native loading guidance](https://reactnative.dev/docs/optimizing-javascript-loading).
Use measurements to select an implementation rather than copying a custom list,
cache size or framework flag from an older app.
