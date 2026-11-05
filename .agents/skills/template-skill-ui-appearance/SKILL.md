---
name: template-skill-ui-appearance
description: Maintain saved appearance preferences and isolated theme previews.
---

# Appearance preferences

Use `ColorSchemeControl` from `@components/ui`.
Sources: [appearance controls](../../../src/components/ui/appearance/) and
[theme provider](../../../src/context/theme.context.tsx).

## Preference ownership

- The brand's `presentation.palette` fixes the root palette to `ux`, the only
  bundled palette. Ordinary Settings has no brand/palette picker.
  `allowThemeSelection` is an explicit isolated-preview opt-in; it is not saved.
- System/Light/Dark uses `appColorScheme`. Root `persistAppearance` restores
  accepted values and exposes `appearanceReady`; disable controls until ready.
  Missing/invalid/failed reads keep the initial preference. Writes are queued;
  failed writes leave the current session usable.
- `ColorSchemeControl.onValueChange` overrides the default setter for
  coordination; an override must apply the selected preference itself.
- System resumes live device appearance. Explicit component/Host schemes keep
  their precedence. Preview providers stay in memory and do not persist.
- Language sheets use the existing language provider and translated autonyms.
  Arabic updates live RTL without remounting ordinary forms.
- Template's Settings tab uses the root preferences through
  [the Settings feature](../../../src/features/settings/settings-screen.tsx).
  Its native permission/location helpers load on first opening. The Preferences
  story renders that same feature with isolated appearance; it adds no parallel
  preference owner.

## Header and motion preferences

- `appHeaderMotion` and `appReducedMotion` use the existing serialized preference
  writes. `persistHeaderMotion` restores both and joins launch readiness.
- UX exposes Default, Dunes, Ribbon, Rain, Halloween, Ramadan and New Year in
  Settings. Seasonal choices are available year-round. Default uses rectangular
  blur. Use `headerBlur={false}` to disable blur on a frame. Old `appHeaderBlur`
  values are ignored.
- Reduce Motion observes the live system value until explicitly selected.
  Use `useAppReducedMotion` / `useMotionEnabled`; retain activity checks.
- Keep `ThemePicker` local to Text previews and `HeaderMotionPicker` local to
  Settings. Storybook and Text preview providers must not persist root preferences.

Verify restart restoration, failed storage, live System changes,
open language-sheet interaction and RTL on native devices.
