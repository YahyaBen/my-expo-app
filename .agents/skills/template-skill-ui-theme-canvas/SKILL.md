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

- `ThemeCanvas({ colorScheme, onColorSchemeChange, label, disabled?, height?, testID? })`
  is controlled native content inside an existing Host. The caller supplies its
  translated label and owns state, persistence and readiness/disabled guards.
  It contains no starter headings or saved-preference writes.
- `ColorSchemeCanvas({ colorScheme?, height?, testID? })` is decorative content.
  Omit its scheme to follow the Host or pass one for a local preview. It measures
  available width; height defaults to 160 points/dp and the illustration scales
  down for small frames. Its sun/moon reveal uses a 300ms Skia circle.
  Neither component creates a Host or preference provider.
- `ThemeCanvas` defaults `testID` to `theme-canvas`; its switch and artwork use
  `-switch` and `-artwork` suffixes. Standalone artwork defaults to
  `color-scheme-canvas`. Consumers may supply their own stable selectors.
- Keep controls outside decorative artwork. Rapid changes/unmount cancel motion;
  reduced motion and inactive state settle it immediately.

## Captured-page reveal

- `ColorSchemeTransition({ children, duration?, testID?, revealTestID? })` wraps
  a bounded RN page and retains integration with the existing appearance provider.
  Duration defaults to 300ms, `testID` to `color-scheme-transition`, and the image
  overlay to `${testID}-reveal`. Settings includes its header and form and supplies
  its established selectors explicitly.
- `ColorSchemeTransitionControl({ testID? })` must render below that wrapper and
  delegates the existing System/Light/Dark picker through its context.
  Its default selector is `color-scheme-transition-control`.
- Capture the previous page with `react-native-view-shot`, apply the preference
  and reveal the live page through the configured Skia circle.
- Preserve duplicate-selection guards, temporary capture-file release,
  stale/unmount guards and resize handling. Reduced motion or capture failure
  applies the preference immediately.
- Native capture requires a development client containing the module.
  Keep on-demand loading/fallback for older clients.

Use [Theme Canvas stories](../../../.rnstorybook/stories/components/theme-canvas.stories.tsx)
and the [Settings fixture](../../../.rnstorybook/stories/components/appearance-canvas.stories.tsx)
to verify callback-controlled appearance, local-only state, custom labels/heights,
disabled suppression, snapshot coverage, picker taps, rapid choices, System
changes, resizing, reduced motion and RTL on native devices.
