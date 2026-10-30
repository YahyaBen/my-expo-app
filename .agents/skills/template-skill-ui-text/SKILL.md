---
name: template-skill-ui-text
description: Choose native text boundaries, semantic typography and explicit color precedence.
---

# Text

Import text components and types from `@components/ui`.
Source: [universal-text.tsx](../../../src/components/ui/text/universal-text.tsx).

| Component              | Use                                                      |
| ---------------------- | -------------------------------------------------------- |
| `UniversalTextContent` | Themed content inside an existing native Host            |
| `UniversalText`        | Standalone text at an RN boundary; owns its Host         |
| `Text`                 | Raw native text when inherited foreground is intentional |

Children are strings in the installed contract. Use Row/Column for layout.

## Typography and color

- Variants: heading, title, subtitle, body, label, caption. Omit variant/font
  overrides for native typography. Presets read size, weight and line height
  from the active theme. iOS scales opted-in preset sizes/line heights once with
  the live device font scale; Compose scales its native sp units. Explicit
  modifiers retain upstream priority. iOS line height remains an approximation.
- Tones: default, muted, disabled, primary, secondary, success, warning, error, info.
  Default uses text; primary uses tint; disabled uses textDisabled for unavailable
  content only. A tone does not disable interaction. Filled-control primary/onPrimary
  tokens have different contrast duties.
- Explicit fontSize/fontWeight override presets; final textStyle font fields
  override both. A size override keeps the preset line-height ratio unless
  textStyle.lineHeight supplies an explicit value. Preset sizes remain base values
  before device font scaling.
- Active lightColor/darkColor overrides tone; final textStyle.color overrides both.
- Content colorScheme changes resolution; standalone text also sets its Host scheme.
- Raw Text can inherit a filled button's foreground. The themed wrapper supplies
  its own foreground and may override that contrast.
- Brand fonts are selected explicitly by heading owners. Preserve native fallback
  for unsupported languages, including Arabic in bundled Latin fonts.

## Layout

Use supported native box `style` and typography `textStyle`. Avoid RN style
arrays and invented props. `numberOfLines` truncates; let essential instructions
and errors wrap. Preserve logical alignment and large-text growth.

Check wrapping, truncation, override precedence, surface contrast and spoken
semantics using the [Text showcase](../../../.rnstorybook/components/catalog/text-preview.tsx).
Isolated previews must re-enter native UI with an explicit scheme after RN bridges
and must not write saved app preferences.
