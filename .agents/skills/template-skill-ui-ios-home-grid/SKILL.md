---
name: template-skill-ui-ios-home-grid
description: Compose a native photo grid with measured expansion and drag dismissal.
---

# Photo home grid

Import `IosHomeGrid` from `@components/ui` inside an existing native Host.
[Source](../../../src/components/ui/ios-home-grid/ios-home-grid.tsx) owns the
four-column Picsum starter grid on iOS and Android.

- Native buttons own tile/Close activation. Keep photo artwork as a
  pointer-transparent sibling of its tile button: an RN bridge inside the native
  button label can consume photo-area taps on Android.
- Measure the tapped photo and scene in window coordinates so expansion follows
  the actual LTR/RTL layout. Keep the local `GestureHandlerRootView`.
- Preserve spring return, downward distance/velocity dismissal and cancelled-drag
  reset. Hide/disable the underlying grid while expanded.
- Retain the named Close action, accessibility dismiss action and escape handler.
- Width, text-scale and direction changes reset selection. Reduced motion applies
  state without zoom or drag transforms.
- Keep helpers within this family and preserve public exports/selectors.

Use [native stories](../../../.rnstorybook/stories/components/ios-home-grid.stories.tsx)
to verify photo/label edge taps, different source tiles, Close, short/cancelled
drags, drag dismissal, large text and live RTL on both platforms.
