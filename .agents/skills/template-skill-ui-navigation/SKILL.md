---
name: template-skill-ui-navigation
description: Compose the four-destination native tab dock and its raised center action.
---

# Tab navigation

Import `TabNavigationBar` and its item/props types from `@components/ui`.
Source: [navigation/](../../../src/components/ui/navigation/).

## Public contract

- `items` is a readonly tuple of exactly four records: stable `id`,
  translated `label`, optional `testID`.
- `activeId` is `home`, `search`, `recipes` or `more`.
- `onSelect(id)` delegates navigation to the consumer.
- `action` supplies center-button `kind`, translated `label`, `onPress`
  and optional `disabled`/`testID`. It adds no route.
- Optional bottom/left/right insets belong to the dock; scheme defaults to the Host.
- Route state and sheet state stay in the consumer.

## Geometry and safe areas

The bar owns one bounded Host. Its 84-point native frame contains the entire
76-point center circle. A negative 28-point `tabBarRaisedHeight` margin overlaps
content; only the 56-point row plus bottom system inset reserves screen height.
Keep the raised region transparent and all controls inside the native touch frame.

Tab content adds only the raised-height trailing clearance and omits another
bottom system inset. `PageScreen tab` and Settings' final section already do this.
Do not add the full dock height to content padding.

Keep the background full-width and flat. The controls center within the safe
viewport at `screenContentMaxWidth` (640 points). Selected icons have a 44×28
capsule using `tabBarSelectedBackground`; labels remain outside it. Preserve
semantic active/inactive colors, native selected state and live RTL ordering.

Check selection, disabled action, circle-edge taps, end-of-scroll clearance,
keyboard and device insets using the
[native navigation stories](../../../.rnstorybook/stories/components/navigation.stories.tsx).
