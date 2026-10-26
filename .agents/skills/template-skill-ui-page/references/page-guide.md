# Page layout and motion

Exports: `PageScreen`, `PageSection`, `PageFrame`, `PageHeader`, `PageMotionOverlay` and `pageFormModifiers`.

Screens have zero decorative padding. Wrap ordinary content in `PageSection`,
which owns symmetric 16-point padding and a 16-point child gap. Use
`inset={false}` for full-width sections whose rails/text own horizontal gutters.
Description and route actions have their own sections. Safe areas, keyboard
avoidance and measured title clearance remain infrastructure insets.
`PageScreen` content, page headers and Settings use the shared
`screenContentMaxWidth` (640 points/dp) at their React Native Host boundary.
They fill narrower safe viewports and center with equal outer margins on wider
or opened displays. Keep backgrounds, header blur and artwork edge-to-edge;
do not constrain `PageFrame` itself or change the global Host defaults.
`PageSection` still fills its owning content column and owns its existing padding.
`PageFrame` supplies the selected theme's `background`, including standalone
previews. See [shared geometry](../../../../docs/layout-consistency.md) for the
token roles, native-form limitations and component story.

Titled `PageFrame` headers blur the content beneath them by default in every
theme, including Altarea. `headerBlur={false}` explicitly opts a frame out.
`design.header.artwork` controls decorative waves independently: it is true for
UX/Instagram and false for Altarea. The title and Back remain sharp above the
native blur; disabling artwork does not remove its content target or backdrop.
The default frame keeps its header in normal layout and reserves the measured
title height above its content. Its full-frame blur source sits below the header.
`PageScreen`, Home and Settings use `scrollsBehindHeader` and `usePageHeaderInset()` to reserve that height
inside their scroll content instead. The inset measures
the real header, including the status bar, back button and larger text. The first
item starts below the title and can scroll behind it. Content mounts before the
blur and supplies a `BlurTargetView` reference for Android that excludes the title
and back button. The mask sits below those controls so they stay sharp.
Android records the target's descendants into its blur RenderNode; the target's
own background and ancestor backgrounds are not included. Keep an actual
absolute, full-frame themed background View inside that target, before its
content, so empty areas capture the page color instead of the native window fill.
Android native stacks retain React state while detaching and restoring native
screens. `use-page-blur-key.ts` refreshes only the backdrop after a previously
unfocused route returns, then refreshes its binding after the incoming native
transition completes. Stack transition events contain `data.closing`; tab
transition events have no `data`. The shared listener must accept both and read
`data?.closing` so visiting a tab, including Settings, cannot throw on completion.
Frame scheduling coalesces same-frame events and cancels
pending work on blur/unmount. The page, capture target, title, form and scroll
content retain their identity; ordinary rerenders and header resizing do not
refresh the backdrop. This JavaScript lifecycle workaround works in existing
builds and does not change tint policy or disable screen freezing. Native
verification of the reported gray header on Back remains required.
Scrolling, safe areas, measured title clearance and touch shielding remain when
a caller explicitly disables blur. Only that explicit opt-out skips the blur
target and backdrop; its title and Back remain above the scroll content.

`PageFrame` reports a performance marker once its native frame has laid out,
its route is focused, the app is active and root startup presentation has
completed. The marker retries on readiness, focus or foreground changes without
adding layout state or changing the frame's mounting. It labels readiness as
`frame-layout`: optional data, every native child and transition animations may
still be pending. The default performance-readiness context is false, keeping
isolated native previews outside application startup/navigation metrics.
Reporting failures never block the usable frame. See
[performance measurement](../../../../docs/performance.md) for the baseline protocol.

Titled frames reserve the top safe area plus a 48-point minimum title row on the
first render. Pages with and without Back share that minimum, so navigation does
not stretch the SVG just to accommodate the button. Incomplete native layout
passes below that minimum are ignored; valid taller measurements still resize
the header for wrapped titles and larger text. Only the focused frame publishes
its height to the shared wave. Safe-area changes apply to the retained title
height immediately. Titleless frames keep their existing safe-area-only layout.
`Components/Page Header/NavigationContinuity` remounts Home and Details beneath
one paused wave to inspect first-render height and Back round trips.
Earlier page-frame fixtures covered incomplete layout and measurements with
mocked native boundaries; those suites are retired. Current native layout and
transition appearance remain manual checks.

