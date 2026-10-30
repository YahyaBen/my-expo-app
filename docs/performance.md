# Native performance

Use release builds on the same physical iPhone and Android device for baseline
and changed measurements. Record OS, refresh rate, build revision, brand, saved
preferences, dataset, network/cache condition and thermal state. Development
profiling and synthetic fixtures do not establish release performance.

Repeat each scenario and report sample count, median and p90 with raw observations.
Twenty launches per condition are a useful initial sample. Set regression budgets
from the device baseline. Source inspection, exports and static checks cannot
establish startup, memory or frame-rate improvements.

## Scenarios

| Scenario                      | Procedure                                                                     | Observe                                                            |
| ----------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Startup                       | Repeat cold/warm launches of the release wireframe                            | Native startup, JS loading, readiness and visible interactivity    |
| Preferences                   | Reopen the Preferences story, return from system Settings and toggle location | Permission reads, scrolling, duplicate work and retained state     |
| Navigation                    | Push the wireframe from a transition story and return with native Back        | Touch targets, blur, draft/scroll preservation and background work |
| Collections                   | Compare fixed 24/200/1,000-row multilingual fixtures                          | Mounted rows, blank gaps, frame deadlines and memory settling      |
| Motion                        | Repeat carousel swipes and grid open/drag/cancel/close                        | Slow frames, image handoff, focus guards and reduced motion        |
| Future backend/media features | Repeat recovery, search and thumbnail loading with fixed data                 | Input latency, cancellation, decoding and retained memory          |

Repeat affected interactions with Arabic/RTL, large text, both appearances and
reduced motion. Check keyboard and safe areas when layout or hosting changes.
Device checks and live-backend checks remain separate from static verification.

## Native fixtures

Use the [Storybook workflow](storybook.md) to reproduce interactions:

- **Performance/Native Lists/Playground** provides count and renderer controls for
  eager native scrolling, FlashList and native ListForEach. All render the same
  mixed-height English, French and Arabic rows. Compare native Host ownership and
  actual mounted rows when choosing a collection implementation.
- **Wireframes/Preferences** covers permission refresh, one-shot location,
  language-sheet dismissal and bounded native settings scrolling.
- **Motion/Transitions/NativeStack** covers native push/Back and retained state.
  **PausedContent** pauses header/skeleton motion without losing the draft.
- **Components/Theme Tokens/Playground**, with `example: subscriptions`, logs
  committed palette, color, appearance, header and motion subscribers independently.
  Change one preference after startup settles and compare the matching
  `[theme-subscription]` probe logs. These development logs verify subscription
  isolation; release frame/CPU measurements remain separate.
- **Components/Launch Screen/Playground** exposes the waiting control. Let the
  visible hold elapse, then clear waiting to check overlap with preparation.
- Home photo stories cover circular/stacked/story carousels and grid expansion.
  Include compact sizing, opaque cards, fast flicks, source replacement and
  background/resume. Carousel datasets `large-200` / `large-1000` and grid counts
  200 / 1,000 exercise virtualized image mounting. Inspect mounted photo selectors
  after scrolling far forward and back. These offline fixtures repeat twelve
  payloads; they exercise view lifetime, not unique-media decoding or network cost.

Fixture registration demonstrates availability, not measured device results.

## Startup interpretation

The [root layout](../src/app/_layout.tsx) restores fonts, appearance, language,
header/motion and device preferences. Startup does not restore auth, contact a
backend, request permissions or check store updates. The initial usable page
layout and configured launch overlay determine interactivity.

Preference hydration overlaps font loading. Optional font failure permits native
fallback. The branded hold counts visible foreground time from its first layout;
it overlaps preparation and does not restart after readiness. Background time
does not count. Keep this intended presentation separate from technical readiness.

