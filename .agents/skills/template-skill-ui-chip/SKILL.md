---
name: template-skill-ui-chip
description: Compose controlled native action, filter, input and suggestion chips.
---

# Chip

Import `Chip` and `ChipProps` from `@components/ui` inside an existing Host.
Source: [chip/](../../../src/components/ui/chip/).

- Android uses Material AssistChip, FilterChip, InputChip and SuggestionChip.
  iOS uses native bordered capsule buttons, with prominent selected treatment.
- Supply a label and onPress. Assist and suggestion variants are actions;
  filter and input variants require a controlled selected value.
- The caller owns selection, token removal and action outcomes. An input chip
  does not remove itself and has no separate trailing removal target.
- Disabled chips suppress callbacks. The label supplies the accessible name;
  use accessibilityLabel only when a different spoken name is needed.
- Use `appearance="filled"` over maps or artwork for an opaque native
  container and contrasting selected colors from the Host theme. The default
  `native` appearance keeps platform styling. Do not paint a wrapper around
  native touch padding to simulate a filled chip.
- Preserve native sizing, large text and Host appearance. These adapters provide
  equivalent interactions; native shape, padding and colors differ.

Use the [chip examples](../../../src/features/template/chip-examples.tsx)
for selection, removal, disabled guards, translated labels and live RTL. Verify
VoiceOver/TalkBack selection announcements and actual touch bounds on devices.
