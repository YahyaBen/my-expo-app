# Retained custom header rendering

The app currently uses Expo Router's default native header. Custom header rendering
is commented out in PageFrame, and its blur capture target, backdrop and touch
shield are inactive. The implementation details below describe the retained
custom header. Configure the active header through Router route options.

Use this reference when changing page blur or native screen retention.
Source: [page implementation](../../../../src/components/ui/page/).

## Blur and retained screens

- Content mounts before its blur backdrop. Android's BlurTargetView must contain
  an absolute themed background child; ancestor/target backgrounds are not recorded.
  The title and Back stay outside the capture target.
- On Android, `header-effects/use-page-blur-key.ts` refreshes only the backdrop after a retained route
  regains focus and again after its incoming transition. Preserve page, content,
  target and scroll identity. Put the refresh key on `BlurView`, never on the
  page or header container.
- Stack transition events contain data.closing; tab events may omit data.
  Read data?.closing, coalesce same-frame events and cancel pending work on blur.
- Ordinary rerenders and header resizing must not refresh the backdrop. Blur
  lifecycle belongs to the backdrop; PageFrame keeps its capture target mounted.
- Headers use one rectangular native backdrop with no mask, artwork Canvas or
  header animation clock. iOS uses systemUltraThinMaterial. Android uses expo-blur
  defaults: default tint, intensity 50, reduction factor 4. SDK31Plus policy uses
  native blur on Android 12+ and translucent fallback below it.
- iOS Reduce Transparency replaces blur with theme background. Blur ignores touches;
  the page-local shield covers its own measured header height. Untitled pages
  have no header shield area.
- Keep blur strength system-owned. There is no user-facing numeric blur preference.

## Layout ownership

- `PageFrame` owns measured header geometry and safe areas. `PageHeader` owns
  title and Back, while `PageHeaderBackground` owns the rectangular native blur
  and accessibility fallback. Focus does not replace another page's geometry.
- The stack keeps its immediately previous scene visible to React Activity;
  deeper scenes can hide. Do not hide the previous scene on focus loss: Back needs
  its native layout ready throughout the transition.
- Header style is not a brand token or saved preference. App-wide Reduce Motion
  remains owned by the existing motion preferences; launch artwork remains
  independent in `launch-screen/launch-wave.tsx`.

## Decorative screen artwork

Home's [Ramadan banner](../../../../src/features/home/ramadan-banner.tsx) is static
screen content in its first `PageSection`, below the default header. Its decorative
SVG is hidden from accessibility; the translated greeting uses native text. The
banner scrolls with content and owns no header geometry, mask or animation clock.

Keep native blur, title and Back rectangular and outside decorative artwork.
Any future mask may affect artwork alone; decoration must not change header
measurements, capture targets or navigation lifecycle. Verify both native platforms
before adding motion.

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
- Use `native-back-return` with its multiline title, a scrolled page and a draft.
  Push the shorter wireframe header, then return repeatedly using both Back
  controls. Check the transition's final frame, retained title height and blur,
  then repeat with Reduce Motion, RTL and large text.
- Check Back round trips, retained drafts/scroll, live blur restoration, Reduce
  Transparency, layout changes and covered/uncovered taps on both platforms.
- Use the `change-header-style` story to toggle title presence, blur and header
  mode without resetting its native content, draft, counters or scroll state.
