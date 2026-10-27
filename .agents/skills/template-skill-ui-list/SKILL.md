---
name: template-skill-ui-list
description: Compose native grouped lists and coordinate their pull-to-refresh completion.
---

# Native list

Import `List` from `@components/ui` inside a bounded native Host.
Source: [list/](../../../src/components/ui/list/).

- Compose native `ListItem` rows; the upstream List owns grouping, scrolling,
  refresh indicators and platform appearance.
- Use a virtualized feature list for large datasets.
- The wrapper adds promise coordination: duplicate gestures share pending work,
  and settlement releases the indicator even after rejection.
- The caller owns refresh work and visible error feedback.
- Inherit the Host's color scheme and tint; retain supported seed overrides.
- Use only modifiers exposed by the installed component contract.

Check refresh success, rejection, repeated gestures and retained content on both
platforms. The [native stories](../../../.rnstorybook/stories/components/list.stories.tsx)
provide grouped-list and interaction examples.
