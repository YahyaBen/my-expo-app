# Theme ownership

| Owner                                                       | Responsibility                                                  |
| ----------------------------------------------------------- | --------------------------------------------------------------- |
| `src/constants/themes/ux.ts`                                | Primitive colors and semantic light/dark palettes               |
| `src/constants/themes/system.ts`                            | Empty color overrides for native platform defaults              |
| `src/constants/themes/tokens.ts`                            | Typed color contract and derived component roles                |
| `src/constants/themes/design.ts`, `src/constants/layout.ts` | Typography, native defaults and shared geometry                 |
| `src/context/theme.context.tsx`                             | Configured root palette, saved appearance and isolated previews |
| `src/hooks/use-theme.ts`                                    | Theme colors and typography/shape tokens                        |
| `src/components/ui/host/`                                   | Native scheme/tint inheritance and `useHostColorScheme`         |

- Keep the stable palette IDs `ux` and `system`. The brand selects the default
  palette; Settings lets users save a palette choice through the existing theme
  provider. User appearance remains system/light/dark. Preview palette changes
  stay local and never overwrite saved app preferences.
- `system` defines empty light/dark overrides. Omitted roles preserve native
  defaults, including the Host seed/tint. Preserve explicit caller overrides;
  never substitute UX colors or interpolate missing colors into strings.
  Custom RN surfaces use navigator defaults when an opaque fill is required;
  native shapes/placeholders use platform semantic fills. Skip palette-only
  gradients and launch waves. This palette is independent of System appearance.
- Reuse semantic roles (`background`, `surface`, `text`, `muted`, `border`, `tint`,
  `error`, `success`, `warning`). Keep explicit light/dark colors for intentional
  brand choices in `ux.ts`; `createColorTokens` derives navigation/control roles.
- Edit the existing TypeScript owners directly and run `npm run check`. The
  primitive palette, semantic mappings and component roles have one maintained
  owner each. Components keep using the existing theme/layout API.
- Keep native defaults and feature switches in `design.ts`. Font loading,
  language fallback and explicit text overrides remain with the existing owners.
- Read the owning Host's scheme for styled native content. Explicit component
  overrides retain priority. Host `seedColor` supplies Android Material derivation
  and iOS tint; it does not guarantee identical rendered control colors.
- Preserve native padding, feedback, disabled treatment and ordinary control
  geometry. Exported `control*`/`switch*` tokens remain for explicit styling and
  compatibility; standard controls do not automatically map them.
- Primary text uses `tint`; filled actions use `primary`/`onPrimary`. Keep paired
  semantic foreground/background colors and explicit caller override precedence.
- UX retains the default mobile type ramp and native shapes. Read current source
  values before changing a palette; do not introduce a new palette as part of a
  structural refactor.
- UX maps the official shadcn/ui default Neutral light/dark colors to the existing
  native token names. Keep upstream OKLCH colors converted to native sRGB hex,
  including translucent dark borders. `input` owns field borders and `ring` owns
  focus outlines. App-only feedback and state roles remain explicit extensions.
  It follows the common native seed/tint flow. Keep palette-specific color-role
  mapping outside the Host.
- Reserve `textDisabled` for unavailable content; `muted` remains readable
  supporting text. Pair `errorContainer` with `onErrorContainer`, rather than
  reusing filled-action `onError` or the ordinary page foreground.
- Header blur has one rectangular native presentation, independent of theme
  tokens and launch artwork. Preserve title clearance, safe areas and touch
  shielding. `headerBlur={false}` remains an explicit opt-out.

Preview changes with production tokens, explicit light/dark state and native
controls. Check rendered contrast and override behavior; token names and seed
colors alone do not establish contrast. The [appearance guide](../../../../docs/appearance-themes.md)
records user preference behavior.