`PageMotionOverlay` wraps root navigation with `PageWaveContext`. The header uses
original cubic vector artwork with independently moving control points. The leading
40% stays level beneath the title/back button; only the trailing surface deforms.
Dunes, Ribbon and Rain remain the animated effects. Likan selects Default
initially; the template selects Dunes. Default is the ordinary rectangular native
header with native blur and no decorative motion. Settings offers all four
choices for themes with header artwork enabled. Rain adds twelve staggered
falling drops and impact ripples. Altarea's disabled header artwork takes
precedence over saved effects: it mounts no wave or decorative mask, while the
rectangular native blur remains. Settings omits the inactive effect picker.
Saved effects remain available when a theme supports them. Launch artwork is
unaffected.
The shared active-time clock drives all paths on the UI thread. Skia uses numeric
`usePathValue` builders without SVG parsing; the iOS native material mask receives
animated SVG `d` values from the same control points. SVG serialization lives only
in the iOS surface's unconditional `useAnimatedProps` callbacks; Android uses
numeric Skia paths and never serializes header SVG. Splash uses cached paths and
never evaluates the deforming header contours. No animation frame sets React state. RTL mirrors the whole
artwork. The header stays within its measured bounds and adds no content spacing.
Settings → Appearance → Header motion uses a native menu picker to select an effect.
The change is immediate throughout the app and is saved in AsyncStorage. Restoration
finishes beneath the launch screen; invalid/unavailable storage retains the
configured initial style (Default for Likan, Dunes for the template).
Storybook's local preference provider never reads or writes this saved preference.
Static SVG counterparts are in `assets/images/header-motion/`; production animates
those vector contours and details through the shared geometry helpers.
`Components/Page Header` offers the three shapes in Controls. Its AppSettings story
also exercises the picker against the local header. `animate={false}` freezes all
surface and detail motion; the live accessibility/app-activity guards do the same.
The clock accumulates active frame time and wraps seamlessly after 120 seconds. Replacing a page's mask joins the current phase; backgrounding, Reduce
Motion, explicit pause and visibility changes retain that phase. Resume excludes
paused time, and a delayed frame advances by at most 64 ms to avoid a sudden jump.
The optional `children` slot supplies this context to local previews; `visible`
hides the artwork and mask without remounting navigation. Splash waves keep their
existing opaque fills and do not supply a blur mask.

`PageMotionOverlay.shape` accepts the three contours or `'default'`. The outer
provider and children keep the same React position across style changes; only
the private artwork component mounts/unmounts. That component publishes its
stable motion object before paint on geometry changes, never per animation
frame. Default mounts no wave hook, frame clock, canvas or SVG mask; its touch
shield is an ordinary View and its existing rectangular native blur retains
measured height, safe areas, scrolling, accessibility and the back control.
Pausing or hiding an animated header keeps its phase; selecting Default releases
that wave instance and choosing an animated style again starts a fresh phase.

On iOS, `page-wave-surface.ios.tsx` renders an Expo UI SwiftUI `ultraThin` material
inside a native SwiftUI mask. An animated SVG uses the same wave path strings and
transforms as the artwork. This avoids masking an ancestor of UIKit's
`UIVisualEffectView`, which disables its blur, and keeps a Metal canvas out of the
SwiftUI mask. The native mask has an explicit height and a bounded Host.
Rectangular iOS headers use the public light/dark `systemUltraThinMaterial`
styles. These and SwiftUI's `ultraThin` remain system materials, with native
color treatment; they do not guarantee an exactly tint-free blur.

