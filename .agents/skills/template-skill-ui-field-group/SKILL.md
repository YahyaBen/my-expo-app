---
name: template-skill-ui-field-group
description: Compose grouped native settings forms with one bounded scroll owner.
---

# FieldGroup

Import `FieldGroup` from `@components/ui`.
Sources: [field-group/](../../../src/components/ui/field-group/) and
[Settings example](../../../src/features/settings/settings-screen.tsx).

## Structure

- `FieldGroup` owns scrolling: SwiftUI Form / Compose LazyColumn.
  Give its Host a bounded viewport. Use `PageFrame` or
  `AuthScreenFrame grouped`; do not nest a full form in `PageScreen` scrolling.
- Place `FieldGroup.Section` directly in the group. Optional `title` and
  `titleUppercase` name the section; SwiftUI controls its own header casing.
- Place `SectionHeader` / `SectionFooter` markers directly in their section.
  A custom header replaces the title. Keep markers visible to native parsing,
  with one header/footer per section.
- iOS directly re-exports Expo UI. Android recognizes original ListItem markers
  to avoid a second Material cell, preserving grouped corners and caller
  colors/modifiers. Do not hide markers behind opaque custom React wrappers.

## Screen composition

- Put navigation/detail `ListItem` rows directly in a section. Keep independently
  interactive pickers/switches in passive native layout, outside clickable rows.
- Reuse `pageFormModifiers` to hide the system form canvas. Clearing only the
  background does not hide iOS Form's canvas.
- Use one fill Host and the existing safe-area/keyboard owners. FieldGroup owns
  section gutters; do not repeat page padding or add a Host per row.
- For content behind the header, use `PageFrame scrollsBehindHeader` and apply
  `usePageHeaderInset()` inside the first section header only. Keep the
  viewport bounded/clipped so content scrolls beneath the blur.
- Settings remounts only its iOS form Host on direction changes because native
  cells may retain old direction. Keep controlled state above that boundary.
  Ordinary edits and appearance changes must retain the form.
- Form state, validation and preference persistence belong to existing owners.
  Showcase controls use local values and an isolated appearance.

Use the [showcase](../../../src/features/ui-showcase/field-group-screen.tsx)
at `/ui-component/field-group`. Verify final-row reachability, header scrolling,
keyboard access, grouping, control names and live RTL on both platforms.
