# Safe-area handling

The current tab layout uses one Expo Router route with a native Expo UI dock. See the
[navigation architecture](architecture.md) for route ownership.

## Ownership

| Surface                   | Top                 | Bottom              | Sides               |
| ------------------------- | ------------------- | ------------------- | ------------------- |
| Main tab content          | Native stack header | In-flow tab dock    | Screen              |
| Detail with native header | Native stack header | Screen              | Screen              |
| Authentication            | Native stack header | Screen              | Screen              |
| Account screen            | Screen              | Screen              | Screen              |
| Launch readiness          | Content frame       | Content frame       | Content frame       |
| Native sheets             | Native presentation | Native presentation | Native presentation |

`screenInsets` describes inset ownership without fixed device sizes. The custom
dock receives actual bottom/side values from the template screen and adds
them once. Content does not add another native-tabs `SafeAreaView`.
Home and the example pages use `PageScreen tab`; Settings uses its tab mode to
omit bottom system padding. Expo Router renders the native header and Back action.
Page frames pass zero top inset to content because the stack has already reserved
the header and status bar; they retain the bottom/side inset values.

The dock's 84-point/dp frame contains the entire raised 76-point/dp button and
the 56-point/dp tab row in one native layout. Its negative 28-point/dp top margin
allows content to remain visible beside the raised button; that region has a
transparent background. The tab row and system bottom inset reserve screen
height, while the full native frame retains the circle's touch bounds.
Tab scroll content adds only the shared `tabBarRaisedHeight` clearance after its
last action, rather than padding for the entire dock. `PageScreen tab` supplies
inner scroll padding; Settings tab mode uses its last section footer. The dock
hides while the keyboard is visible. See the
[navigation contract](../.agents/skills/template-skill-ui-navigation/SKILL.md) for geometry ownership.

Expo Router already provides the root `SafeAreaProvider`; the app does not add
another provider around individual pages. Hooks handle changing insets with navigation
transitions. Backgrounds and Skia artwork may reach the edges; controls remain
inside protected content bounds. Portrait remains the app's configured
orientation; asymmetric side-inset cases cover possible tablet/window layouts
and future rotation support without changing that setting.

The page Host opts out of automatic SwiftUI safe areas because the outer frame handles them. RN keyboard padding handles overlap on iOS and Android. Page and authentication keyboard frames use Router's measured header height as their vertical offset. The system-inset frame wraps the keyboard frame so keyboard padding cannot replace its bottom safe area. In the installed Android Expo UI implementation, the Host's keyboard-aware viewport measurement only clamps unbounded constraints; it does not guarantee avoidance for these flex-sized screen Hosts. Native bottom sheets keep their presentation's insets and keyboard behavior. The Host wrapper's global defaults are unchanged.

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
and keyboard dismissal. Use current native stories and app screens; JavaScript
inset fixtures do not simulate operating-system geometry or prove native behavior.
