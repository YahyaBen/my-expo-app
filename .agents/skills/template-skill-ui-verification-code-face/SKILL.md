---
name: template-skill-ui-verification-code-face
description: Compose a four-digit demo input with decorative verification feedback.
---

# Verification code face

Import `VerificationCodeFace` from `@components/ui` inside an existing Host.
[Source](../../../src/components/ui/verification-code-face/verification-code-face.tsx)
owns one native input, Reset, status messages and decorative Skia artwork.
The local success code is `1111`; this starter performs no authentication or
network verification.

- Preserve raw controlled input. Normalize Arabic, Persian and full-width digits
  only for comparison.
- Use one four-character numeric field without mount autofocus. Blur on
  completion; Reset clears and blurs.
- Native input status and translated helper text communicate success/error.
- Hide decorative artwork from accessibility. Keep its RN bridge separate from
  the native input/control tree.
- Animate face progress/expression on the UI runtime and honor `useMotionEnabled`.
- Keep helpers and existing selectors within this family.

Use [native stories](../../../.rnstorybook/stories/components/verification-code-face.stories.tsx)
to verify `1111`, rejected/partial input, supported digit scripts, Reset,
keyboard behavior, reduced motion, RTL and both appearances.
