---
name: template-skill-ui-appearance
description: Maintain saved appearance preferences and isolated theme previews.
---

# Appearance preferences

Use `ThemeControl`, `ColorSchemeControl` and `AppearanceTransitionControl` from `@components/ui`.
Sources: [appearance controls](../../../src/components/ui/appearance/) and
[theme provider](../../../src/context/theme.context.tsx).

## Preference ownership

- The brand's `presentation.palette` seeds the root palette with `ux` (the template
  default) or `system` (native colors with no app overrides). Settings exposes
  `ThemeControl` in Appearance; it changes the app's palette immediately.
  The root opts into `allowThemeSelection`; locked providers reject changes.
- Root `persistAppearance` restores `appTheme`, `appColorScheme` and `appAppearanceTransition` together.
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
- Root `AppearanceTransition` adds the selected snapshot reveal to
  `ThemeControl` and default `ColorSchemeControl` selections. Circular defaults to 1200 ms using
  `cubic-bezier(0.215, 0.61, 0.355, 1)`. The template shell passes
  `useAppearanceTransitionOrigin()` to the main dock's `appearanceOriginRef`.
  Its native frame is measured only for circular selections; the reveal centers on the
  floating navigation action and falls back to the picker when unavailable.
  Missing or failed anchor measurements must not skip capture and the reveal.
  Palette selections expand outward in both Light and
  Dark appearance and skip the selected ID.
  Preference ownership and writes stay in `ThemePreferencesProvider`.
  It skips unchanged resolved Light/Dark choices, reduced motion, inactive/startup
  content and unavailable layout/capture. Custom callbacks and nested preview
  providers retain their own behavior. Live device/System changes are immediate.
  The overlay mounts only during a reveal, rejects repeat selections and releases
  its image after UI drawing stops. Resize, backgrounding and reduced motion
  cancel the reveal while retaining the selected preference.
  Snapshot failures warn only in development and still apply/save the choice.
- `AppearanceTransitionControl` selects `circular` (default), `kurohitsugi`, `yhwach`, `dangai`, `garganta` or `xbox` in
  Settings and the Appearance example. It accepts an optional `testID`, waits for
  `appearanceReady` and disables during capture/reveal. The existing provider
  validates and saves `appAppearanceTransition` through the preference queue;
  missing/invalid/failed reads keep Circular. Nested providers remain in memory.
  Kurohitsugi uses seven individually drawn tower profiles with chipped crowns,
  seeded dry-ink grain, long counter-wound tears, fine bristles and angular debris.
  Geometry follows the image reference's background silhouette. Thin cuts retain
  the previous theme inside each tower during the rise and clear at completion.
  Construct detailed static paths once when the reveal mounts; each frame only
  translates and combines those paths. Keep artwork generation out of startup.
  The mask starts empty and finishes with full viewport coverage. A brief windup
  releases into an ascent from the lower center, then settles; towers rise only upward with
  fixed horizontal geometry, revealing the live next theme through an inverted
  clip on the previous theme's full-screen snapshot. Apply the preference while
  the old snapshot covers the screen, allow native commits, then animate the
  staggered mask from empty to full over 1200 ms. The snapshot stays stationary;
  only actual old/new app appearances are drawn, without decorative fills,
  colored backgrounds, outlines or glow. One UI-runtime path drives the mask.
  It needs no anchor measurement and preserves the shared capture, cancellation,
  Reduce Motion and image-disposal guards.
  Changing the effect does not trigger a theme change. Shared `SnapshotReveal`
  callers, including the map example, retain their circular reveal.
- Yhwach uses 23 individually placed eyes at varied sizes and fixed planar angles.
  Sharp, asymmetric outer rims surround sclera windows. Smooth layered oval
  irises and small oval pupils align with the eye's long axis, following the
  reference's anatomy. Sclera, iris bands, pupils and catchlights alternate the
  old and next theme through path winding; do not substitute radial spikes or
  slit pupils. Eye apertures open in staggered groups;
  shadow tendrils rise before an upward sweep completes the switch over 1500 ms.
  Portrait and landscape use the same composed field with adapted placement.
  `PatternSnapshotReveal` shares snapshot presentation and commit timing with
  Kurohitsugi. Create only the chosen mask on selection; retain root capture,
  cancellation, repeat-selection and Reduce Motion guards. No additional colors,
  backgrounds or character artwork are drawn. Save `yhwach` through the existing
  `appAppearanceTransition` preference and keep Circular as the fallback/default.
