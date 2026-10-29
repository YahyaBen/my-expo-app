---
name: template-skill-ui-collapsible
description: Compose native disclosures with retained drafts and controlled accordion state.
---

# Collapsible

Import `Collapsible` from `@components/ui` inside the existing Host.
The [local export](../../../src/components/ui/collapsible/collapsible.tsx)
directly re-exports Expo UI; inspect
[installed props](../../../node_modules/@expo/ui/src/universal/Collapsible/types.ts)
before extending usage.

- Required: `isOpen: boolean`, `onOpenChange(next: boolean)`.
- Optional: translated `label`, native text `labelStyle`, native `children`.
- There is no disabled state, custom trigger, style, modifiers, `testID`,
  `defaultOpen` or built-in accordion API.
- Keep drafts above the disclosure when they must survive collapse; native
  adapters may remove hidden content. Do not reset via keys or timers.
- Independent disclosures use independent booleans. A one-open accordion uses
  one stable identifier or null, deriving each `isOpen`.
- Expansion must not submit a contained form. Keep child controls separate
  from the header's native action.
- Retain SwiftUI DisclosureGroup and Android native expansion/animation;
  do not add duplicate chevrons or JS motion.
- The installed API has no actionable header selector. A surrounding Host/
  Column ID or expanded-content ID does not identify the header. Recheck
  upstream support before introducing header-targeted automation.

Use the [showcase](../../../.rnstorybook/components/catalog/collapsible-preview.tsx)
in **Wireframes/Component Gallery**. Verify retained drafts, accordion collapse,
keyboard/focus when hiding edited content, long labels and RTL on devices.
