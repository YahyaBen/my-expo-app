---
name: template-skill-ui-otp-bottom-sheet
description: Maintain six-digit OTP entry, verification and resend lifecycle.
---

# OTP bottom sheet

Import `OtpBottomSheet` from `@components/ui`.
Source: [otp-bottom-sheet/](../../../src/components/ui/otp-bottom-sheet/).

## Public workflow

- Control `isPresented` / `onDismiss`, display `recipient`, and implement
  `onVerify(code)` to return acceptance or throw on request failure.
  The component performs no authentication or delivery itself.
- Optional `onResend` enables a 30-second cooldown;
  `resendCooldownSeconds` overrides it. Other options: `hint`,
  `colorScheme`, `testID`.
- Successful verification shows confirmation and Done. Reopening clears code
  and feedback. Preserve duplicate-request and stale-session guards after
  dismissal/unmount.
- Opening resets React form state before presenting and clears native text in
  a layout effect. Do not key/remount the form merely to reset it.

## Native input and presentation

- One transparent native field overlays six decorative slots, preserving
  paste/autofill/selection/backspace. Normalize Western, Arabic, Persian and
  full-width digits; strip pasted separators.
- Keep the measured numeric row in an explicit-width LTR Host while surrounding
  copy follows RTL. Mount input after its native section is measured; retain
  values on resize and grow height for font scaling.
- Preserve platform overlay stacks, inset rounded slot fills and the plain iOS
  input. These prevent native chrome from covering slots or clipping borders.
- Use the shared sheet's native shell and transition. Its bounded scroll
  viewport is `min(windowHeight * 0.7, 620)`; an unbounded Compose vertical
  scroll can fail measurement. Avoid iOS width-only modifiers that erase height.
- Heading/delivery copy is leading-aligned, recipient bold. Filled slots keep
  neutral fills; focus uses text color and rejection uses error colors.
  Display only supplied hints, resend confirmation and actual errors.

## Timers and feedback

- Keep private countdown/feedback components at module scope with independent
  state boundaries. Countdown ticks must not rerender the form/input.
- Stop the timer at zero, on dismissal/inactivity or without a resend action.
  Recompute from the wall-clock deadline on resume; backgrounding does not
  extend cooldown.
- Feedback uses existing declarative Reanimated CSS keyframes and respects
  activity/reduced motion. Preserve verification/resend guards independently.

The [showcase](../../../.rnstorybook/components/catalog/bottom-sheet-preview.tsx)
uses local simulation: only `123456` succeeds and resend sends no message.
Verify reopening, native autofill/keyboard, incomplete/duplicate submissions,
request failure, cooldown expiry across backgrounding and late completions.
