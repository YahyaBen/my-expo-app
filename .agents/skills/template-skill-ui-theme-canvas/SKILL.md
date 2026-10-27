---
name: template-skill-ui-theme-canvas
description: Compose decorative appearance artwork and captured-page color-scheme reveals.
---

# Theme canvas

Import `ThemeCanvas`, `ColorSchemeCanvas`, `ColorSchemeTransition` and
`ColorSchemeTransitionControl` from `@components/ui`.
[Source](../../../src/components/ui/theme-canvas/) owns visual presentation;
preference restoration/storage remain in the existing appearance provider.

## Canvas composition

- `ThemeCanvas()` combines the starter heading, native Dark mode switch and
  artwork inside an existing Host. Its switch updates the owning provider and
  waits for `appearanceReady`.
- `ColorSchemeCanvas({ testID? })` inherits Host scheme/direction and measures
  available width within a 160-point/dp frame. Its sun/moon reveal uses a 300ms
  Skia circle. It creates no Host or preference provider.
- Keep controls outside decorative artwork. Rapid changes/unmount cancel motion;
  reduced motion and inactive state settle it immediately.

## Captured-page reveal

- `ColorSchemeTransition({ children })` wraps a bounded RN page.
  Settings includes its header and form inside this boundary.
- `ColorSchemeTransitionControl` must render below that wrapper and delegates
  the existing System/Light/Dark picker through its context.
- Capture the previous page with `react-native-view-shot`, apply the preference
  and reveal the live page through the existing 300ms Skia circle.
- Preserve duplicate-selection guards, temporary capture-file release,
  stale/unmount guards and resize handling. Reduced motion or capture failure
  applies the preference immediately.
- Native capture requires a development client containing the module.
  Keep on-demand loading/fallback for older clients and existing Settings IDs.

Use [Theme Canvas stories](../../../.rnstorybook/stories/components/theme-canvas.stories.tsx)
and the [Settings fixture](../../../.rnstorybook/stories/components/appearance-canvas.stories.tsx)
to verify snapshot coverage, picker taps, rapid choices, System changes,
resizing, reduced motion and RTL on native devices.
