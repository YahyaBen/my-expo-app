---
name: template-skill-ui-page
description: Compose page frames, sections and header insets without duplicating safe-area ownership.
---

# Pages

Import `PageScreen`, `PageFrame`, `PageHeader`, `PageSection` and
`pageFormModifiers` from `@components/ui`.
Source: [page/](../../../src/components/ui/page/).

## Frame and content

- Use `PageScreen` for ordinary hosted, scrollable native content.
  It owns keyboard avoidance, refresh composition and optional route actions.
  Only `title` is required; omit `description` when the content supplies its own
  introduction. Actions accept readonly arrays of `PageScreenAction`.
  An optional `footer` string stays below the scrollable content as a centered,
  muted caption, within the page's bottom safe area. The caller owns its text.
- Use `PageFrame` for custom content boundaries below the native stack header; it owns content safe areas and readiness.
- Wrap ordinary content in `PageSection`: 16-point symmetric padding and gap.
  Use `inset={false}` when full-width content owns its gutters.
- Native content Hosts cap at `screenContentMaxWidth` (640 points), centered on
  wide displays. Keep frame backgrounds edge-to-edge.
- Bounded Android page/form Hosts use `useViewportSizeMeasurement` to supply a
  nonzero initial Compose proposal before Yoga settles their viewport. Keep
  explicit bounds and the width cap; do not enable it for intrinsic inline Hosts.
- `tab` adds only the 28-point raised-button trailing clearance; the dock owns
  its row/system inset. Expo Router owns native Back based on navigation history.
  `showBack` and `onBack` remain compatible props for the disabled custom header;
  they do not configure the native Back action.
- Keep system insets outside keyboard padding and avoid nested scroll containers.

## Header

Expo Router's root `Stack` shows its default native header. Route options own
translated titles; the template shell updates the title when its active tab
changes. Configure native header presentation through Router options.

`PageFrame` leaves the native header outside its content tree and passes a zero
top inset to descendants, retaining bottom and side insets. It mounts no custom
blur capture target, backdrop, header measurement or touch shield.
`usePageHeaderInset()` returns zero. Page and authentication keyboard frames use
`useHeaderHeight` from `expo-router/react-navigation` for their vertical offset.

`title`, `onBack`, `headerMode` and `headerBlur` remain accepted by `PageFrame`
for source compatibility; they do not configure the active native header.
The custom header rendering is commented out, and its component files remain.
Use the page-header story for real route pushes and native Back round trips,
retained drafts/scroll, keyboard reachability, RTL, large text and safe areas
on iOS and Android. Static checks do not establish native behavior.

## Retained custom header (disabled)

Titled frames use one rectangular native blur backdrop by default.
`headerBlur={false}` opts out. Header geometry has no decorative variants or
saved style preference.

`headerMode` selects one layout: `fixed` (default) reserves measured header
height, `scroll` callers put `usePageHeaderInset()` inside scroll content, and
`overlay` floats over full-height content while preserving the device top inset
for controls such as maps. Untitled `scroll` frames reserve only the top safe area.

- Start with top inset plus the 48-point minimum title row. Ignore incomplete
  smaller measurements; allow larger titles to grow.
- Titles align logically leading; Back retains a 48-point touch target.
- Keep title/Back sharp above blur. The transparent shield blocks content
  gestures under the header while Back and uncovered content remain interactive.
  Its bounds use this page's measured header height; untitled pages have no shield area.
- Preserve draft, scroll and native content identity when title presence, blur or
  header mode changes. The capture target stays mounted in every mode.

Read [header rendering](references/page-guide.md) when changing blur or
retained-screen behavior. Check actual native Back round trips,
safe-area changes, RTL, large text and shield hit testing using
[page-header stories](../../../.rnstorybook/stories/components/page-header.stories.tsx).
Static checks do not establish native blur or gesture behavior.
