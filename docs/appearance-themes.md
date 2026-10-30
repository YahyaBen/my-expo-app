# App Settings and appearance

The selected brand's `presentation.palette` chooses UX Template (`ux`),
Instagram (`instagram`) or Altarea (`altarea`), each in light and dark appearance.
The default template selects UX. Palette colors and semantic tokens stay in
`src/constants/themes/`; Instagram's palette is bundled static JSON. Register new
palettes in that registry and the config resolver's supported palette IDs, then
select the ID in the brand manifest. See [brand setup](development.md#brand-and-environment-configuration).

UX uses the reference palette's neutral surfaces and purple accent: `#F2F2F7`
and white in light appearance, `#121212` with progressively lighter surfaces in
dark appearance, and `#6200EE` / `#BB86FC` accents. Normal and supporting text
use separate readable colors; faint text is reserved for unavailable content.
Its configured splash backgrounds match the page background in each appearance.
Existing Instagram and Altarea brand colors remain in place.

Altarea adds purple/magenta accents, warm neutral surfaces, a larger opt-in
text ramp, 24-point button corners and 6-point field corners. The existing
`useAppTheme` also exposes `design` for those component owners; UX/Instagram
use the default mobile type ramp and native geometry. Native lists, toggles, pickers,
padding and interaction feedback remain platform-owned. See the
[website extraction and mobile mapping](altarea-theme.md) for exact source
values, typography, spacing, shapes and adaptation limits.

Titled page frames blur the content beneath their headers by default in every
theme. The title and Back remain sharp above that native backdrop. UX and Altarea set
`design.header.artwork` to false, omitting colored waves even when an older
Dunes/Ribbon/Rain preference is stored. Title clearance, safe areas, scrolling
and touch shielding stay in place. The inactive header-effect picker is hidden
for those palettes; its saved value is preserved for themes that support artwork.
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
UX, Instagram and Altarea each have light/dark stories. These previews do not
send backend requests. Native font scaling, RTL, rendered contrast and keyboard
behavior still require verification on matching iOS and Android builds.

Settings offers system/light/dark appearance, supported header effects,
Reduce Motion, language, Account/sign-in navigation, device permissions,
haptic feedback, the component catalog, device location and app version.
Placeholder support and legal controls have been removed.

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
wave/canvas/mask while retaining the rectangular native header blur. UX and Altarea
use that rectangular blur regardless of a saved decorative effect because their
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

The 2026-10-23 palette audit calculated contrast for all eight text tones against
`background`, `surface` and `surfaceRaised`. Minimum ratios across those 24 pairs:

| Palette     | Light  | Dark   |
| ----------- | ------ | ------ |
| UX Template | 4.93:1 | 6.83:1 |
| Instagram   | 4.56:1 | 4.76:1 |
| Altarea     | 4.93:1 | 7.39:1 |

The UX dark primary-text/background pair changes from 1.11:1 to 18.88:1; its
primary button pair remains 21:1. These calculations use the explicit opaque
palette values and the [W3C contrast formula](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
They do not establish rendered contrast on native glass, arbitrary caller colors,
feedback containers or artwork. No palette colors were changed for this repair.

The Text page and retained `Components/Text/ThemeComparison` composition show all
three surfaces, all registered palettes/appearances, explicit overrides and a counted
primary button. Existing text selectors remain; new preview controls and samples
have stable selectors. No automated suite was added.

On both native platforms, check saved Light/Dark after restart, live System
changes, invalid/unavailable storage fallback, rapid appearance changes, initial
appearance, local preview isolation and unchanged action counts. These device checks
remain pending; static checks and Hermes exports do not verify them.

The canonical control and persistence contract lives in the
[appearance skill](../.agents/skills/template-skill-ui-appearance/SKILL.md).
Native styles, hit areas, contrast, RTL, large text and live preference changes
still require device verification. Earlier brand/theme reports describe history.
