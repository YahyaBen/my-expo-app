---
name: template-skill-ui-verification-code-face
description: Compose controlled numeric code entry with caller-owned validation and decorative face feedback.
---

# Verification code face

Import `VerificationCodeFace` from `@components/ui` inside an existing Host.
[Source](../../../src/components/ui/verification-code-face/verification-code-face.tsx)
owns one native input, optional Reset and decorative Skia artwork. Compose it
inside an existing Host. The parent owns the value, validation and labels.

`VerificationCodeFaceProps` requires `value: string`, `onChangeText(value)` and
`label`. Optional props are `length` (default 4), `status` (`default`, `success`
or `error`), `helperText`, `resetLabel`, `faceSize` (default 96), `disabled`,
`onComplete(code)` and `testID` (default `verification-code-face`).

Pass a translated `resetLabel` to render the Reset button. It calls
`onChangeText('')`; neither value changes from props nor Reset fire completion.
The component performs no authentication, request or correctness check. Apply
validation through `status`/`helperText`; a workflow may use `onComplete` to
start remote verification.

- Preserve raw controlled input. Normalize Arabic, Persian and full-width digits
  only for decorative progress and the completion callback.
- `onComplete` receives ASCII digits after a new exact-length numeric change
  event. It never fires from render, effects or externally supplied values.
- Use one numeric field without mount autofocus. Blur on a complete numeric
  entry; Reset clears and blurs. Disabled editing/Reset suppress callbacks.
- Native input status and caller-provided helper text communicate success/error.
- Hide decorative artwork from accessibility. Keep its RN bridge separate from
  the native input/control tree.
- Animate face progress/expression on the UI runtime and honor `useMotionEnabled`.
- `faceSize` scales the 96-unit Skia drawing and its surrounding rotation space.
  Keep helpers within this family; child selectors derive from `testID`.

Use [native stories](../../../.rnstorybook/stories/components/verification-code-face.stories.tsx)
to verify the controlled four/six-digit fixtures, supplied error/disabled states,
completion counts, supported digit scripts, Reset, keyboard behavior, reduced
motion, RTL and both appearances. The sample success code exists only in the
fixture, never in the shared component.
