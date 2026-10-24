---
name: foodiya-ui-list-item
description: 'Compose Foodiya native list rows using headline, supporting text and accessory slots.'
---

# List item

Import `ListItem` and `ListItemProps` from `@components/ui`. Use children for the
headline, `supportingText` for details, and `leading`/`trailing` for accessories.
The existing component retains Expo UI's native row and adds optional `disabled`.
There is no separate SettingsRow or ListRow component.

Keep `Leading`, `Supporting` and `Trailing` slots attached to Expo's original
markers. Caller props, colors and modifier order pass through. On Android,
passive row selectors are appended after caller modifiers; actionable row
selectors belong to the full-cell native action boundary. The Android adapter
uses the existing `ListItemAction` around the complete Material ListItem, with
native disabled semantics and a callback guard. The iOS adapter keeps Expo's
SwiftUI ListItem, uses automatic Form button styling for actions unless caller
modifiers select a style, and disables it through its enclosing native Column
while guarding the callback. Shared props and original slot types live in
[list-item.d.ts](../../../src/components/ui/list-item/list-item.d.ts); Metro selects
the existing component's iOS or Android renderer.

Place `ListItem` directly in `FieldGroup.Section` (or a Fragment). The pinned
[Expo UI compatibility patch](../../../config/patch-expo-ui.cjs) lets Android
FieldGroup recognize native row slot markers and render that cell once, applying
section colors and an outer clip for connected corners and full-cell ripple.
The patch runs at postinstall, is idempotent, and fails on unsupported package
versions/source. Review it during upgrades. It changes JavaScript only.

Keep independently interactive pickers and switches in ordinary passive
Row/Column composition or use the native labelled control directly. The iOS
ListItem is a Button even without `onPress`; do not nest independent controls
inside it. Use translated Text content and the owning Host's semantic colors.

`ListItemAction` and `ListItemActionProps` remain available for existing custom
native action content. They add no Host, padding or theme-button geometry. iOS
uses an automatic SwiftUI Button within its owning Form/List; Android uses a
transparent clickable Compose Surface. Do not add another clickable boundary
around an actionable ListItem.

Registration, [Settings](../../../src/features/settings/settings-screen.tsx), the
[list showcase](../../../src/features/ui-showcase/list-screen.tsx) and the
[FieldGroup showcase](../../../src/features/ui-showcase/field-group-screen.tsx)
use this existing component. Compose inside `UniversalHost` and preserve its
scheme, tint and direction.

Native stories live in
[list.stories.tsx](../../../.rnstorybook/stories/components/list.stories.tsx) and
the `SettingsRowFeedback` fixture in
[field-group.stories.tsx](../../../.rnstorybook/stories/forms/field-group.stories.tsx).
Exercise padding-edge presses, rounded first/middle/last cells, disabled
suppression, compound slots, appearance, RTL and independent controls on both
platforms. Static checks and fixture registration do not establish device
feedback. Run lint/typecheck and regenerate registration after story changes.

Follow [Foodiya implementation](../foodiya-implementation/SKILL.md),
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md) and the
[FieldGroup contract](../foodiya-ui-field-group/SKILL.md).
