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
- Preserve native sizing, large text and Host appearance. These adapters provide
  equivalent interactions; native shape, padding and colors differ.

Use [Chip/Playground](../../../.rnstorybook/stories/components/chip.stories.tsx)
for selection, removal, disabled guards, translated labels and live RTL. Verify
VoiceOver/TalkBack selection announcements and actual touch bounds on devices.