Android retains Expo UI's `MaskedView` with a Skia mask and `expo-blur`.
Both rectangular and masked headers share
[`page-blur.ts`](../../../../src/components/ui/page/page-blur.ts). Android leaves
tint, intensity and reduction factor at Expo's defaults (`default`, 50 and 4).
There is no custom radius/tint calculation or changing blur-strength prop.
No native capability check or package patch is required. The existing
`dimezisBlurViewSdk31Plus` policy remains: Android
12+ uses native blur, while older versions use the translucent fallback.

Neither platform exposes a numeric header-blur control. The theme provider has
no blur-level state or persistence; older saved levels are ignored. Rectangular
iOS headers retain intensity 40, and the SwiftUI wave retains its system-owned
material strength. The [appearance owner](../../template-skill-ui-appearance/SKILL.md)
documents the remaining saved preferences.

iOS Reduce Transparency replaces the blur with the theme's `background` token. The backdrop
ignores touches. An absolute transparent shield blocks taps and gestures within
the header band, including content scrolled underneath it. Its height follows
the greater of the measured header and the wave's current bottom edge, including
expanded Login and collapse. The back-button layer stays above it. Content below
the band remains interactive. The shield adds no spacing and is hidden from accessibility.
Settings reserves its measured header height inside the first section's custom
header, so that space scrolls away and the native form passes beneath the wave
blur. `pageFormModifiers` fills the native viewport and, on iOS, hides the system
Form canvas as well as the view background;
Android retains the transparent native FieldGroup. Neither platform nests scroll
containers. Settings label/detail columns use a leading full-width frame on iOS
so text starts at the native row inset; Android uses its weighted column.
The title and back control stay above the blur; the viewport clips
only to the full content frame. Full-height overlays retain the top device inset for map controls.
Without wave context, a rectangular native blur covers the measured header and
retains the same Reduce Transparency fallback.

`Components/Page Header` previews default, dark, scrolling, full-height overlay
and no-wave headers with deterministic cards and a counted back action.
`NativeBackReturn` and `NativeBackReturnDark` push the real `/settings` route
from the retained Storybook screen. Use Settings Back or Android system Back,
then check the draft, content count, scroll position and colored cards beneath
the blur over repeated round trips. `NavigationContinuity` replaces a local
frame to check geometry; it does not exercise native screen retention.
`AppSettings` and `DarkAppSettings` render the actual grouped settings form,
with a counted back action outside the form for checking scrolling and header interaction.
Automated suites have been removed; existing test IDs remain for future tests.
Check content spacing, retained drafts during header resizing, overlay safe areas,
live Reduce Transparency and native blur manually on a device. Verify that an
uncovered content button works, a button beneath the title cannot be activated
through it, and Back remains usable before and after scrolling.

