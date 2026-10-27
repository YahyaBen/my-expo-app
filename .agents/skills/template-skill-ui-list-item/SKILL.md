---
name: template-skill-ui-list-item
description: Compose native list rows with preserved slots and full-cell action semantics.
---

# List item

Import `ListItem` and `ListItemProps` from `@components/ui`.
Source: [list-item/](../../../src/components/ui/list-item/).

- Children supply the headline; `supportingText`, `leading` and `trailing`
  supply details and accessories. Preserve Expo's original compound-slot markers.
- Keep caller colors, props and modifier order. The shared extension adds
  `disabled`; both adapters suppress disabled callbacks.
- Place rows directly in `FieldGroup.Section` or a Fragment so Android's section
  parser can apply connected corners, clipping and full-cell ripple once.
- Android's action boundary wraps the complete Material row. Passive selectors
  follow caller modifiers; action selectors identify the full-cell boundary.
- iOS uses SwiftUI ListItem with automatic Form button styling unless overridden,
  and applies disabled state through its native Column.
- An iOS ListItem is a Button even without `onPress`. Keep independently
  interactive switches/pickers in passive Row/Column layouts or use their
  native labelled controls.
- Existing `ListItemAction` supports custom native action content without
  Host, padding or button geometry. Do not add another action boundary around
  an actionable ListItem.

Use translated text and the owning Host's theme. Check padding-edge taps,
first/middle/last corners, compound slots, disabled state and RTL on both platforms.
Examples: [List showcase](../../../src/features/ui-showcase/list-screen.tsx)
and [FieldGroup showcase](../../../src/features/ui-showcase/field-group-screen.tsx).
