# Native performance

[Documentation index](index.md) · [Performance skill](../.agents/skills/template-skill-performance/SKILL.md)

Use this guide to make template performance investigations repeatable. The
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

| Scenario             | Procedure                                                                          | Observe                                                                    |
| -------------------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Cold and warm launch | Open the neutral wireframe in a release build; record launch conditions explicitly | Native startup, JS loading, technical readiness and visible interactivity  |
| Session recovery     | When adding auth, repeat offline and restoration-error paths                       | Usable recovery, duplicate work, retry latency and retained cached content |
| Retained tabs        | When adding tabs, repeat the same idle and scroll recording                        | UI/render work, CPU, memory and growth after repeated navigation           |
| Search               | Type and clear the same query against fixed datasets                               | Input latency, expensive commits and derived-data work                     |
| Motion               | Compare Default/Dunes/Rain, then background/resume and navigate Back               | Decorative activity, blur correctness, slow frames and native hit targets  |
| Collections          | Scroll fixed 24/200/1,000-row fixtures with mixed heights and long text            | Mounted rows, blank gaps, frame deadlines and memory settling              |
| Future media feeds   | Repeat with realistic thumbnails, cache hits/misses and failed loads               | Decode/request cost, stable row geometry and retained image memory         |

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

## Settings

Settings keeps one bounded native FieldGroup as its scroll owner. Read-only
permission refreshes wait for a visible, foreground canvas. The location hook
owns location reads; the general permission refresh excludes it. When location
is disabled in app preferences, automatic location/service reads stop.

Unchanged permission snapshots retain their references so returning to Settings
does not rebuild the full form for equivalent native results. Location refresh
dependencies use the permission flags, not response-object identity. Explicit
preference writes skip unchanged values; successful saves do not emit identical
global snapshots. Failed saves remain retryable.

The root subscribes only to hydration readiness, so device-feature toggles do not
rerender the root navigator. Requests retain their pending/duplicate guards, and returning from system Settings
still refreshes status. The first section reserves the measured header inset so
its controls do not begin beneath the header's touch shield.

Use **Wireframes/Preferences** to check scrolling while permissions settle,
repeated foreground returns, language-sheet dismissal, live RTL, large text and
location enable/disable. Confirm permission prompts and coordinates on a device;
static checks do not establish Settings frame times.

## Carousel scroll work

Story List, Stacked Carousel and Circular Carousel capture interpolation ranges,
output values and fixed geometry outside their per-frame style worklets. The
scroll path still updates shared values on the UI runtime; React handles selection
changes rather than scroll frames. Geometry-dependent arrays keep stable identities
until their geometry changes, avoiding mapper restarts on selection updates. Keep temporary curve arrays out
of that hot path when changing the motion.

The allocation change preserves the existing curve values, culling, snap points,
RTL mirroring and reduced-motion branches. Compare the existing Light, RTL and
Compact stories with slow drags, fast flicks, edge cards, scale changes and rotation.
Numerical style comparisons establish equivalent math, not device frame rates.

## Startup interpretation

The [root layout](../src/app/_layout.tsx) owns fonts, saved preferences, language,
initial page layout and launch completion; starter startup has no auth restoration. The
[launch-screen skill](../.agents/skills/template-skill-ui-launch-screen/SKILL.md) owns the
configured presentation lifecycle. Record readiness and presentation separately:
the branded hold and slide are intentional product timing, not evidence of slow
storage or rendering.

The branded hold counts visible foreground time from its first native layout,
overlapping preference/page preparation. The exit still waits for both readiness
and that hold. It does not add a fresh two-second wait after preparation completes.
Background time does not count; the existing slide and reduced-motion behavior remain.

The existing readiness context also gates content motion underneath the launch
overlay. Story canvases combine it with native route focus, so retained canvases
stop their shared animation clocks when covered by another route. The branded
overlay sits outside this content gate and keeps its own foreground guards.
Standalone previews remain animated unless an explicit gate disables them.

Home's code entry and circular scale control own local state in their respective
previews. Editing them does not update the gallery parent or its sibling images.
Use **Motion/Transitions/PausedContent** to pause visible header/skeleton motion
without losing the input draft. Use **Components/Launch Screen/Waiting**, wait
for the visible hold, then set its `waiting` Control to false to inspect the overlap. These
fixtures do not establish native frame times; check launch, rapid Back round trips,
background/resume and reduced motion on a matching iPhone and Android build.

