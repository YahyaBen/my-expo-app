---
name: template-skill-ui-list-item
description: Compose native list rows with preserved slots and full-cell action semantics.
---

# List item

Import `ListItem` and `ListItemProps` from `@components/ui`.
Source: [list-item/](../../../src/components/ui/list-item/).

- Children supply the headline; `supportingText`, `leading` and `trailing`
  supply details and accessories. Preserve Expo's original compound-slot markers.
- Both adapters default to full width and preserve caller props and modifier
  order. Put caller modifiers before the width default on Android so Compose
  applies caller width constraints first. Both adapters suppress disabled callbacks.
- Android forwards taps and `testID` to Expo's Material row. A disabled row is
  rendered as passive content. Its container defaults to transparent and accepts
  a caller-provided color.
- Use `ListItem.FieldRow` directly in `FieldGroup.Section`. On Android, Expo
  supplies one native row with the section inset, connected corners and clipped
  ripple. Omit `onPress` to disable the row on either platform.
- iOS uses the native ListItem button directly. Its default plain style keeps
  full-row tap handling and callers can override it with `buttonStyle`. Apply
  the width and disabled modifiers to the row button itself.
- An iOS ListItem is a Button even without `onPress`. Keep independently
  interactive switches/pickers in passive Row/Column layouts or use their
  native labelled controls.

Use translated text and the owning Host's theme. Check padding-edge taps,
first/middle/last corners, compound slots, disabled state and RTL on both platforms.
Use the [list and field-group examples](../../../src/features/template/component-screen.tsx).