The [performance adapter](../src/lib/performance.ts) uses
[SDK 58 Observe](https://docs.expo.dev/versions/v58.0.0/sdk/observe/) when both native
metrics modules are available, otherwise falling back to a Fragment and stable
no-op marker. Configuration and event reporting are best effort. Use a matching
native build to inspect telemetry; debug dispatch is not enabled.

Custom startup events occur once per JS runtime. Their elapsedMs starts at
performance-module evaluation, not native process creation. getStartupTimings()
returns the bounded snapshot even without native metrics.

| Event                         | Milestone                                                   |
| ----------------------------- | ----------------------------------------------------------- |
| app.startup.fonts_ready       | Selected fonts resolved, including error fallback           |
| app.startup.preferences_ready | Appearance, language and header/device preferences hydrated |
| app.startup.page_layout_ready | Initial usable page reported native layout                  |
| app.startup.content_ready     | Fonts, preferences and layout ready beneath the overlay     |
| app.startup.interactive       | Overlay exited and usable content is foregrounded           |

[PageFrame](../src/components/ui/page/page-frame.tsx) uses
[usePagePerformance](../src/hooks/use-page-performance.ts) to mark a focused,
foreground frame after native layout and launch exit. Its frame-layout marker
does not establish completion of child fetches, animation or a native transition.
Observe records route interactivity once per screen instance. A first React commit
can still render null during font loading; interpret these boundaries separately.

## Resource lifetime and regression checks

The existing readiness gate combines launch completion with native route focus.
Background/unfocused content must stop decorative clocks and native blur/mask
work. Freezing React alone does not prove native consumers are idle. Returning to
a retained page must restore blur, touch shielding, drafts and scroll position.

Preference/permission refreshes should wait for a visible foreground canvas;
location reads stay with their existing owner and stop automatically when the
feature is disabled. Keep duplicate-request guards and retryable failed writes.
The root observes preference hydration rather than every feature-toggle change.

Carousels derive interpolation ranges and fixed geometry outside per-frame
worklets. Hidden cards return constant transparent styles; scroll-driven artwork
still follows the native offset. Check forward/reverse drags, edge clamping,
selection, RTL and reduced-motion geometry before changing these paths.

Circular Carousel, Stacked Carousel and Story List use a shared virtualized
horizontal photo viewport. Fixed-width cells and a trailing spacer preserve snap
positions; shared-value transforms compensate for native cell movement where the
artwork stays stacked. Native direction controls FlatList metrics, while paired
mirroring preserves live app RTL and image orientation. Cells use descending
stacking order and keep native clipping disabled for artwork extending beyond a
logical cell. Virtualization unmounts distant cells. The initial render batch and
five-viewport window do not establish an optimal device-specific budget. Stacked
indicators show at most seven dots around the current selection.

For a large IosHomeGrid, supply a positive finite `viewportHeight`. This bounds
the native viewport and virtualizes measured rows while retaining native tile
buttons and the expansion overlay. The grid then owns vertical scrolling; place
it outside another vertical scroll container. Omitting the height keeps the
small inline grid eager in its existing parent scroll. The grid story removes
its outer scroll for bounded examples. Verify expansion from later rows,
scroll locking during selection, return to the thumbnail, variable-height labels,
font scaling, replacement and RTL on both platforms.

Windowed mounting does not evict Expo Image's native caches or bound caller-owned
data. Measure image-cache/decoder memory, retained views and fast-fling blank areas
separately. No device measurements have been recorded for these changes.

The home grid scales a fixed-size image inside an animated clipping frame. Its
opening handoff waits for the expanded image's native onDisplay event while the
loaded thumbnail stays visible. Source replacement waits again; failed loads
cancel selection and Close remains usable before display completes. Verify this
handoff frame by frame over repeated cycles on both platforms.

Profile derived work and subscriptions before adding caching or memoization.
Measure first-use cost as well as startup when deferring an import. Growing feeds
need a measured scrolling/recycling composition; bounded lists and tables do not
establish a production feed implementation. Retained memory should settle after
navigation rather than grow indefinitely.

## Results record

| Field                                              | Result |
| -------------------------------------------------- | ------ |
| Revision, build profile, brand and environment     |        |
| Device, OS, refresh rate and thermal condition     |        |
| Scenario, dataset, cache and network state         |        |
| Baseline and changed sample counts                 |        |
| Median/p90, units and measurement boundary         |        |
| Relevant frame/CPU/memory observations             |        |
| Benefit, regressions and native interaction checks |        |
| Static checks and separate live-backend checks     |        |
| Remaining limitations                              |        |

Attach raw samples or native traces. When measurements are unavailable, mark them
pending and state only what was implemented and statically verified. Keep useful
regression scenarios here; Git retains earlier investigation history.