[The performance adapter](../src/lib/performance.ts) uses the installed SDK's
[Expo Observe API](https://docs.expo.dev/versions/v58.0.0/sdk/observe/).
`configurePerformance(brand.variant)` runs before mounting; `PerformanceRoot`
provides Observe when both native modules are present and otherwise falls back
to a Fragment. Expo Go and older development clients remain usable without
Observe events. Use a matching native build to verify telemetry. Release builds
keep Observe's default dispatch behavior; debug event dispatch is not enabled.

Configuration, startup-event reporting and page markers are best effort: a
telemetry exception must not prevent app startup or recovery. The native-module
fallback reuses a stable marker callback, avoiding effect rescheduling from a
new callback on every render. These source changes do not establish device timing
or frame-rate improvements.

The adapter records these once-per-JS-runtime events. Their `elapsedMs`
attribute starts when the performance module is evaluated, **not at native
process creation**. `getStartupTimings()` returns a bounded snapshot even when
the native metrics modules are absent.

| Event                           | Milestone                                                                           |
| ------------------------------- | ----------------------------------------------------------------------------------- |
| `app.startup.fonts_ready`       | Heading fonts resolved, including the fallback on load error                        |
| `app.startup.preferences_ready` | Appearance, language and header preferences hydrated                                |
| `app.startup.page_layout_ready` | The initial usable page reported native layout                                      |
| `app.startup.content_ready`     | Fonts, preferences and initial layout are ready beneath the overlay                 |
| `app.startup.interactive`       | Successful startup is laid out, the launch overlay has exited and the app is active |

Preference/language hydration runs concurrently with font loading. Native content
still waits for fonts or their fallback. Keep the once-per-runtime milestones
separate from navigation metrics and repeat launches in a fresh runtime. Optional
auth workflows should add their own session/recovery measurements when introduced.

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

The tab destination sheet displays 100 illustrative journeys in a native `List`
with `ListForEach` recycling. Rows share one bounded Host, removing the per-row
RN/native intrinsic-height round trip from the former FlashList composition.
The RN container receives the same explicit height as the native sheet content
before opening; the list fills the space between the intrinsic header and Close
action. Row-height estimates use spacing and scaled theme typography, while
native wrapping can increase actual heights. Only rendered rows format times,
using a shared formatter per supported language.

`overscanCount={2}` prepares two extra rows on each side of the visible range.
It does not cap visible rows or the retained pool's high-water mark. The
`NativeRecycled200`, `NativeRecycled1000`, `NativeRecycledRtl` and
`NativeRecycledDark` performance stories exercise this single-Host renderer with
the same mixed-height data as the existing FlashList and eager-scroll fixtures.

For opening latency, compare the first tap after launch and repeated close/open
cycles in baseline and changed preview builds on the same device. Record time to
the shell, first visible journeys, slow frames and peak mounted rows separately.
Scroll to journey 100, dismiss by Close, backdrop and Android Back, then reopen.
Repeat with large text, Arabic/RTL and both appearances. Preview/release timings
and the full iOS/Android interaction matrix remain pending. On 2026-10-28, the
connected Xiaomi 21091116AG on Android 13 displayed the destination sheet, its
100-journey count and initial journeys in the development client. This is an
opening smoke check, without a controlled baseline or latency measurement; it
and the added fixtures do not establish a measured speedup.

Profile repeated parsing, translated search text and broad subscriptions where
they affect the scenario. Preserve the existing query/session safeguards. For
media features, compare appropriately sized thumbnails and progressive previews
using actual image/network conditions. Retained memory should settle after
navigation and scrolling rather than increase indefinitely.

## Home photo transitions — 2026-10-28

Source inspection found redundant native transform updates for hidden carousel
cards, a stacked-card opacity curve that reached zero halfway through its
outgoing step, and a grid image whose native dimensions changed throughout its
expansion. Hidden cards now return a constant transparent style, the outgoing
fade spans the complete step, and the grid scales a fixed-size bitmap inside
its changing clipping frame. The clipping frame still performs layout work.

A mocked-worklet comparison against the baseline used six photos in a 300-point
viewport, 240-point story/stacked cards and 75-point circular cards. At the first
selection, each carousel went from six cards returning changing transforms to
three. This is a source-level workload count, **not a frame-rate measurement**.
Sampling covered 7,272 carousel states across LTR/RTL and reduced motion, plus
1,212 grid states with square, landscape and portrait images. Checks covered
the outgoing fade, constant hidden styles, fixed bitmap dimensions, centered
cover cropping and reduced-motion geometry.

The fluidity follow-up replaces piecewise-linear artwork paths with monotone
cubic spatial interpolation: adjacent segments share their velocity, including
at the edges. The native scroll offset still drives the artwork directly, with
no delayed spring following the finger. Gentler story/stack scale and stack tilt
reduce large visual jumps. Native momentum can cross multiple cards while
retaining snapping; grid drag return carries release velocity into a clamped
400ms spring with damping ratio 0.8.

Numerical checks sampled 34,034 path positions, verifying exact keyframes,
continuous velocity, clamped edges and no scale/opacity overshoot. The revised
bundle loaded on a Xiaomi 21091116AG running Android 13 in the development
client. That check caught and resolved a worklet dependency-initialization error;
it does not establish frame-rate or release-build smoothness.

Native baseline/changed release-build frame times, image decoding and memory
measurements remain **pending**, as do complete swipe/drag interaction checks.
On the same iPhone and Android device, compare repeated forward/reverse swipes
and grid open/short-drag/cancel/close interactions with the same cache state;
repeat with RTL, reduced motion, source replacement and background/resume.
No live-backend verification applies to these presentation changes.

The grid opening handoff now waits for the expanded image's native `onDisplay`
event. Until then, the overlay stays transparent and progress remains at zero,
leaving the loaded thumbnail visible. Display readiness is tied to the source;
source replacement waits again. Failed loads cancel the pending selection, and
Close before display completes immediately. The existing ready-image closing
spring is unchanged. Mocked lifecycle checks cover delayed display, load/display
ordering, duplicate events, source identity/replacement, reduced motion, early
Close and error recovery. One Android development-client opening reached a
rendered expanded image; repeated-cycle and frame-by-frame flash verification
remain pending. This is not an iOS or release-build result.

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
