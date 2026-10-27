---
name: template-skill-ui-auth
description: Compose native authentication frames and login preference controls.
---

# Authentication frames

Import `AuthScreenFrame` from `@components/ui`.
Source: [auth/](../../../src/components/ui/auth/).
[LoginPreferences](../../../src/features/auth/login-preferences.tsx) is feature-local.

- The frame owns safe areas, keyboard layout, scrolling and one full-width
  native Host. Compose native content controls inside it.
- Content centers within `screenContentMaxWidth` (640 points/dp).
  `PageSection` supplies symmetric 16-point content padding. Preserve available
  keyboard-adjusted minimum height: short forms center; long forms grow/scroll.
- `topBar` stays outside the scrolling form and below the top safe area.
- `grouped` uses native `FieldGroup`; supply sections directly and keep it out
  of another vertical scroll container. The group owns gutters and transparent
  system-canvas treatment; the frame adds side safe-area insets.
- Resolve colors from the owning Host. Buttons require an explicit `variant`.
  Validation, submission and session I/O belong to existing auth owners.
- The wordmark uses uppercase `getAppBrand().name` and the secondary accent.
  Title/description use themed heading/body presets. Use
  `getBrandHeadingFont` with native Arabic/system fallbacks and root-loaded fonts.
  Preserve `${testID}-brand` and `${testID}-title`.
- Login's top-bar Host intentionally uses LTR: language stays physically left,
  appearance physically right. The language sheet is outside that Host and
  uses native sheet defaults without a content Host or added shell styling.
- Disable language/appearance changes until their restoration is ready.
  Keep the existing providers; language selection closes its sheet, and
  System/Light/Dark edits the app appearance preference.
- Keep copy neutral across English, French and Arabic. Account logout retains
  `auth-logout`, persistent `auth-logout-error` and retry on storage deletion
  failure; background revocation must not keep local sign-out pending.

Use [auth stories](../../../.rnstorybook/stories/forms/auth-screen.stories.tsx)
for narrow/wide, overflow, grouped and Host-override examples. Verify keyboard
reachability, draft retention, large text, RTL and sheet dismissal on devices.
