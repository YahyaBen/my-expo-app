---
name: template-skill-ui-table
description: Compose bounded native tables with fixed columns and consumer-owned row actions.
---

# Table

Import `Table`, `TableActions` and their types from `@components/ui`.
Source: [table/](../../../src/components/ui/table/).
Both are content-only and require an existing native Host.

## Data and layout

- Supply `rows`, `columns`, stable `keyExtractor` and `emptyState`.
- Columns have stable `id`, translated `header`, `renderCell`, optional numeric
  `width` (144 points by default) and logical start/center/end `align`.
- Width includes cell padding. Let rows grow and overflow scroll horizontally.
  Do not combine fixed cell width with fill-width modifiers.
- String/number cells and empty content receive themed text. Custom cells,
  empty content and `toolbar` must contain native UI.
- Pass a bounded dataset or one page; Table renders every row.
- The consumer owns filters, counts, reset, query states, pagination and navigation.
- Body/header/outline use Host-resolved surface, surfaceVariant and border tokens.

## Row actions

Set `renderActions` and translated `actionsHeader`; action width defaults to 112.
`TableActions` requires visible `label`, row-specific `accessibilityLabel`
and actions with stable `id`, translated `label`, `onPress`, optional
`disabled` and `destructive`.

Consumers own confirmation, mutation and feedback. Empty action arrays disable
the trigger; disabled items suppress callbacks. Preserve native iOS Menu/Button
and Android DropdownMenu semantics. Keep separate interactive boundaries.

Given a testID, Table derives `-scroll`, `-header`, `-row-{key}`,
`-row-{key}-cell-{columnId}` and `-empty`. Actions derive `-action-{id}`.
Check horizontal scrolling, RTL, large text, empty/filter reset, spoken row names
and disabled menus with the
[Table showcase](../../../.rnstorybook/components/catalog/table-preview.tsx).
