---
name: template-skill-ui-navigation
description: Compose the four-destination native tab dock and its raised center action.
---

# Tab navigation

Import `TabNavigationBar` and its item/props types from `@components/ui`.
Source: [navigation/](../../../src/components/ui/navigation/).

## Public contract

- `items` is a readonly tuple of exactly four records: stable `id`,
  translated `label`, optional typed `icon` override and `testID`.
- `activeId` is `home`, `search`, `recipes` or `more`.
- `onSelect(id)` delegates navigation to the consumer.
- `action` supplies center-button `kind`, translated `label`, `onPress`
  and optional `disabled`/`testID`. It adds no route.
- Optional bottom/left/right insets belong to the dock; scheme defaults to the Host.
- Optional caller-owned `hideProgress` is a Reanimated shared number: 0 is visible,
  1 is hidden. The dock slides out and releases its row/system-inset reservation;
  its parent must clip offscreen content. Omitting it keeps the dock visible.
- Optional `appearanceOriginRef` exposes the native controls frame, whose center
  matches the raised floating action. The template shell uses it as the theme
  reveal's origin; component previews omit it. Attach it to the existing
  non-collapsible React Native controls `View`, whose ref supports
  `measureInWindow`, rather than the Expo `Host` wrapper.
- Route state and sheet state stay in the consumer.

Template's shell follows native scroll geometry on iOS 18+ and observes vertical
content swipes alongside Compose on Android, with direction thresholds to avoid
jitter. Earlier iOS keeps the dock visible. Android follows finger movement,
not momentum; horizontal gestures do not trigger hiding. Hide/reveal transitions
take 520 ms in either direction. The
shell restores the dock on tab/focus/viewport changes and keeps it visible in
Settings, with open menus/keyboards, Reduce Motion or a screen reader. Keep swipe
coordination in the shell; do not replace native scroll owners.

## Geometry and safe areas

The bar owns one bounded Host. Its 84-point native frame contains the entire
76-point center circle. A negative 28-point `tabBarRaisedHeight` margin overlaps
content; only the 56-point row plus bottom system inset reserves screen height.
Keep the raised region transparent and all controls inside the native touch frame.

Tab content adds only the raised-height trailing clearance and omits another
bottom system inset. `PageScreen tab` supplies it for ordinary scrolling content;
Settings keeps its native `FieldGroup` and adds clearance in the final section footer.
Do not add the full dock height to content padding.

Keep the background full-width and flat. Apply the larger left/right device inset
symmetrically to controls so they stay centered in either landscape direction.
The controls center within the safe viewport at `screenContentMaxWidth` (1024 points). Selected icons have a 44×28
capsule using `tabBarSelectedBackground`; labels remain outside it. Preserve
semantic active/inactive colors, native selected state and live RTL ordering.

Check selection, disabled action, circle-edge taps, end-of-scroll clearance,
swipe hide/reveal and reversals, horizontal carousels, native scrolling, keyboard,
screen readers and device insets using the
[native template navigation](../../../src/features/template/template-screen.tsx).
