---
name: template-skill-ui-native
description: Compose native layout primitives and apply shared width, fill, row-weight and minimum-height modifiers.
---

# Native layout and sizing

`Row`, `Column`, `Spacer`, `ScrollView` and `RNHostView` are direct Expo UI
exports from `@components/ui`; they have no project wrapper contract. Check their
installed types in `node_modules/@expo/ui/src/universal/` before adding props.

- Compose Row/Column inside an existing Host; `PageScreen` already supplies one.
  Use `spacing` for gaps and `alignment` for cross-axis alignment. Allow translated
  labels and large text to grow; switch crowded rows to vertical layouts.
- Spacer distributes available space along the parent's axis and requires real
  bounds. Use parent spacing for ordinary gaps and preserve live layout direction.
- Bound ScrollView's viewport, avoid nested scrolling on the same axis and keep
  refresh work in the feature. Use `RefreshableScrollView` for pull-to-refresh and
  a virtualized list for large datasets.
- RNHostView bridges RN artwork into native content. Supply a width constraint;
  percentage widths can collapse under intrinsic measurement. A native group
  inside that RN subtree needs one Host or an existing standalone hosted control.
  Check bridge bounds and touch handling on both platforms.

Import these modifier helpers from `@components/ui`.
Source: [native-fill-width declarations and adapters](../../../src/components/ui/native/).

| Helper                            | Purpose                                         |
| --------------------------------- | ----------------------------------------------- |
| `nativeFillWidth`                 | Fill a constrained parent's width               |
| `nativeFillWidthCenter`           | Full width with centered frame alignment on iOS |
| `nativeFillWidthEnd`              | Full width with trailing frame alignment on iOS |
| `nativeFillSize`                  | Fill both axes of a bounded parent              |
| `nativeRowWeight`                 | Share remaining width as a direct Row child     |
| `nativeCenteredMinHeight(height)` | Center short content while allowing growth      |

- Center/end helpers alias fill-width on Android. Also set Column alignment
  when child alignment must match across platforms.
- Put row weight on direct children, usually one Column per equal-width action.
- A fill requires real parent bounds. Avoid fill-size inside an unbounded
  vertical scroll; use centered minimum height for short scroll content.
- These values are modifier arrays, not RN styles. Spread to combine and never
  mutate shared arrays.
- `native-children.ts` is a private compound-slot parser.
- For SwiftUI frames, chain separate fixed and flexible dimension modifiers.
  Set raw HStack/VStack spacing explicitly when zero is intended.

Check direct-child weight, constrained fills, center/end alignment, RTL and large
text with the [Native layout showcase](../../../.rnstorybook/components/catalog/native-preview.tsx).
