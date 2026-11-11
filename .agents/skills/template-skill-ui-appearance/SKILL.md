---
name: template-skill-ui-appearance
description: Maintain saved appearance preferences and isolated theme previews.
---

# Appearance preferences

Use `ThemeControl` and `ColorSchemeControl` from `@components/ui`.
Sources: [appearance controls](../../../src/components/ui/appearance/) and
[theme provider](../../../src/context/theme.context.tsx).

## Preference ownership

- The brand's `presentation.palette` seeds the root palette with `ux` (the template
  default) or `system` (native colors with no app overrides). Settings exposes
  `ThemeControl` in Appearance; it changes the app's palette immediately.
  The root opts into `allowThemeSelection`; locked providers reject changes.
- Root `persistAppearance` restores `appTheme` and `appColorScheme` together.
  Accept only registered theme IDs; missing/invalid/failed reads retain the brand
  default. Theme writes share the existing serialized preference queue.
  `ThemeControl` accepts an optional `testID` and uses
  `themeSelectionEnabled` to wait for restoration and honor locked providers.
- System/Light/Dark uses `appColorScheme`. Root `persistAppearance` restores
  accepted values and exposes `appearanceReady`; disable controls until ready.
  Missing/invalid/failed reads keep the initial preference. Writes are queued;
  failed writes leave the current session usable.
- `ColorSchemeControl.onValueChange` overrides the default setter for
  coordination; an override must apply the selected preference itself.
- Root `AppearanceTransition` adds a circular snapshot reveal to
  `ThemeControl` and default `ColorSchemeControl` selections, originating at the
  native picker's center. Palette selections expand outward in both Light and
  Dark appearance and skip the selected ID.
  Preference ownership and writes stay in `ThemePreferencesProvider`.
  It skips unchanged resolved Light/Dark choices, reduced motion, inactive/startup
  content and unavailable layout/capture. Custom callbacks and nested preview
  providers retain their own behavior. Live device/System changes are immediate.
  The overlay mounts only during a reveal, rejects repeat selections and releases
  its image after UI drawing stops. Resize, backgrounding and reduced motion
  cancel the reveal while retaining the selected preference.
- iOS captures with installed Skia 2; Android loads `react-native-view-shot` on
  selection to include Compose hosts. Android captures use temporary PNGs that
  are released after decoding. Adding view-shot requires a new development build.
- System resumes live device appearance. Explicit component/Host schemes keep
  their precedence. Preview providers stay in memory and do not persist.
- Language sheets use the existing language provider and translated autonyms.
  Arabic updates live RTL without remounting ordinary forms.
- Template's Settings tab uses the root preferences through
  [the Settings feature](../../../src/features/settings/settings-screen.tsx).
  Its native permission/location helpers load on first opening.

## Motion preferences

- `appReducedMotion` uses the existing serialized preference writes.
  Root `persistMotion` restores it and exposes `motionReady` for launch readiness
  and controls. Isolated previews keep motion preferences in memory.
- `appTabBarAutoHide` defaults to enabled and restores alongside Reduce Motion
  in the same read. Settings > Appearance exposes its native switch, disabled
  until `motionReady`. Changes apply immediately and use the same serialized
  writes; missing/invalid/failed reads retain the default. Reduce Motion takes
  precedence without clearing this choice. Preview providers do not persist it.
- Headers use the shared rectangular blur. There is no saved header style or
  Settings picker. Obsolete `appHeaderMotion` and `appHeaderBlur` values are
  ignored; do not add startup storage work to migrate them.
- Reduce Motion observes the live system value until explicitly selected.
  Use `useAppReducedMotion` / `useMotionEnabled`; retain activity checks.
- Isolated preview providers must keep palette and appearance changes in memory
  without persisting root preferences.

Verify restart restoration, failed storage, live System changes,
open language-sheet interaction and RTL on native devices. Check both reveal
directions, rapid selections, rotation/background interruptions, Reduce Motion
and native form/header/dock capture on iOS and Android.
