---
name: template-skill-ui-badge
description: Compose noninteractive native status badges with light and dark semantic treatments.
---

# Badge

Import `Badge`, `BadgeProps` and `BadgeVariant` from `@components/ui` inside an
existing Host. Source: [badge/](../../../src/components/ui/badge/).

- Supply a string `label`; `variant` defaults to `default`. Supported treatments
  are default, secondary, destructive and outline.
- Badges are readable status text without press, selection or disabled behavior.
  The native text exposes the label and optional `testID`.
- Colors follow the owning Host. Default uses an inverse neutral surface;
  secondary uses surfaceVariant/text, destructive uses errorContainer/onErrorContainer,
  and outline has a transparent fill with a native capsule border.
- Preserve intrinsic width and text scaling. Avoid fixed dimensions or truncation
  for essential status text. iOS uses a capsule background/stroke; Android uses a
  nonclickable Material Surface with a pill shape.

Use [Badge/Playground](../../../.rnstorybook/stories/components/badge.stories.tsx)
to inspect all variants, label changes, light/dark, RTL and translated text.
Verify large text, contrast and VoiceOver/TalkBack reading on both platforms.
