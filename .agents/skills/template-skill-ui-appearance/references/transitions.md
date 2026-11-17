# Appearance transition contracts

Read the sections relevant to changed artwork, capture or reveal consumers.
The current [root and circular reveal](../../../../src/components/ui/appearance/appearance-transition.tsx),
[Xbox reveal](../../../../src/components/ui/appearance/xbox-snapshot-reveal.tsx)
and [transition picker](../../../../src/components/ui/appearance/appearance-transition-control.tsx)
define timings, geometry and registered values. Preserve existing contracts when
changing one effect; do not reset other options or the Circular default.

## Shared capture and presentation

- iOS captures with installed Skia 2; Android loads `react-native-view-shot` on
  selection to include Compose hosts. Release temporary Android PNGs after
  decoding. Adding view-shot requires a matching development build.
- Keep the old snapshot stationary over the live destination. Apply the preference
  while covered, allow native commits, then animate the mask. Root capture,
  cancellation, repeat-selection, Reduce Motion and image-disposal guards remain.
- Construct static artwork only for the selected reveal. Animate existing paths
  on the UI runtime; keep artwork generation out of startup.

## Circular

- The template shell passes `useAppearanceTransitionOrigin()` to the main dock's
  `appearanceOriginRef`. Measure that native frame only for Circular; center on
  the floating navigation action and fall back to the picker when unavailable.
  Missing or failed anchor measurements must not skip capture and reveal when
  the picker origin remains available.
- Palette selections expand outward in both Light and Dark appearance.
- Shared `SnapshotReveal` consumers retain circular presentation independently
  of the root's selected effect. Its optional duration and the root's explicit
  duration have separate source values; inspect the affected caller.

## Xbox intro

Capture resolved `sourceScheme` in the root's active reveal before applying the
destination. A Light source uses pure white behind a pure-black mask; a Dark
source uses pure black behind a pure-white mask. Pass the captured scheme to
`XboxSnapshotReveal`; applying the next appearance must not invert the
interlude midway. Palette selections and System mode use the same resolved
source. Keep it transient, without another preference or storage owner.

Persist `xbox`. Use the supplied filled 24-unit SVG for a flat Series X-style
fade and hold. Render a solid white/black mark without aura, gradients, blur,
outline stage, light trails or wordmark. Parse original SVG paths separately so
relative moves retain their origins; build static geometry only when selected.

Progress drives opacity and a flat zoom through the logo's broad lower lobe.
The SVG itself becomes the destination-theme opening during the final push;
derive completion scale from its clear core to reveal every viewport corner.
`XboxIntro` owns canvas content only. Keep the stable transition IDs and add no
startup work, audio, dependency or persistence owner.

## Caller-owned snapshots

`SnapshotReveal` receives a `SnapshotRevealFrame`, shared Skia `image`,
`onCovered` change callback, `onComplete` cleanup and optional `testID`.
Consumers own capture, motion/focus guards, cancellation and disposal after
UI drawing stops.

The [Google Maps consumer](../../../../src/features/template/use-map-type-transition.ts)
uses `MapView.takeSnapshot` to include its native surface, retains the camera
and switches instantly on capture failure. Map tiles load independently; the
animation does not wait for network completion.
