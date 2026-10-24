---
name: foodiya-ui-table
description: Compose or maintain Foodiya native tables with fixed columns, consumer-owned filters, row action menus and empty states.
---

# Table

Import `Table`, `TableActions` and their types from `@components/ui`. Follow
[Foodiya implementation](../foodiya-implementation/SKILL.md) and
[mobile UI requirements](../expo-mobile-ui-only/SKILL.md). The
[shared table](../../../src/components/ui/table/table.tsx) owns layout; the
[action types](../../../src/components/ui/table/table-actions.d.ts) and
[iOS](../../../src/components/ui/table/table-actions.ios.tsx) /
[Android](../../../src/components/ui/table/table-actions.android.tsx) adapters
own native menus.

## Compose within a Host

Both components are content-only. Reuse `PageScreen` or an existing
`UniversalHost`; provide a Host explicitly at an RN boundary. Native
`Row`, `Column` and horizontal `ScrollView` keep header and cells aligned.
There is no upstream universal Table in the installed Expo UI package.

Provide `rows`, `columns`, a stable `keyExtractor` and `emptyState`.
Each column has a stable `id`, translated `header`, `renderCell`, optional
numeric `width` (144 points/dp by default), and logical `align`
(`start`, `center`, `end`). Width includes cell padding. Rows grow with
their content; overflow scrolls horizontally. Do not add fixed row heights
or combine cell widths with fill-width modifiers.

Strings and numbers returned by `renderCell` or supplied as `emptyState`
receive themed text automatically. Custom cells, toolbar and empty content
must compose native UI. Table uses its Host scheme: `surface` for the body,
`surfaceVariant` for the header background, `text` for header labels, and `border`
for the outline and row separators.

`toolbar` accepts consumer-owned native filter controls. The consumer owns
filter state, filtering, result counts, reset, loading/errors, pagination and
navigation. Pass a bounded dataset or one page of rows: Table renders every
row and does not virtualize. An empty array shows `emptyState`; distinguish
empty results from loading or failure in the caller.

## Row actions

Set `renderActions` to add an action column. Supply a translated
`actionsHeader`; `actionsWidth` defaults to 112 points/dp. `TableActions`
requires a visible `label`, an `accessibilityLabel` including row identity,
and `actions`. Each action has a stable `id`, translated `label`, `onPress`,
optional `disabled` and optional `destructive` intent. Consumers own any
confirmation, mutation and resulting feedback.

iOS renders SwiftUI `Menu`/`Button`; Android renders Compose
`DropdownMenu`/`DropdownMenuItem` with an outlined trigger. Empty action
arrays disable the trigger. Disabled items suppress callbacks. Destructive
items use the native destructive role on iOS and semantic error color on
Android. Keep action controls separate from any independently clickable cell.

## Examples and verification

The [Table showcase](../../../src/features/ui-showcase/table-screen.tsx) is
available at `/ui-component/table`; native fixtures live in
[Components/Table](../../../.rnstorybook/stories/components/table.stories.tsx).
Follow the [Storybook workflow](../../../docs/storybook.md) and regenerate
registration after story edits.

Given `testID`, Table derives `-scroll`, `-header`, `-row-{rowKey}`,
`-row-{rowKey}-cell-{columnId}` and `-empty`. TableActions uses its ID on
the trigger and derives `-action-{actionId}` for native menu items.
Keep keys and selectors independent of translations.

Check both platforms, light/dark, live RTL, large text, horizontal scrolling,
empty/filter reset, menu dismissal, spoken row names and disabled actions.
Static checks and fixture registration do not establish native layout,
accessibility or actual menu activation; report device observations separately.
