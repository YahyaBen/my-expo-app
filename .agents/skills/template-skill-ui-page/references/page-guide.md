# Header rendering and motion

Use this reference when changing page blur, artwork or native screen retention.
Source: [page implementation](../../../../src/components/ui/page/).

## Blur and retained screens

- Content mounts before its blur backdrop. Android's BlurTargetView must contain
  an absolute themed background child; ancestor/target backgrounds are not recorded.
  The title and Back stay outside the capture target.
- On Android, `use-page-blur-key.ts` refreshes only the backdrop after a retained route
  regains focus and again after its incoming transition. Preserve page, content,
  target and scroll identity.
- Stack transition events contain data.closing; tab events may omit data.
  Read data?.closing, coalesce same-frame events and cancel pending work on blur.
- Ordinary rerenders and header resizing must not refresh the backdrop.
- iOS rectangular headers use systemUltraThinMaterial; artwork uses SwiftUI
  ultraThin material masked inside SwiftUI. Masking an ancestor UIKit effect
  view disables blur. Keep the native mask explicitly sized.
- Android uses the existing MaskedView/Skia mask and expo-blur defaults:
  default tint, intensity 50, reduction factor 4. SDK31Plus policy uses native blur
  on Android 12+ and translucent fallback below it.
- iOS Reduce Transparency replaces blur with theme background. Blur ignores touches;
  the page-local shield covers the greater of header height and current wave edge.
- Keep blur strength system-owned. There is no user-facing numeric blur preference.

## Artwork lifecycle

- Root `PageMotionOverlay` supplies one PageWaveContext above navigation.
  Default is rectangular blur; Dunes, Ribbon and Rain add decorative artwork.
- Theme `design.header.artwork=false` overrides saved artwork choice. Splash keeps
  its independent launch artwork.
- Default retains provider/children identity while mounting no wave hook,
  frame clock, canvas or SVG mask. Switching back to artwork starts a fresh phase.
- Pausing/hiding existing artwork preserves phase. Activity, focus and effective
  reduced motion gate the shared active-time clock.
- The clock runs on the UI thread, wraps after 120 seconds and clamps a delayed
  frame's advance to 64 ms. No animation frame updates React state.
- Skia paths use numeric builders. Only iOS surface useAnimatedProps serializes
  SVG mask paths; Android and splash must not do so per frame.
- Mirror artwork for RTL and keep its leading 40% level beneath title/Back.
- Expanded Login fills from the top to a wave centered at 35% of window height.
  Keep extended bounds until the one-second collapse finishes.
- `onCollapseComplete` releases successful-login navigation after collapse.
  Reduced motion, Default and themes without artwork release immediately.
- Storybook-local preference providers must not access saved app preferences.

## Content and readiness

- Settings reserves measured header height in its scrolling first-section header.
  pageFormModifiers hides iOS Form canvas/background; retain native scrolling.
- Overlay map content keeps the top device inset; shielded header gestures
  must not reach the map.
- PageFrame's performance marker requires layout, focus, active app and completed
  root startup. It means frame-layout readiness; optional data and transitions
  may still be pending. Measurement failures cannot block the frame.
- Keep scene backgrounds opaque and use theme background to prevent outgoing text
  appearing through incoming navigation scenes.
- Check Back round trips, retained drafts/scroll, live blur restoration, Reduce
  Transparency, effect changes and covered/uncovered taps on both platforms.
