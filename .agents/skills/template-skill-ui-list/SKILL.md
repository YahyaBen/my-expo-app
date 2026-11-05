---
name: template-skill-ui-list
description: Compose native grouped lists with bounded scrolling and recycled rows.
---

# Native list

Import `List` and `ListForEach` from `@components/ui` inside a bounded native Host.
Source: [list/](../../../src/components/ui/list/).

- Compose native `ListItem` rows. The upstream List owns grouping, scrolling
  and platform appearance. The screen owns any separate refresh gesture.
- For datasets, put `ListForEach` directly inside `List` with stable `data`,
  `keyExtractor` and a stable row renderer. Rows share the owning Host; do not
  wrap each row in another Host or an RN bridge.
- Keep recycling enabled. Set `estimatedItemSize` from row geometry and scaled
  typography; it is an estimate, so native wrapping can increase the height.
  Use a small `overscanCount` for expensive rows and verify fast scrolling.
- A recycled row retains its local state when assigned a different item. Keep
  entity state outside the row or reset it when the item changes.
- Inherit the Host's color scheme and tint; retain supported seed overrides.
- Use only modifiers exposed by the installed component contract.

Check scrolling, row actions and recycled content on both platforms. The [native stories](../../../.rnstorybook/stories/components/list.stories.tsx)
provide grouped-list and interaction examples.
