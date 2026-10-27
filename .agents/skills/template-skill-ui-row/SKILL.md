---
name: template-skill-ui-row
description: Compose horizontal native layouts with the public Row export.
---

# Row

Import `Row` from `@components/ui` for horizontal native content.

- Compose inside an existing native Host.
- Use `spacing` for gaps and `alignment` for cross-axis alignment.
- To share remaining width, put `nativeRowWeight` on each direct child Column.
- For equal actions, place one full-width button inside each weighted Column.
- Switch to a vertical arrangement when translations or large text crowd the row.
- Preserve live layout direction; do not force physical left/right ordering.

Read the [public export](../../../src/components/ui/index.ts) and installed
[Row types](../../../node_modules/@expo/ui/src/universal/Row/)
before adding props or modifiers.