`page-screen.tsx` composes scrolling content and actions. Its optional `showBack={false}` hides the back control without applying tab-bar insets; standalone Home uses this mode.
Tab mode adds `tabBarRaisedHeight` (28 points/dp) inside the scroll content after
its last action; Settings tab mode adds the same clearance in its final section
footer. This clears the raised circle while content remains visible beside it.
The dock already reserves its tab row and bottom system inset; do not add its
full height again. See the [navigation contract](../../template-skill-ui-navigation/SKILL.md).
`page-frame.tsx` handles the header's safe area and leaves other edges to content.
Its optional `headerOverlay` floats the blurred header above full-height content,
as used by Cartes. Overlay content retains the top device inset for native map controls;
the header band blocks map gestures while the map below remains interactive.
Its adjusted safe-area context keeps a stable identity until content insets change,
so unrelated parent updates do not notify every inset consumer.
`page-header.tsx` uses the private `page-back-button.*` adapters.
Titles align to the leading edge on both platforms (left in LTR, right in RTL).
The iOS title uses an explicitly leading full-width frame so SwiftUI does not
center it in the available space; Android retains its weighted title column.
The existing `Components/Page Header` stories cover titles and counted back actions;
native title alignment still requires iOS and Android visual verification.
Both platforms use zero vertical and 16 points of horizontal
header padding. The temporary red debug background has been removed.
The status-bar inset is applied once by
`PageFrame`, while the header Host ignores automatic native safe areas.
The title row vertically centers the back button and title so the arrow aligns
with the text. Long titles retain their natural height. Back actions keep their
48-point native touch area. The Page Header
story's `showBack` control compares both states; `Home` opens the Accueil case.
`page-motion-overlay.tsx` contains the shared animated top-edge wave artwork.
Its header geometry deforms on the UI thread; splash artwork alone retains its
cached paths and original opposite drift. The default `overlay` variant is absolute,
while `variant="splash"` keeps the 80-point launch reveal edge in normal flow.
Both variants retain motion guards. Login expansion and its one-second collapse
keep artwork and native masks aligned and release extended bounds on completion.
The optional `shape` prop overrides the shared `DEFAULT_HEADER_SHAPE` in
`src/constants/header-motion.ts`. Root navigation passes the saved preference
when `design.header.artwork` is enabled and uses Default otherwise.
Splash retains its original artwork regardless of this preference.
Header layers share the theme's tint with
a gentle 20% gradient fade for a more consistent color across the filled area.
`Pages/Shared Skia motion/NavigationContinuity` replaces Home, Search and Saved
recipes frames beneath one overlay, with pause/resume and a back action.
Check the controls, retained pause state, native visual continuity and performance
manually on both platforms.
`expanded` centers the shallow wave band at 35% of the window height and fills
continuously from the top of the screen to the curved edge. Only the straight
closing edges extend upward; the curves retain their header-relative depth.
Drawing bounds remain expanded until collapse completes, then return to the
measured header height. `Components/Page Header/ExpandedLogin` previews this filled area.
Login uses it while signed out. Successful login raises
the wave to the header over one second. Opening Register and returning to Login
use the same slower transition. `onCollapseComplete` releases navigation only
after a completed rise, so Home cannot interrupt the successful-login animation.
Reduced motion snaps to the destination and releases navigation immediately.
Default and themes with header artwork disabled also bypass the login wave hold
because no completion callback will run. The auth request and duplicate-submit guards remain with the feature, and
the splash keeps its usual position. Historical Shared Skia motion fixtures
predate the current starter; use actual Login for the native auth transition.
The root mounts it above navigation and enables it on Android and iOS after the
launch screen exits. It retains its activity and reduced-motion guards.

Retained `PlainHeader` and `ChangeHeaderStyle` compositions cover Default and live
Dunes/Default switching. The latter toggles through its counted Back control;
verify that the draft, content count and scroll position survive. Retained
registration is not a runnable Storybook route or evidence of native behavior.
Navigation themes, stack content and tab scenes use the active theme's opaque
`background` token so outgoing text cannot show through an incoming screen.
Frames, headers and page content reveal their owning scene's background;
native cards and controls keep their usual semantic surfaces. The full-screen
aurora remains in the launch screen and dedicated previews, rather than running
behind opaque navigation scenes.

Theme controls live in App Settings, with no preference footer on page shells.
Keep system insets outside keyboard padding and preserve the existing tab-bar
inset ownership.

Page actions accept stable `testID` values independent of translated labels.
Motion follows focus/activity/reduced-motion guards. The artwork ignores touches;
the page-local shield handles header touch blocking below the back-button layer.
See [shared motion](../../../../docs/shared-skia-motion.md).

Composition story: [page-header.stories.tsx](../../../../.rnstorybook/stories/components/page-header.stories.tsx),
including `FullHeightOverlay` with a simulated notch.

Import public components from `@components/ui`; UI implementations import
concrete files directly. [Back to the UI guide](../../../../docs/ui.md).

The saved app Reduce Motion switch overrides the system preference for custom motion. Before an override is selected, the live system preference applies. Backgrounding still pauses animation. See the appearance skill for preference ownership.

`Components/Page Screen/StandaloneHome` and `BackAction` exercise the `showBack` prop with counted content/back actions and the same native page Host.
`NarrowScreen`, `WideScreen`, `WideLongContent` and `WideRTL` exercise the
shared width boundary using the real preview width. Use a wide native device or
window for the wide cases; fixtures do not simulate an unfolded device.
