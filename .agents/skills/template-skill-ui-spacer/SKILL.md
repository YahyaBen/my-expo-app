---
name: template-skill-ui-spacer
description: Add native flexible space inside Row and Column layouts.
---

# Spacer

Import `Spacer` from `@components/ui` inside an existing native Row or Column.

- Use it to distribute available space along the owning layout's axis.
- Give the parent real bounds when flexible space must expand.
- Use the parent's `spacing` for ordinary gaps between children.
- Preserve the screen's existing safe-area and keyboard insets.
- Check installed `SpacerProps`; React Native flex props are not its contract.

Source: [public export](../../../src/components/ui/index.ts) and installed
[Spacer types](../../../node_modules/@expo/ui/src/universal/Spacer/).
