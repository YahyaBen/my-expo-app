# App Settings and appearance

The selected brand's `presentation.palette` seeds UX Template (`ux`, the
template default) or System (`system`) in light and dark appearance. Settings
can override that default with a saved palette choice. System
defines no app color overrides: Hosts leave their seed/tint unset, and native
controls use SwiftUI or Material defaults. Explicit caller colors still apply.
Custom RN surfaces use the navigator's default background when a color is required;
native shapes and skeletons use platform semantic fills. Palette-only gradients
and launch waves are omitted. System is a palette choice, independent of the
System/Light/Dark appearance preference.

Palette colors and semantic tokens
stay in `src/constants/themes/`. Register new
palettes in that registry and the config resolver's supported palette IDs, then
select the ID in the brand manifest. See [brand setup](development.md#brand-and-environment-configuration).

UX uses the [official shadcn/ui default Neutral theme](https://ui.shadcn.com/docs/theming#default-theme-css)
in both appearances. The upstream OKLCH colors are converted to sRGB hex and
rounded to 8-bit channels for native UI. The existing native token names map to
shadcn's semantic roles:

| Native token                | shadcn token           | Light     | Dark        |
| --------------------------- | ---------------------- | --------- | ----------- |
| `background`                | `background`           | `#FFFFFF` | `#0A0A0A`   |
| `text`                      | `foreground`           | `#0A0A0A` | `#FAFAFA`   |
| `surface` / `surfaceRaised` | `card` / `popover`     | `#FFFFFF` | `#171717`   |
| `primary` / `tint`          | `primary`              | `#171717` | `#E5E5E5`   |
| `onPrimary`                 | `primary-foreground`   | `#FAFAFA` | `#171717`   |
| `secondary`                 | `secondary`            | `#F5F5F5` | `#262626`   |
| `onSecondary`               | `secondary-foreground` | `#171717` | `#FAFAFA`   |
| `surfaceVariant`            | `muted`                | `#F5F5F5` | `#262626`   |
| `muted`                     | `muted-foreground`     | `#737373` | `#A1A1A1`   |
| `selection`                 | `accent`               | `#F5F5F5` | `#262626`   |
| `border` / `divider`        | `border`               | `#E5E5E5` | `#FFFFFF1A` |
| `input`                     | `input`                | `#E5E5E5` | `#FFFFFF26` |
| `ring`                      | `ring`                 | `#A1A1A1` | `#737373`   |
| `error`                     | `destructive`          | `#E7000B` | `#FF6467`   |

Dark borders and input borders retain upstream white transparency (10% and 15%,
rounded to 8-bit alpha). The existing app-only roles for disabled text, pressed
actions, feedback containers, success, warning and info remain extensions.
Normal and supporting text use separate colors; faint text is reserved for
unavailable content. Configured splash backgrounds match the page background
in each appearance; changing the native splash requires a new app build.

`useAppTheme` also exposes `design` for component owners. UX uses the default
mobile type ramp and native geometry. Native lists, toggles, pickers, padding
and interaction feedback remain platform-owned.

`ThemePreferencesProvider` remains the single state and persistence owner. Its
palette, appearance and motion subscriptions have independent values:
`useAppTheme` reads palette and appearance, while animation hooks read motion.
Motion selections do not invalidate color-only subscriptions. Startup reads
motion hydration separately from its selected value; native transition settings
subscribe below the root layout.
Full `useThemePreferences` / `useThemeSettings` snapshots are reserved for seeding
isolated previews. Controls use their matching palette, appearance or
motion settings hook.

Inspect preference subscriptions with a development profiler when investigating
updates. Component commits do not establish native frame-rate improvements.

Titled page frames use one rectangular native blur backdrop. The title
and Back remain sharp above it. Headers have no decorative variants or saved
style selection.
Explicit `headerBlur={false}` still opts a frame out of blur, and native Reduce
Transparency retains its existing solid-background fallback.
Android uses the published `expo-blur` defaults for tint, intensity and reduction
factor. iOS ultra-thin system materials retain their native color treatment. See the
[page contract](../.agents/skills/template-skill-ui-page/references/page-guide.md) for the
shared blur policy and capture-background requirements.
Page titles and Home branding use the configured font and theme foreground.

Use the app's component pages to inspect text, surfaces, spacing, buttons and field
feedback. Native font scaling, RTL, rendered contrast and keyboard behavior require
verification on matching iOS and Android builds.

Template's Settings tab offers system/light/dark appearance, Reduce Motion,
language, device permissions, haptic feedback, device location and app version
using the root's saved preferences; the app has no account screen.

## Theme values

Theme values are edited directly in TypeScript:

| Owner                                          | Responsibility                                            |
| ---------------------------------------------- | --------------------------------------------------------- |
| [ux.ts](../src/constants/themes/ux.ts)         | Primitive colors and semantic light/dark palettes         |
| [system.ts](../src/constants/themes/system.ts) | Empty light/dark overrides for native defaults            |
| [tokens.ts](../src/constants/themes/tokens.ts) | Typed color contract and derived navigation/control roles |
| [layout.ts](../src/constants/layout.ts)        | Shared spacing, radii and content dimensions              |
| [design.ts](../src/constants/themes/design.ts) | Typography presets and native shape defaults              |

Components keep using the existing useAppTheme() and layout exports. Change a
primitive color to update the roles sharing it, or change a semantic mapping for
a particular purpose. Derived component colors follow those semantic roles.
Run npm run check after edits; there is no generation command or generated theme
file to maintain.

Use **Components/Theme Tokens/Playground** to inspect colors, typography,
spacing, surfaces and control states in both appearances. Check affected native
screens with RTL and large text on iOS and Android. Font loading, language fallback,
explicit overrides and native control behavior remain with their existing owners.

## Device permissions

The [Settings page](../src/features/settings/settings-screen.tsx) has switches for notifications, camera, microphone, photos
and haptics, plus **Use location** in its Location section. Camera, microphone,
location, photo selection and haptics respect saved app preferences. Enabling a
capability requests OS approval when needed. **Device settings** manages system
grants; turning notifications off opens that same screen. Permission state
refreshes automatically on return.

Photos use the system picker without full-library access. The camera example
captures still photos; microphone permission is available for video audio.
Background location and exact-alarm access are unused. After the launch screen closes,
the app requests notification permission if no choice has been made yet. Previous
grants or denials do not trigger another startup prompt or open device settings.
Notification setup creates the Android channel before requesting permission. Android Settings displays the
Expo push token after permission is granted, with selection/copy and retry.
Sending through Expo needs matching platform credentials in EAS; see the
[push setup guide](eas-development-builds.md#expo-push-notifications).

Preferences use `appDevicePreferences` in AsyncStorage and restore before
interactive content. New camera, microphone and location consumers must use the
shared device-access gate. Native permission or system-prompt changes require a
new development build on each platform.

With **Use location** enabled, Settings > Location offers **Enable location** until foreground permission and
device location services are enabled, then **Get current location**. Android
offers the native location-services dialog when needed; dismissing it leaves
services off and the action available for another attempt. **Open device settings**
opens the app's permission settings, or Android's location settings when permission
is already granted and services are off. iOS also shows the manual path through
Settings > Privacy & Security > Location Services for the device-wide switch.
Blocked permission opens app settings from the main action. Returning to the app
refreshes permission and service status; request a location again after changing
settings. Coordinates stay in screen state and are acquired only on request.
The existing `expo-location` native module and foreground permission configuration
must be present in the installed development build.

The shared [color-scheme control](../src/components/ui/appearance/color-scheme-control.tsx)
serves Settings and login.
Its System/Light/Dark picker applies appearance changes immediately through the
existing saved preference provider. System follows the device; explicit Light or
Dark remains selected until the user chooses another option. Controls wait for
appearance restoration before accepting changes.

Settings > Appearance > Theme offers UX Template and System through the shared
[theme control](../src/components/ui/appearance/theme-control.tsx). Selection
applies to the whole app immediately and is saved for the next launch. The
System palette uses native colors; the separate System appearance option follows
the device's light/dark setting.

The Text component page follows the app appearance. Isolated theme compositions
must use their own provider and pass an explicit scheme when re-entering native
UI after an RN bridge.

Template's Settings tab and Appearance component page use the root's saved appearance
preference. Settings also exposes saved motion, language and device choices, with
the same `PageScreen` frame as Home and Discover. Its native `FieldGroup` owns
scrolling and keeps the final row clear of the raised dock action. Its
permission/location modules load when the tab is first opened.

## Saved appearance

The app root opts into `allowThemeSelection` and `persistAppearance` on the existing
theme provider. It restores `appTheme` as a registered palette ID and
`appColorScheme` as `system`, `light` or `dark` in one storage read. A missing or
invalid saved theme retains the configured brand palette. System appearance is the default;
it follows live device appearance. Fixed Light/Dark choices last until the user
selects another option, including across app restarts after a successful save.
Selecting System again clears the app's fixed native appearance override.

Missing/invalid saved values and read failures keep the initial System choice.
Selections update the current session immediately; writes are serialized with
the existing motion writes. If saving fails, the session keeps its new
appearance or palette and the next launch reads the last successfully saved value. Pickers
and callbacks wait for restoration, preventing a late read from replacing a new
selection. A remounted root reads after earlier queued writes have finished.

The root waits for appearance restoration before mounting its custom launch
overlay. That overlay's first native layout hides the native splash; language,
motion and the initial page frame's native layout govern its exit. This gates the
first app presentation; the OS's initial native splash appearance remains native.
Explicit component and Host scheme overrides retain their existing priority.

Language uses its existing saved provider. Root `persistMotion` restores the
explicit `appReducedMotion` choice before launch completion and exposes
`motionReady`. Reduce Motion follows the live system value until explicitly
selected, and applies to the app's existing animation consumers. Persistence
remains opt-in, with preview preferences held in memory. Obsolete `appHeaderMotion`
values are ignored without startup migration work.

Header blur strength stays fixed on both platforms. There is no numeric Settings
control or saved blur-level preference; older `appHeaderBlur` values are ignored.
Android uses Expo's default strength, while iOS retains its existing native
material behavior.

The [launch contract](../.agents/skills/template-skill-ui-launch-screen/SKILL.md) defines
minimal/branded presentation, optional-font fallback, foreground timing and
`app-ready` after resource readiness, layout and overlay exit. Starter startup
does not restore an auth session. Source checks do not establish native startup
timing or frame rates.

## Text foregrounds and verification

Primary text uses the foreground accent `tint`. Filled primary buttons still use
`primary`/`onPrimary`: dark fill with light text in Light, and light fill with dark
text in Dark. Secondary buttons use `secondary`/`onSecondary`. Inputs use `input`
for their border and `ring` while focused; validation and explicit style overrides
retain priority. An explicit appearance color overrides a text tone,
and final `textStyle.color` overrides both.

Use **Components/Text/Playground** with `example: theme-comparison` to inspect
the three surfaces, light/dark appearance, explicit foreground overrides and a
counted primary button. Preserve its stable selectors. Palette calculations alone
do not establish rendered contrast on native glass, caller colors or artwork.

On both native platforms, check saved Light/Dark after restart, live System
changes, invalid/unavailable storage fallback, rapid appearance changes, initial
appearance, local preview isolation and unchanged action counts. These device checks
remain pending; static checks and Hermes exports do not verify them.

The canonical control and persistence contract lives in the
[appearance skill](../.agents/skills/template-skill-ui-appearance/SKILL.md).
Native styles, hit areas, contrast, RTL, large text and live preference changes
still require device verification.
