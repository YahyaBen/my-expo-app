---
name: template-skill-ui-picker
description: Compose typed native picker menus and iOS wheel selection.
---

# Picker

Import `Picker` from `@components/ui` inside an existing Host.
Source: [picker/](../../../src/components/ui/picker/).

- Props: `selectedValue`, `onValueChange`, `children`, `appearance`,
  `enabled`, `testID`. The public declaration owns their types.
- The consumer owns a string/number value that exactly matches one item:
  numeric `2` and string `'2'` differ. Callbacks receive the value directly.
- Supply unique, stable `Picker.Item` values and translate labels. Items are
  parser markers; direct children, arrays and fragments are supported.
  Opaque custom wrappers around Items are not.
- Reconcile selection in the feature when options change.
- Disable with `enabled={false}`. Both adapters guard callbacks; Android also
  closes an expanded dropdown. There is no per-item disabled contract.
- `appearance="menu"` is default; `"wheel"` is an iOS wheel and remains an
  Android dropdown. Keep native Host colors and iOS menu-glass fallback.
- There are no `disabled`, `style`, `modifiers`, `label`, `color` or
  `onChange` props. Compose a nearby visible translated label when needed.
- Preserve Android label synchronization and `testID-option-index` selectors;
  option indexes are not domain values. Keep extraction in existing adapters.

Use the [showcase](../../../.rnstorybook/components/catalog/picker-preview.tsx)
in **Wireframes/Component Gallery**. Verify string/number values, reset, disabling an
open menu, translated label updates, native focus, RTL and large text.
