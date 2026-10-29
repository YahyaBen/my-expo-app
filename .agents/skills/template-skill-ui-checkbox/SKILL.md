---
name: template-skill-ui-checkbox
description: Compose controlled native checkbox choices with disabled-state guards.
---

# Checkbox

Import `Checkbox` from `@components/ui` inside the existing Host.
Source: [checkbox.tsx](../../../src/components/ui/checkbox/checkbox.tsx).
The wrapper re-exports Expo props and guards disabled callbacks.

- Required: `value: boolean`, `onValueChange(next: boolean)`.
- Optional: translated `label`, `disabled`, `testID`, native `modifiers`.
- Use the callback's next value. Each independent choice has its own state.
  This API has no radio-group, mixed/indeterminate or validation behavior.
- Disabling preserves the selected value and suppresses activation; it does not
  clear state, validate or save preferences.
- Keep native label semantics, touch targets and Host appearance. Avoid nesting
  inside another clickable row or adding custom checkbox artwork.
- There are no `checked`, `onChange`, RN `style`, `color` or children props.
  Persistence and validation stay in the feature/form owner.

Use the [showcase](../../../.rnstorybook/components/catalog/checkbox-preview.tsx)
in **Wireframes/Component Gallery** to verify independent choices, reset, disabled
checked/unchecked values, long labels, RTL and native accessibility.
