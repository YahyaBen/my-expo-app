# Safe-area handling

The current tab layout uses one Expo Router route with a native Expo UI dock. See the
[navigation architecture](architecture.md) for route ownership.

## Ownership

| Surface                        | Top                 | Bottom              | Sides               |
| ------------------------------ | ------------------- | ------------------- | ------------------- |
| Main tab content               | Screen              | In-flow tab dock    | Screen              |
| Detail with shared page header | Screen              | Screen              | Screen              |
| Authentication                 | Screen              | Screen              | Screen              |
| Account screen                 | Screen              | Screen              | Screen              |
| Launch readiness               | Content frame       | Content frame       | Content frame       |
| Native sheets                  | Native presentation | Native presentation | Native presentation |

`screenInsets` describes inset ownership without fixed device sizes. The custom
dock receives actual bottom/side values from the template screen. Pages and dock
controls use the larger side inset on both sides to stay centered when a camera
cutout changes sides in landscape. The dock background remains full-width.
Content does not add another native-tabs `SafeAreaView`.
Home, Discover, Settings and the example pages use `PageScreen tab` to
omit bottom system padding and Back. Settings disables the page's outer scrolling
so its bounded native `FieldGroup` remains the only scroll owner.
Page frames own the custom header and its
top safe area; content receives only the insets it still needs. The root stack
keeps Expo Router's default header hidden.

The dock's 84-point/dp frame contains the entire raised 76-point/dp button and
the 56-point/dp tab row in one native layout. Its negative 28-point/dp top margin
allows content to remain visible beside the raised button; that region has a
transparent background. The tab row and system bottom inset reserve screen
height, while the full native frame retains the circle's touch bounds.
Tab scroll content adds only the shared `tabBarRaisedHeight` clearance after its
last action, rather than padding for the entire dock. `PageScreen tab` supplies
inner scroll padding for ordinary tab pages; Settings adds that clearance inside
its final `FieldGroup` section footer. The dock
hides while the keyboard is visible. See the
[navigation contract](../.agents/skills/template-skill-ui-navigation/SKILL.md) for geometry ownership.

Expo Router already provides the root `SafeAreaProvider`; the app does not add
another provider around individual pages. Hooks handle changing insets with navigation
transitions. Backgrounds and Skia artwork may reach the edges; controls remain
inside protected content bounds. The app allows portrait and landscape rotation;
asymmetric side-inset cases cover rotation and tablet/window layouts.
The title Host reports its content height separately from the top safe area;
rotation must not subtract a newer inset from an older padded layout event.

Page Hosts opt out of automatic SwiftUI safe areas. Ordinary pages and
authentication put device insets inside scrolling content so the viewport stays
unpadded. Bounded native forms reserve device safe areas with outer margins and
keep their own section gutters. PageFrame publishes symmetric side insets to its
content, while top and bottom ownership stays independent. Callers that calculate
photo widths outside the frame use the same `horizontalSafeAreaInset` helper.
Fixed headers reserve space with a content margin inside the full-size blur target.

RN keyboard padding handles overlap on iOS and Android independently of content
insets. Tab and detail pages use the shared content header, so no native-header
keyboard offset is needed. In the installed Android Expo UI implementation, the
Host's keyboard-aware viewport measurement only clamps unbounded constraints;
it does not guarantee avoidance for these flex-sized screen Hosts. Native bottom
sheets keep their presentation's insets and keyboard behavior.

## Documentation

The tab integration follows the
[JavaScript tabs guide](https://docs.expo.dev/router/advanced/tabs/) and installed
Expo Router and Expo UI implementations. See also the
[SDK 58 safe-area-context reference](https://docs.expo.dev/versions/v58.0.0/sdk/safe-area-context/)
and [Expo UI Host reference](https://docs.expo.dev/versions/v58.0.0/sdk/ui/universal/host/).
Native rendering, keyboard behavior and device geometry still require device
checks.

## Native verification

Inspect iOS and Android with gesture and three-button navigation, a notched phone,
tablet/window resizing, large text and the keyboard open. Check the last scroll
item, raised action's hit area, native sheets, Back navigation, header transitions
and keyboard dismissal. Use the app's native component pages and screens; JavaScript
inset fixtures do not simulate operating-system geometry or prove native behavior.
Rotate portrait → landscape left → landscape right → portrait while scrolled on
Discover, then repeat in Settings and a photo example. Check centered gutters,
the full-width dock surface, header height, retained scroll position and responsive
controls, including in RTL.
