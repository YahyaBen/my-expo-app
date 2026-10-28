---
name: template-skill-ui-list
description: Compose native grouped lists and coordinate their pull-to-refresh completion.
---

# Native list

Import `List` and `ListForEach` from `@components/ui` inside a bounded native Host.
Source: [list/](../../../src/components/ui/list/).

- Compose native `ListItem` rows; the upstream List owns grouping, scrolling,
  refresh indicators and platform appearance.
- For datasets, put `ListForEach` directly inside `List` with stable `data`,
  `keyExtractor` and a stable row renderer. Rows share the owning Host; do not
  wrap each row in another Host or an RN bridge.
- Keep recycling enabled. Set `estimatedItemSize` from row geometry and scaled
  typography; it is an estimate, so native wrapping can increase the height.
  Use a small `overscanCount` for expensive rows and verify fast scrolling.
- A recycled row retains its local state when assigned a different item. Keep
  entity state outside the row or reset it when the item changes.
- The wrapper adds promise coordination: duplicate gestures share pending work,
  and settlement releases the indicator even after rejection.
- The caller owns refresh work and visible error feedback.
- Inherit the Host's color scheme and tint; retain supported seed overrides.
- Use only modifiers exposed by the installed component contract.

Check refresh success, rejection, repeated gestures and retained content on both
platforms. The [native stories](../../../.rnstorybook/stories/components/list.stories.tsx)
provide grouped-list and interaction examples.
