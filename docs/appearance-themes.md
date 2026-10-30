# App Settings and appearance

The selected brand's `presentation.palette` uses UX Template (`ux`), the only
bundled palette, in light and dark appearance. Palette colors and semantic tokens
stay in `src/constants/themes/`. Register new
palettes in that registry and the config resolver's supported palette IDs, then
select the ID in the brand manifest. See [brand setup](development.md#brand-and-environment-configuration).

UX uses the reference palette's neutral surfaces and purple accent: `#F2F2F7`
and white in light appearance, `#121212` with progressively lighter surfaces in
dark appearance, and `#6200EE` / `#BB86FC` accents. Normal and supporting text
use separate readable colors; faint text is reserved for unavailable content.
Its configured splash backgrounds match the page background in each appearance.

`useAppTheme` also exposes `design` for component owners. UX uses the default
mobile type ramp and native geometry. Native lists, toggles, pickers, padding
and interaction feedback remain platform-owned.

`ThemePreferencesProvider` remains the single state and persistence owner. Its
palette, appearance, header and motion subscriptions have independent values:
`useAppTheme` reads palette and appearance, while animation hooks read motion.
Header or motion selections do not invalidate color-only subscriptions. Startup
reads header/motion hydration separately from their selected values; header
decoration and native transition settings subscribe below the root layout.
Full `useThemePreferences` / `useThemeSettings` snapshots are reserved for seeding
isolated previews. Controls use their matching palette, appearance, header or
motion settings hook.

In **Components/Theme Tokens/Playground**, choose `example: subscriptions` to
inspect independent preference updates. After startup settles, the development
console logs `[theme-subscription]` commits for each probe. Header changes should
commit only the header probe; motion changes commit motion and motion-gate;
appearance changes commit appearance and colors. The fixed palette probe stays
unchanged. Probe logs count their component commits, not descendant native style
updates, and do not establish device frame-rate improvements.

Titled page frames blur the content beneath their headers by default in every
theme. The title and Back remain sharp above that native backdrop. UX sets
`design.header.artwork` to false, omitting colored waves even when an older
Dunes/Ribbon/Rain preference is stored. Title clearance, safe areas, scrolling
and touch shielding stay in place. The inactive header-effect picker is hidden
for UX; its saved value is preserved for themes that support artwork.
Explicit `headerBlur={false}` still opts a frame out of blur, and native Reduce
Transparency retains its existing solid-background fallback.
Android uses the published `expo-blur` defaults for tint, intensity and reduction
factor. iOS ultra-thin system materials retain their native color treatment. See the
[page contract](../.agents/skills/template-skill-ui-page/references/page-guide.md) for the
shared blur policy and capture-background requirements.
Page titles and Home branding use the configured font and theme foreground.

The **Components/Theme Tokens** story displays the active palette, text hierarchy,
type ramp with line heights, surface layers, shapes, shared spacing, working
button states and an editable field. Toggle the local field/submit error example
to inspect icon-and-text feedback and paired error-container foregrounds.
UX has light/dark stories. These previews do not
send backend requests. Native font scaling, RTL, rendered contrast and keyboard
behavior still require verification on matching iOS and Android builds.

The **Wireframes/Preferences** story offers system/light/dark appearance,
supported header effects, Reduce Motion, language, device permissions, haptic
feedback, device location and app version. The release wireframe has no Settings
or account screen.

## Theme values

Theme values are edited directly in TypeScript:

| Owner                                          | Responsibility                                                   |
| ---------------------------------------------- | ---------------------------------------------------------------- |
| [ux.ts](../src/constants/themes/ux.ts)         | Primitive colors and semantic light/dark palettes                |
| [tokens.ts](../src/constants/themes/tokens.ts) | Typed color contract and derived navigation/control roles        |
| [layout.ts](../src/constants/layout.ts)        | Shared spacing, radii and content dimensions                     |
| [design.ts](../src/constants/themes/design.ts) | Typography presets, native shape defaults and header eligibility |

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

The Settings example has switches for notifications, camera, microphone, photos
and haptics, plus **Use location** in its Location section. Camera, microphone,
location, photo selection and haptics respect saved app preferences. Enabling a
capability requests OS approval when needed. **Device settings** manages system
grants; turning notifications off opens that same screen. Permission state
refreshes automatically on return.

Photos use the system picker without full-library access. The camera example
captures still photos; microphone permission is available for video audio.
Background location and exact-alarm access are unused. Notification setup creates
the Android channel before requesting permission. Remote push still needs
FCM/APNs credentials, token registration and a backend.

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

The Preferences story owns its [header-effect picker](../.rnstorybook/components/device/header-motion-picker.tsx). The
shared [color-scheme control](../src/components/ui/appearance/color-scheme-control.tsx)
serves Settings and login.
Its System/Light/Dark picker applies appearance changes immediately through the
existing saved preference provider. System follows the device; explicit Light or
Dark remains selected until the user chooses another option. Controls wait for
appearance restoration before accepting changes.

The configured root palette stays fixed. A user chooses appearance, not another
client's identity or demo palette. The Text showcase in **Wireframes/Component Gallery** has
an isolated [theme picker](../.rnstorybook/components/catalog/theme-picker.tsx) and
appearance control; these changes stay in memory and leave saved app preferences
untouched. Leaving and reopening that page starts from the app's current choices.
The color-sample area has its own explicit-scheme Host after the RN bridge;
page chrome and the other text examples keep the app appearance. The retained
native Storybook controls also operate on isolated providers.

The release wireframe has no Settings screen. Preferences in Storybook uses an isolated appearance provider, so its theme controls do not persist app appearance. The root still supports saved appearance for future screens. Language and device switches in that story use their real saved settings.

## Saved appearance

The app root opts into `persistAppearance` on the existing theme provider. It
restores `appColorScheme` as `system`, `light` or `dark`. System is the default;
it follows live device appearance. Fixed Light/Dark choices last until the user
selects another option, including across app restarts after a successful save.
Selecting System again clears the app's fixed native appearance override.

Missing/invalid saved values and read failures keep the initial System choice.
Selections update the current session immediately; writes are serialized with
the existing header/motion writes. If saving fails, the session keeps its new
appearance and the next launch reads the last successfully saved value. Pickers
and callbacks wait for restoration, preventing a late read from replacing a new
selection. A remounted root reads after earlier queued writes have finished.

The root waits for appearance restoration before mounting its custom launch
overlay. That overlay's first native layout hides the native splash; language,
header/motion and the initial page frame's native layout
govern its exit. This gates the first
app presentation; the OS's initial native splash appearance remains native.
Explicit component and Host scheme overrides retain their existing priority.

Language uses its existing saved provider. Header effect and the explicit motion
choice still restore before launch completion. Header choices include Default,
Dunes, Ribbon and Rain; unsupported saved values retain the manifest's initial
style (Default for the template). Default avoids mounting the
wave/canvas/mask while retaining the rectangular native header blur. UX
uses that rectangular blur regardless of a saved decorative effect because its
header artwork is disabled. Existing animated choices and saved values are
preserved. Persistence remains opt-in; preview providers use neither
storage flag. The palette itself is never saved as a user preference.

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
`primary`/`onPrimary`; the UX palette intentionally keeps a black fill and white
label in both appearances. An explicit appearance color overrides a text tone,
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
