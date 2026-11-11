---
name: template-skill-ui-field-group
description: Compose grouped native settings forms with one bounded scroll owner.
---

# FieldGroup

Import `FieldGroup` from `@components/ui`.
Sources: [field-group/](../../../src/components/ui/field-group/) and
[Settings page](../../../src/features/settings/settings-screen.tsx).

## Structure

- `FieldGroup` owns scrolling: SwiftUI Form / Compose LazyColumn.
  Give its Host a bounded viewport. `PageScreen scrollable={false}` shares the
  ordinary page frame without nesting another scroll view. `PageFrame` and
  `AuthScreenFrame grouped` also support custom form boundaries.
- Place `FieldGroup.Section` directly in the group. Optional `title` and
  `titleUppercase` name the section; SwiftUI controls its own header casing.
- Place `SectionHeader` / `SectionFooter` markers directly in their section.
  A custom header replaces the title. Keep markers visible to native parsing,
  with one header/footer per section.
- Both platforms re-export Expo UI's universal `FieldGroup`. Keep the native
  section, header and footer markers visible to Expo.

## Screen composition

- Put navigation/detail `ListItem.FieldRow` rows directly in a section. Keep
  independently interactive pickers/switches in passive native layout.
- Reuse `pageFormModifiers` to hide the system form canvas. Clearing only the
  background does not hide iOS Form's canvas.
- Use one fill Host and the existing safe-area/keyboard owners. FieldGroup owns
  section gutters; do not repeat page padding or add a Host per row.
- For content behind the header, use `PageScreen scrollable={false}` or
  `PageFrame headerMode="scroll"` and apply `usePageHeaderInset()` inside the
  first section header only. Keep the viewport bounded/clipped so content scrolls
  beneath the blur. Settings puts raised-dock clearance in its final section footer.
- Settings remounts only its iOS `FieldGroup` when direction changes because
  native cells may retain old direction. Keep controlled state above that boundary;
  ordinary edits and appearance changes retain the form.
- Form state, validation and preference persistence belong to existing owners.
  Showcase controls use local values and an isolated appearance.

Use the [component examples](../../../src/features/template/component-screen.tsx).
Verify final-row reachability, header scrolling,
keyboard access, grouping, control names and live RTL on both platforms.
