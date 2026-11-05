---
name: template-skill-ui-bottom-sheet
description: Compose controlled modal and embedded sheets with native content and caller-owned actions.
---

# Bottom sheets

Import `BottomSheet` and its public types from `@components/ui`.
Source: [bottom-sheet.tsx](../../../src/components/ui/bottom-sheet/bottom-sheet.tsx).

## Shared contract

Required: `isPresented: boolean` and `onDismiss: () => void`.
Optional: native `children`, `testID`, `title`, and `headerAction`.
The action accepts a typed `icon`, translated `accessibilityLabel`,
`onPress: () => void`, and optional `testID`. Its callback owns dismissal;
a custom action never implicitly closes the sheet. Titles wrap to two lines.

- Keep the presenter mounted. Explicit Close sets state false; `onDismiss`
  synchronizes user dismissal. It is not an animation-completed callback.
- For multiple modal sheets, keep one active identifier and ignore delayed
  callbacks for another presentation. Do not clear content early.
- Opening a transactional sheet copies committed preferences into a draft.
  Apply commits; Cancel/native dismissal discards. Dismissal is not submission.
- Feature callers own async work, pending controls and stale-result guards.
  Sheets do not guarantee that pending requests prevent dismissal.

## Modal presentation (default)

Omit `presentation` or use `presentation="modal"`. Optional finite positive
`contentHeight` bounds content, not native detents or outer sheet height.
There are no modal style, snap-point, padding, ref, modifier or dismissal-lock props.

- Expo owns modal presentation and its internal Host. Inside, use native
  Column/Row, content text and content buttons with explicit variants.
- Retain project UniversalHost context at an RN presenter boundary. RN artwork
  requires RNHostView; controls re-entering from RN require a new Host.
- Omit contentHeight for short intrinsic content. Constrain full-width controls;
  do not force intrinsic content with flex: 1.
- For long content, give contentHeight and the native ScrollView viewport the
  same responsive height before presenting. Keep inner content intrinsic.
- Native safe areas, corners, padding and expanded states remain platform-owned.
  The surface uses Host colors; iOS hides its native drag indicator. Root app
  appearance controls the modal; an isolated Host override does not prove it.

## Inline presentation

Use `presentation="inline"` at an RN boundary inside a bounded container.
Supply positive `height`, `collapsedHeight`, controlled `expanded`,
`onExpandedChange`, and translated `expandAccessibilityLabel` /
`collapseAccessibilityLabel`. Optional `bottomClearance` reserves overlapping
content space, such as the dock's raised region; it excludes system safe areas.

Optional `collapsedContent` supplies a compact peek; the expanded native
content remains mounted with a stable scroll viewport during motion.
`dismissOnCollapse` makes menus slide away directly instead of retaining
a collapsed preview; Android Back then dismisses immediately.

- The sheet owns its gesture root, native header/content Hosts and bounded
  vertical ScrollView. Supply native, intrinsic children without another
  vertical ScrollView or standalone Host.
- It creates no modal, portal or backdrop. Render the navigation dock after the
  containing screen, with its existing safe-area ownership.
- Drag anywhere in the header to expand/collapse; tap the accessible handle
  to toggle. Header actions retain their native press behavior. Content scrolls
  independently. Controlled visibility is changed by caller actions.
  Touch-down catches the current spring position before pan recognition; a
  failed pan resumes its previous target. Pan commits selection after release
  and restores the previous target when canceled. Peek and expanded content stay
  mounted but are never painted over each other during a drag. The handle tap
  waits for the header pan to fail, so a drag cannot also toggle the panel.
  Keep the presenter mounted while closed so its exit can finish; respect
  interrupted drags and keep content until the closing spring completes.
- Android Back collapses an expanded sheet, then dismisses a collapsed sheet.
  Mount it only in the active/retained page's effect lifecycle so hidden pages
  do not intercept Back. Respect appearance, RTL and reduced motion.
- Header measurement allows large text to grow and clamps the collapsed height
  to the available expanded height. The caller supplies responsive bounds.

Use [Bottom Sheet/Playground](../../../.rnstorybook/stories/components/bottom-sheet.stories.tsx)
for modal, inline and custom-action examples. Verify close/reopen, custom actions
without dismissal, drag interruption, scrolling to the final action, dock edge
taps, keyboard, Android Back, large text, appearance and RTL on both platforms.
Static checks do not establish native behavior or animation performance.
