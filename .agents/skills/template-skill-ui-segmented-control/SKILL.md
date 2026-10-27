---
name: template-skill-ui-segmented-control
description: Compose controlled native segmented selection with stable option identifiers.
---

# Segmented control

Import `SegmentedControl` from `@components/ui` inside an existing Host.
Source: [segmented-control/](../../../src/components/ui/segmented-control/).

- Options are readonly `{ value: string; label: string; testID: string }`
  records. Translate labels; keep values and selectors stable.
- `selectedValue` is a string or null. `onValueChange` receives a string;
  iOS ignores null selection events. The consumer owns selection.
- Optional `label` names the iOS picker; its default is translated
  `common.options`. Android displays option labels.
- There are no disabled, color, style or modifiers props in this contract.
- Keep SwiftUI segmented Picker and Material SingleChoiceSegmentedButtonRow.
  Appearance/tint come from the Host; preserve native feedback and selected
  surfaces without a custom glass layer.
- The public declaration owns props; both platform adapters import it directly.

Use the [showcase](../../../src/features/ui-showcase/segments-screen.tsx)
at `/ui-component/segments`. Verify selection, option names/IDs, light/dark,
RTL, large text and actual touch behavior on both platforms.
