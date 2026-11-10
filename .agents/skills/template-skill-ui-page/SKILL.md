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
- Set `scrollable={false}` when bounded native content such as `FieldGroup`
  owns scrolling. The page still owns its Host, safe areas and keyboard avoidance.
  Put `usePageHeaderInset()` inside the native scrolling header and add the
  shared `tabBarRaisedHeight` clearance inside its final section when `tab` is set.
  Keep `description`, `actions` and `onRefresh` in the default page-scroll mode.
- Use `PageFrame` for custom content boundaries; it owns header safe areas.
- Wrap ordinary content in `PageSection`: 16-point symmetric padding and gap.
  Use `inset={false}` when full-width content owns its gutters.
- Native content Hosts cap at `screenContentMaxWidth` (640 points), centered on
  wide displays. Keep frame backgrounds and header blur edge-to-edge.
- Bounded Android page/form Hosts use `useViewportSizeMeasurement` to supply a
  nonzero initial Compose proposal before Yoga settles their viewport. Keep
  explicit bounds and the width cap; do not enable it for intrinsic inline Hosts.
- `showBack={false}` hides Back without adding tab insets. `tab` adds only the
  28-point raised-button trailing clearance; the dock owns its row/system inset.
  Tab pages hide Back by default; explicit `showBack` can retain a pushed
  Template preview's Back action while keeping dock spacing.
- Keep system insets outside keyboard padding and avoid nested scroll containers.

## Header

The root Expo Router stack hides its default header. `PageFrame` renders the
shared custom title, Back action, blur backdrop and touch shield, and owns
header measurement and safe-area geometry.

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
