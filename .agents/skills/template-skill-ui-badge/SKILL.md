---
name: template-skill-ui-badge
description: Compose noninteractive native status badges with light and dark semantic treatments.
---

# Badge

Import `Badge`, `BadgeProps` and `BadgeVariant` from `@components/ui` inside an
existing Host. Source: [badge/](../../../src/components/ui/badge/).

- Supply a string `label`; `variant` defaults to `default`. Supported treatments
  are default, secondary, destructive, outline and verified. Pass a formatted
  count such as `20+` as the label for a counter.
- Pass `icon` with an iOS SF Symbol and an Android Material Symbol to add a
  decorative leading icon to any variant. It overrides the default verified icon.
- Badges are readable status text without press, selection or disabled behavior.
  The native text exposes the label and optional `testID`.
- Colors follow the owning Host. Default uses an inverse neutral surface;
  secondary uses surfaceVariant/text, destructive uses error/onError, and outline
  has a transparent fill with a native capsule border. Verified uses info/onInfo
  and a platform verification symbol by default.
- Preserve intrinsic width and text scaling. Avoid fixed dimensions or truncation
  for essential status text. iOS uses a capsule background/stroke; Android uses a
  nonclickable Material Surface with a pill shape.

Use the [badge example](../../../src/features/template/component-screen.tsx)
to inspect all variants, label changes, light/dark, RTL and translated text.
Verify large text, contrast and VoiceOver/TalkBack reading on both platforms.
