---
name: template-skill-ui-text-input
description: Compose native string inputs with stable editing, refs and named icon actions.
---

# TextInput

Import `TextInput` / `TextInputRef` from `@components/ui` inside an existing
Host. Source: [text-input/](../../../src/components/ui/text-input/).
The wrapper owns a native observable but accepts a plain string `value`.

## Editing ownership

- Controlled: use a string from the first render and reflect `onChangeText`.
  Reset through state/form reset; do not alternate undefined/string or change keys.
- Uncontrolled: omit `value`; `defaultValue` seeds only the first native value.
  Observe changes/submit or use ref `clear()`; changing the seed is not a reset.
- Preserve one field across appearance/language/status/password changes.
  Keep validation, search requests and persistence in the owning workflow.
- Ref methods: `focus()`, `blur()`, `clear()`, `isFocused()`,
  async `setSelection(start, end)`. There is no `getValue()`.
- Callbacks receive direct values: text strings for change/submit, no args for
  focus/blur, `{ start, end }` for selection and `{ width, height }` for size.
  Do not read RN event objects or pass RN input props wholesale.

## Supported additions and precedence

- Translated `label`, `placeholder`, `helperText`; visual `status` is
  `default`, `error`, `success` or `warning` and does not validate.
- `disabled` forces editing off and suppresses trailing actions.
  `readOnly` / `editable={false}` leave a trailing action available;
  explicit `editable` wins over `readOnly`, while disabled wins over both.
- `leftIcon` / `rightIcon` use `Icon.select` and logical RTL positions.
  A trailing action requires both `rightIcon` and `onRightIconPress` plus
  translated `rightIconAccessibilityLabel`; without a callback it is decorative.
- Keyboard hints are not validation. Keep numbers as strings while editing.
  Explicit `keyboardType` / `returnKeyType` win over `inputMode` /
  `enterKeyHint`; `numberOfLines` wins over `rows`.
- Secure fields stay single-line. Toggle secure entry/icons/action name on the
  same public field; iOS internally switches native field types.
  iOS secure entry ignores selection/multiline; ordinary selection needs iOS 18+.
  `selection` remains an Expo observable; `selectTextOnFocus` replaces its range.
- `onSubmitEditing` does not submit or advance focus automatically.
  Provide a reachable action for keyboards without a return key.

## Styling and accessibility

- Host/theme tokens supply surface, border, text and semantic colors.
  Status colors precede focus styling; explicit caller colors may override them.
- `style` targets the outer field Row; width also constrains its label/helper
  Column. `textStyle` targets editable text and `modifiers` the inner input.
- Omitted radius uses `design.shape.inputRadius`; explicit radius preserves zero.
  Keep the flexible input, 48-point/dp minimum surface and trailing touch target.
  Avoid fixed heights that clip large text.
- Content-size callbacks measure the inner native view, not the full wrapper
  or pure text height.
- The visible label also names the native editable field. There is no public
  `accessibilityLabel` prop; selectors are not spoken names. Android's upstream
  read-only mapping does not prove a distinct disabled announcement.
- Keep helper/errors understandable without color and allow wrapping. Check
  duplicate label stops, secure reveal, native focus and RTL on devices.

Use the [showcase](../../../src/features/ui-showcase/input-screen.tsx)
at `/ui-component/input` for reset/ref, feedback, password, read-only and
multiline examples. Verify keyboard reachability and native cursor behavior
separately from lint/typecheck.