- Dangai Ichigo adds an aura mask with 11 curved, torn ribbons, internal fine
  tears and grain, 72 drifting fragments and three rising pressure-wave arcs.
  A curved upward surge completes the switch over 1400 ms. Construct static
  paths only for the active reveal; animate their vertical positions without
  moving the captured app content. Use the shared `PatternSnapshotReveal` and
  existing root capture, motion, cancellation and image-disposal owners. Only
  actual old/new themes are shown. Persist the stable `dangai` identifier through
  `appAppearanceTransition`; keep all existing effects and Circular's default.
- Garganta and Xbox use direction-aware monochrome interludes. Capture the
  resolved `sourceScheme` in the root's active reveal when selection begins,
  before applying the destination. A Light source uses pure white behind a
  pure-black mask; a Dark source uses pure black behind a pure-white mask. Pass
  the captured scheme to `PatternSnapshotReveal`; applying the next appearance
  must not flip colors during the interlude. Palette selections and System mode
  use the same resolved source. Keep this transient; add no preference or storage.
- Garganta adds a 2000 ms manga interlude. Fade the captured old theme to the
  monochrome exterior during the first 12%, then spread the center seam sideways.
  As the jaws part from 28%, reveal the actual live destination screen through
  the entire opening. Keep only a narrow ink rim plus the exterior's rectangular
  breaks, frayed shoulders, tangled threads, vertical filaments and grain.
  Build the entrance once by subtracting a thin stroke from the solid silhouette;
  if path operations fail, use the original silhouette as a rimless fallback.
  Opening artwork and entrance share the same transform, including the hold and
  flat 2D push during the final 28%; do not hold a solid-color interior until zoom.
  Compute final zoom from the entrance's clear core to cover every viewport corner.
  Keep captured old content and the incoming native theme at rest. Construct
  selected static paths on demand and preserve shared capture, cancellation,
  Reduce Motion, image disposal and preference ownership. The stable `garganta`
  identifier uses the existing preference; keep Circular and the other effects.
- Xbox intro adds a 2400 ms flat Series X-style fade and hold with the supplied
  filled 24-unit SVG. Render a solid white/black mark: no aura, gradients, blur,
  outline stage, light trails or wordmark. Parse each original SVG path separately
  so relative moves retain their origin; build static geometry only when selected.
  Progress drives opacity and a flat zoom through the logo's broad lower lobe.
  The actual SVG becomes the destination-theme opening during the final push;
  derive completion scale from its clear core so every viewport corner is revealed.
  Preserve shared capture/commit, motion, cancellation, repeat-selection and
  image-disposal owners in `PatternSnapshotReveal` and the root. `XboxIntro` owns
  canvas content only; add no startup work, audio, dependencies or persistence owner.
  Save `xbox` through `appAppearanceTransition`; retain prior options, picker indexes
  and Circular as default.
- iOS captures with installed Skia 2; Android loads `react-native-view-shot` on
  selection to include Compose hosts. Android captures use temporary PNGs that
  are released after decoding. Adding view-shot requires a new development build.
- `SnapshotReveal` shares the same circular reveal and timing with caller-owned
  snapshots. Supply a `SnapshotRevealFrame`, shared Skia `image`, `onCovered`
  change callback, `onComplete` cleanup and optional `testID`. Callers own motion
  and focus guards, cancellation and image disposal after UI drawing stops.
  The Google Maps example captures with `MapView.takeSnapshot` to include its
  native map surface, retains the camera, and switches instantly if capture fails.
  Map tiles load independently; the animation does not wait for network completion.
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
directions, Kurohitsugi, Yhwach, Dangai, Garganta and Xbox old/new theme visibility in Light and Dark, transition restoration, rapid selections, rotation/background interruptions, Reduce Motion
and native form/header/dock capture on iOS and Android.
