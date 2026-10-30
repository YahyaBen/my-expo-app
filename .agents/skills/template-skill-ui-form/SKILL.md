---
name: template-skill-ui-form
description: Bind native form fields and submit feedback to React Hook Form.
---

# Form adapters

Import `FormTextInput` and `FormSubmit` from `@components/ui` inside an
existing Host. Source: [form/](../../../src/components/ui/form/).

## Field binding

- `FormTextInput` requires React Hook Form `control` and `name`.
  It owns `value`, `defaultValue`, `ref`, `onChangeText`, `onBlur` and
  visual `status`; do not supply those separately.
- The shared input synchronizes external form resets without remounting.
  `onEdited` notifies the feature after a change.
- Translated validation errors take priority over helper text. Render a message
  only when present and allow wrapping; do not reserve empty error space.
  Validation errors add a decorative icon beside the existing message selector.
- `password` enables visibility control; `passwordToggle` selects
  `button` (default) or `icon`. Preserve native text/ref and validation state.
  Non-password fields retain caller secure-entry/trailing-icon props.
- Optional field IDs derive `-error` / `-helper`, `-visibility` for a text
  toggle, and `-right-icon` for an icon toggle. Without a field ID, leave these
  unassigned. Translate Show/Hide names independently of selectors.
- The visible input label names the native editable field. Check spoken output
  on device; opacity/editability alone do not prove a native disabled announcement.

## Submission

- `FormSubmit` requires `testID`, `label`, `pending` and `onPress`;
  optional `error` and `notice` remain visible below the action.
- Submit errors use an icon and wrapping body text on errorContainer with
  onErrorContainer foreground. Keep the existing error selector on the message.
- It renders a full-width primary content button, disables while pending and
  uses the translated waiting label. It has no arbitrary variant or
  prerequisite-disable prop.
- Connect the feature's validated submit handler. Schemas, requests, pending
  ownership and duplicate-submission guards stay in the feature.

Use [auth stories](../../../.rnstorybook/stories/forms/auth-screen.stories.tsx)
to verify resets, error focus, password visibility, optional-ID omission and
pending recovery.
