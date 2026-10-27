---
name: template-skill-ui-page
description: Compose page frames, sections and header insets without duplicating safe-area ownership.
---

# Pages

Import `PageScreen`, `PageFrame`, `PageHeader`, `PageSection`,
`PageMotionOverlay` and `pageFormModifiers` from `@components/ui`.
Source: [page/](../../../src/components/ui/page/).

## Frame and content

- Use `PageScreen` for ordinary hosted, scrollable native content.
  It owns keyboard avoidance, refresh composition and optional route actions.
- Use `PageFrame` for custom content boundaries; it owns header safe areas.
- Wrap ordinary content in `PageSection`: 16-point symmetric padding and gap.
  Use `inset={false}` when full-width content owns its gutters.
- Native content Hosts cap at `screenContentMaxWidth` (640 points), centered on
  wide displays. Keep frame backgrounds, header blur and artwork edge-to-edge.
- `showBack={false}` hides Back without adding tab insets. `tab` adds only the
  28-point raised-button trailing clearance; the dock owns its row/system inset.
- Keep system insets outside keyboard padding and avoid nested scroll containers.

## Header

Titled frames blur underlying content by default. `headerBlur={false}` opts out.
Artwork eligibility and saved motion choice are independent of blur.

Ordinary frames reserve measured header height in layout.
`scrollsBehindHeader` callers put `usePageHeaderInset()` inside scroll content.
`headerOverlay` floats over full-height content and preserves the device top
inset for controls such as maps.

- Start with top inset plus the 48-point minimum title row. Ignore incomplete
  smaller measurements; allow larger titles to grow.
- Titles align logically leading; Back retains a 48-point touch target.
- Keep title/Back sharp above blur. The transparent shield blocks content
  gestures under the header while Back and uncovered content remain interactive.
- Preserve draft, scroll and native content identity when header geometry changes.

Read [header rendering and motion](references/page-guide.md) when changing blur,
artwork or retained-screen behavior. Check actual native Back round trips,
safe-area changes, RTL, large text and shield hit testing using
[page-header stories](../../../.rnstorybook/stories/components/page-header.stories.tsx).
Static checks do not establish native blur or gesture behavior.
