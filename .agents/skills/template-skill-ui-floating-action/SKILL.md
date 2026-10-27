---
name: template-skill-ui-floating-action
description: Compose named native floating actions with correct Host and circular touch geometry.
---

# Floating actions

Import `FloatingAction` / `FloatingActionButton` from `@components/ui`.
Source: [floating-action/](../../../src/components/ui/floating-action/).

- `FloatingActionButton` is native content inside an existing Host.
  `FloatingAction` adds a fixed 76-point/dp `UniversalHost` at an RN boundary.
- Required: `kind`, translated `label`, `onPress`.
  Optional: `disabled`, `colorScheme`, `testID`.
- Kinds: `create`, `continue`, `filters`, `active-filters`, `liked`,
  `profile`, `submit`. Keep icon selection in the shared implementation.
- The static native circle is 76 points/dp with a 28-point/dp icon.
  Use primary/onPrimary and disabled control colors; disabled actions do not fire.
  Native feedback/haptics remain. There is no `animate` prop or artwork layer.
- Android must retain `Shape.Circle({ radius: 1 })`; its zero default clips
  the icon and touch region to the center.
- The default `tab-context-action` selector identifies the native button.
  Supply distinct stable IDs for multiple actions; IDs are not spoken labels.
- Consumers own placement, navigation and async guards. Preserve shared
  props/theme resolution plus existing iOS/Android adapters and declaration.

Use [native stories](../../../.rnstorybook/stories/components/floating-action.stories.tsx)
to verify edge taps, single activation, disabled suppression, repeated actions,
named focus and keyboard visibility on iOS/Android.
