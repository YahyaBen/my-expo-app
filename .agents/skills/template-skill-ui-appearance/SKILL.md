---
name: template-skill-ui-appearance
description: Fix or change saved theme, light/dark and motion preferences, isolated previews and appearance transitions.
---

# Appearance preferences

Use `ThemeControl`, `ColorSchemeControl` and `AppearanceTransitionControl` from `@components/ui`.
Sources: [appearance controls](../../../src/components/ui/appearance/) and
[theme provider](../../../src/context/theme.context.tsx).
Own preference selection, restoration and transition coordination; palette token
definitions and native Host inheritance belong to their existing source owners.

## Preference ownership

- The brand's `presentation.palette` seeds the root palette with `ux` (the template
  default) or `system` (native colors with no app overrides). Settings exposes
  `ThemeControl`; the root opts into `allowThemeSelection`, and locked providers
  reject changes.
- Root `persistAppearance` restores `appTheme`, `appColorScheme` and
  `appAppearanceTransition` together. Accept registered theme IDs and supported
  preference values. Missing/invalid/failed reads retain the configured defaults.
  Writes share the existing serialized preference queue; failed writes leave
  the current session usable.
- Controls wait for `appearanceReady`; `ThemeControl` also uses
  `themeSelectionEnabled` to honor locked providers. Keep optional `testID` props.
- System/Light/Dark uses `appColorScheme`. System follows live device appearance;
  explicit component/Host schemes retain precedence.
  `ColorSchemeControl.onValueChange` overrides the default setter for coordination;
  an override must apply the selected preference itself.
- `AppearanceTransitionControl` selects the existing registered transition IDs.
  Circular remains the default/fallback. The provider validates and saves
  `appAppearanceTransition`; changing the effect does not change the theme.
  Disable the control during restoration and capture/reveal.
- Isolated preview providers keep palette, appearance, transition and motion
  changes in memory. They must not persist or capture the root's presentation.
- Language sheets use the existing language provider and translated autonyms.
  Arabic updates live RTL without remounting ordinary forms.
- Template's Settings tab uses root preferences through
  [the Settings feature](../../../src/features/settings/settings-screen.tsx).
  Native permission/location helpers load on first opening.

## Transition lifecycle

- Root `AppearanceTransition` coordinates presentation for `ThemeControl` and
  default `ColorSchemeControl` selections. Preference ownership and writes stay
  in `ThemePreferencesProvider`; custom callbacks retain their own behavior.
- Skip unchanged palette IDs/resolved Light/Dark choices, reduced motion,
  inactive/startup content and unavailable layout/capture. Live device/System
  changes apply immediately.
- Mount the overlay only during a reveal, reject repeat selections and dispose
  its snapshot after UI drawing stops. Resize, backgrounding and reduced motion
  cancel the reveal while retaining the selected preference.
- Capture failures warn only in development and still apply/save the choice.
  Keep chosen artwork generation out of startup.

When changing reveal artwork, anchors, native capture or caller-owned
`SnapshotReveal` integrations, read [transition contracts](references/transitions.md).
Read current source for timing and geometry values.

## Motion preferences

- `appReducedMotion` uses the existing serialized preference writes.
  Root `persistMotion` restores it and exposes `motionReady` for launch readiness
  and controls. Preview providers keep motion preferences in memory.
- `appTabBarAutoHide` defaults to enabled and restores alongside Reduce Motion
  in the same read. Its Settings switch waits for `motionReady`; changes use the
  same serialized writes. Missing/invalid/failed reads retain the default.
  Reduce Motion takes precedence without clearing this choice.
- Headers use the shared rectangular blur. There is no saved header style or
  Settings picker. Obsolete `appHeaderMotion` and `appHeaderBlur` values are
  ignored; do not add startup storage work to migrate them.
- Reduce Motion observes the live system value until explicitly selected.
  Use `useAppReducedMotion` / `useMotionEnabled`; retain activity checks.

Verify restart restoration, failed storage, live System changes, preview isolation,
open language-sheet interaction and RTL on native devices. For transition changes,
check both directions and old/new theme visibility, rapid selections,
rotation/background interruptions, Reduce Motion and native form/header/dock capture
on iOS and Android.
