---
name: template-skill-ui-bottom-sheet
description: Compose controlled native sheets with intrinsic or bounded content.
---

# Bottom sheets

Import `BottomSheet` from `@components/ui`.
Source: [bottom-sheet.tsx](../../../src/components/ui/bottom-sheet/bottom-sheet.tsx).

## Public contract

Required: `isPresented: boolean` and `onDismiss: () => void`.
Optional: native `children`, `testID`, and finite positive `contentHeight`.
There are no style, snap-point, padding, ref, modifier or dismissal-lock props.

- Keep the presenter mounted. Explicit Close sets state false; `onDismiss`
  also synchronizes it after gesture, backdrop or Android Back dismissal.
  Do not treat it as an animation-completed callback or clear content early.
- For multiple sheets, use one active identifier and clear only the matching
  presentation when delayed native callbacks arrive.
- Copy committed preferences into a draft when opening. Apply commits;
  Cancel/native dismissal discards. Dismissal does not imply submission.
- The feature owns async work, pending controls and stale-result guards.
  The sheet does not guarantee that pending requests prevent dismissal.

## Native content and sizing

- Expo's presenter creates an internal Host. Use native `Column`, `Row`,
  `UniversalTextContent` and content buttons with explicit `variant`.
  Do not add a standalone Host for each child.
- At an RN boundary, retain the existing project `UniversalHost` context.
  Bridge actual RN content with `RNHostView`; controls re-entering from RN
  need a Host at that new boundary.
- Omit `contentHeight` for short intrinsic content. Give full-width controls
  a constrained native parent; do not force intrinsic content with `flex: 1`.
- For long content, use the same responsive positive height on
  `contentHeight` and the native `ScrollView` viewport. Compute it before
  presentation; keep the inner content intrinsic and handle window changes.
- This bounds content, not outer sheet height or detents. Native safe areas,
  padding, corners and Android expanded states remain platform-owned.
  Keep the last action reachable with large text and the keyboard.
- The shell uses Host surface colors; iOS hides its drag indicator.
  Native appearance follows root app appearance. An isolated React Host
  override does not prove that the entire native modal or live RTL is updated.

Use the [in-app showcase](../../../.rnstorybook/components/catalog/bottom-sheet-preview.tsx)
in **Wireframes/Component Gallery** for details, transactional drafts and scrolling.
Verify reopening, draft discard, Android Back/backdrop, final-action reachability,
keyboard focus and native appearance on both platforms.
