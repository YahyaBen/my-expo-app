---
name: template-skill-ui-launch-screen
description: Maintain minimal and branded launch presentation and exit behavior.
---

# Launch screen

Import `LaunchScreen` from `@components/ui`.
Source: [launch-screen/](../../../src/components/ui/launch-screen/).

- Required: `exiting`, `onExitComplete`. Optional: `onReady`,
  `mode: 'minimal' | 'branded'`; direct callers default to branded.
  The root passes the configured brand's `presentation.launch`.
- Minimal renders native loading without artwork, hold or slide; completion
  requires layout, foreground activity and `exiting`.
- Branded uses configured name/artwork/fonts, a cancellable two-second
  foreground hold from its first native layout, overlapping page preparation,
  followed by a two-second upward slide once the page is ready. Backgrounding pauses the hold
  and cancels at the current offset; resume continues. Guard duplicate completion.
- Reduced motion retains the branded hold, freezes artwork and skips the slide.
  Enabling it during exit completes after the hold. Pause Lottie when inactive.
- Keep artwork in `RNHostView` and text in native content. Preserve bundled
  asset selection and static imports in existing brand configuration.
- The splash edge reuses `PageMotionOverlay`'s cached `splash` paths and
  `PAGE_WAVE_HEIGHT`; it does not evaluate header/detail contours.
  It respects activity/reduced motion and keeps moving during the branded slide.

## Root readiness boundary

Startup state belongs to the root; this component owns presentation.

- Restore preferences/language/header concurrently with fonts. The template root
  has no auth restoration; session/recovery readiness belongs to a future auth flow.
  Mount the overlay after appearance and font readiness/fallback.
- `onReady` follows overlay native layout so the root can hide the native splash.
  Set `exiting` only after a usable page or recovery frame lays out underneath.
- Successful `app-ready` requires resolved fonts/fallback, hydrated preferences
  and language, initial usable page layout and overlay exit.
- Preserve branded `app-brand-screen`, `app-brand-artwork`, `app-brand-name`
  and minimal `app-launch-minimal` selectors.

Verify the configured brand, cold start, font fallback, background
resume and reduced motion on native devices. Story registration does not verify
startup timing or rendering.
