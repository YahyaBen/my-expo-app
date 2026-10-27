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
  overrides for native typography. Presets read the active theme's typography.
- Tones: default, muted, primary, secondary, success, warning, error, info.
  Default uses text; primary uses tint. Filled-control primary/onPrimary tokens
  have different contrast duties.
- Explicit fontSize/fontWeight override presets; final textStyle font fields
  override both.
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
semantics using the [Text showcase](../../../src/features/ui-showcase/text-screen.tsx).
Isolated previews must re-enter native UI with an explicit scheme after RN bridges
and must not write saved app preferences.
