# Theme tokens for native components

## Native control defaults (2026-10-14)

Universal controls use the owning Host's shared scheme and theme tint. Do not
reintroduce per-state control color palettes, painted row surfaces or native
geometry calculations. Caller colors and native modifiers remain available.
Text retains shared text color with opt-in semantic typography; TextInput keeps
form/status tokens and behavior. Native iOS glass is used where supported,
including the menu Picker trigger; Android keeps Material defaults. Read
[the current control contract](../../../../docs/control-theme.md) before adding
an adapter. The `control*` and `switch*` roles remain exported for explicit
application styling and compatibility, but standard controls no longer map them.

## Existing sources

- `src/constants/themes/`: palette registry and semantic tokens; `colors.ts` retains only compatibility defaults.
- `src/context/theme.context.tsx`: configured root palette, opt-in saved appearance and isolated preview preferences.
- `src/hooks/use-theme.ts`: shared theme colors and `design` type/shape tokens; compose with `useHostColorScheme` for controls inside a native Host.
- `src/components/ui/host/types.ts`: shared `colorScheme`, `seedColor`, and `testID` props.
- `src/components/ui/host/universal-host.tsx`: native Host wrapper, scheme selection, and sizing defaults.

All themes resolve semantic button token pairs in the [shared button implementation](../../../../src/components/ui/button/universal-button.tsx). Caller colors retain their existing override behavior. Follow [the button color contract](../../template-skill-ui-button/references/props-and-styling.md) for the exact mapping and override precedence.

## Token contract

Use semantic roles already present: `background`, `surface`, `text`, `muted`, `border`, `tint`, `error`, `success`, and `warning`. Keep explicit light/dark variants for intentional brand colors. Repeated layout/typography values may become shared tokens when actually needed; leave native typography, shape, elevation, and press feedback at their defaults unless behavior requires a change.

Text's primary tone uses `tint`, not the `primary` filled-action surface.
Preserve `primary`/`onPrimary` and explicit text override precedence. Use the
[Text contract](../../template-skill-ui-text/SKILL.md) for the exact mapping and preview.

Host `colorScheme` selects appearance. Host `seedColor` derives Android Material colors and sets iOS native tint; it does not promise the exact same color for every native control. See [SDK 58 Host](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/host/). Use the installed API's real color hooks/props when mapping tokens; do not invent universal `containerColor` props or treat `UniversalStyle` as full RN styling.

Buttons use shared semantic colors and the active theme's optional button radius,
preserving native padding, clickable bounds, disabled treatment and feedback.
Caller colors/geometry retain priority. UX/Instagram keep native button shapes;
Altarea supplies a 24-point radius. Text presets and field radii also resolve
through `design`. Do not paint a larger outer background around a smaller native
clickable control. Legacy size/rounded props have been removed.

`design.header.artwork` enables decorative header waves for UX/Instagram and
disables them for Altarea. Every titled frame retains native blur over the
content beneath it by default; the title and Back stay sharp above the backdrop.
Safe areas, the measured scroll inset and touch shield remain. A frame can
explicitly opt out with `headerBlur={false}`. Native Reduce Transparency keeps
its solid-background fallback. Launch artwork does not follow this header setting.

Every `UniversalButton` or `UniversalButtonContent` call requires `variant`. Use [the button skill](../../template-skill-ui-button/SKILL.md) for the current nine variants, native style mapping and supported geometry. Native disabled colors/opacity and press feedback remain platform-owned. Specialized icon and navigation buttons keep their explicitly selected native style.

`UniversalHost` provides its resolved scheme through React context for styled text, loading content and button token resolution through `useHostColorScheme`. Native appearance also follows the owning native Host. `UniversalButton` reuses one `UniversalHost` at an RN boundary, so native appearance and custom descendants share its explicit/inherited scheme and live direction. `UniversalButtonContent` composes within an existing Host and has no scheme prop. Full-width buttons make the label/native surface fill together; intrinsic buttons use inline hosting. See the [button contract](../../template-skill-ui-button/SKILL.md) for geometry and override details.

## Documentation and story requirements

For a component, record which token roles it consumes, which native defaults it preserves, and any platform-specific mapping. Story canvases must consume the same tokens as production components rather than duplicate hex values.

Provide light/dark stories and semantic states relevant to the component. Make scheme/seed controls explicit so a story can be replayed independently of the device setting. Check readable labels, disabled state, focus/selection, and native press coverage on iOS and Android. Do not infer accessibility contrast from a token name or an Android seed; evaluate rendered foreground/background colors where accuracy matters.
