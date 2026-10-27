---
name: template-skill-ui-switch
description: Compose controlled native boolean settings with safe label sizing.
---

# Switch

Import `Switch` from `@components/ui` inside an existing Host.
Source: [switch.tsx](../../../src/components/ui/switch/switch.tsx).

- Required: `value: boolean`, `onValueChange(next: boolean)`.
- Optional: translated `label`, `disabled`, `testID`, native `modifiers`.
  The wrapper re-exports Expo props and guards disabled callbacks.
- Apply the callback's next value. Persistence/validation belong to existing
  preference or form owners; showcase values stay local.
- Disabled keeps on/off state visible and suppresses activation; disabling does
  not clear a setting. Use actual disabled state rather than opacity alone.
- Keep native labels, hit areas and Host colors. Do not nest the switch in
  another clickable row or add imitation control artwork.
- Android modifiers target the inner switch, not its label Row.
  `nativeFillWidth` on a labeled Android switch consumes the label space.
  Constrain the parent instead; apply any iOS full-width Toggle modifier only
  on iOS. Android's label already has row weight and wraps in remaining width.
- There are no `checked`, `onChange`, `style`, `color`, `loading` or
  children props.

Use the [showcase](../../../src/features/ui-showcase/switch-screen.tsx)
at `/ui-component/switch`. Verify label activation, disabled on/off states,
native spoken state, RTL and large-text wrapping.
