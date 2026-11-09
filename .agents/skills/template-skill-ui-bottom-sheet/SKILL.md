---
name: template-skill-ui-bottom-sheet
description: Compose controlled native modal sheets with caller-owned content and actions.
---

# Bottom sheets

Import `BottomSheet` and its public types from `@components/ui`.
Source: [bottom-sheet.tsx](../../../src/components/ui/bottom-sheet/bottom-sheet.tsx).

## Shared contract

Required: `isPresented: boolean` and `onDismiss: () => void`.
Optional: native `children` and `testID`. Put any title and translated Close
button inside the content.

- Keep the presenter mounted. Explicit Close sets state false; `onDismiss`
  synchronizes user dismissal. It is not an animation-completed callback.
- For multiple modal sheets, keep one active identifier and ignore delayed
  callbacks for another presentation. Do not clear content early.
- Opening a transactional sheet copies committed preferences into a draft.
  Apply commits; Cancel/native dismissal discards. Dismissal is not submission.
- Feature callers own async work, pending controls and stale-result guards.
  Sheets do not guarantee that pending requests prevent dismissal.

## Modal presentation

Omit `presentation` or use `presentation="modal"`. Optional finite positive
`contentHeight` bounds content, not native detents or outer sheet height.
There are no modal style, snap-point, padding, ref, modifier or dismissal-lock props.

- Expo owns modal presentation and supplies a Host at an RN boundary. Use a
  single native layout root such as a Column for content with multiple children.
- Retain project UniversalHost context at an RN presenter boundary. RN artwork
  requires RNHostView; controls re-entering from RN require a new Host.
- Omit contentHeight for short intrinsic content. Constrain full-width controls;
  do not force intrinsic content with flex: 1.
- For long content, give contentHeight and the native ScrollView viewport the
  same responsive height before presenting. Keep inner content intrinsic.
- Native safe areas, corners, padding, drag indicator and expanded states use
  Expo defaults. The surface uses Host colors. Root app appearance controls the
  modal; an isolated Host override does not prove it.

Use [Bottom Sheet/Playground](../../../.rnstorybook/stories/components/bottom-sheet.stories.tsx)
for the modal example. Verify close/reopen, native dismissal, scrolling to the
final action, keyboard, Android Back, large text, appearance and RTL on both platforms.
Static checks do not establish native behavior or animation performance.
