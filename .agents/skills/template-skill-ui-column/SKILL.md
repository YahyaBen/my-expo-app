---
name: template-skill-ui-column
description: Compose vertical native layouts with the public Column export.
---

# Column

Import `Column` from `@components/ui` for vertical native content.

- Compose inside an existing native Host; `PageScreen` already supplies one.
- Use `spacing` for child gaps and `alignment` for cross-axis alignment.
- Apply `nativeFillWidth` only when the parent supplies a width constraint.
- Use `nativeRowWeight` when the Column is a direct child sharing a Row.
- Let translated labels and large text grow; avoid fixed content heights.
- A Host provides native ownership; Column arranges its children.

Read the [public export](../../../src/components/ui/index.ts) and installed
[Column types](../../../node_modules/@expo/ui/src/universal/Column/)
before adding props or modifiers.
