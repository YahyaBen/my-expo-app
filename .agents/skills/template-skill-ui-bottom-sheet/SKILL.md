---
name: template-skill-ui-bottom-sheet
description: Compose controlled native modal sheets with caller-owned content and actions.
---

# Bottom sheets

Import `BottomSheet` and its public types from `@components/ui`.
Source: [bottom-sheet.tsx](../../../src/components/ui/bottom-sheet/bottom-sheet.tsx).

## Shared contract

Required: `isPresented: boolean` and `onDismiss: () => void`.
Optional: native `children`, `testID` and `dismissible` (default `true`). Put any title and translated Close
button inside the content or the caller-owned `header` slot.

- Optional native slots render in this order: `banner`, `header`, `actions`,
  `children`, `footer`, with shared vertical spacing. Omitting all slots preserves
  the original children-only layout. No title, action schema or close button is
  injected; compose existing native controls in the slots.
- Use `banner` for artwork, `header` for a title and accessible circular close or
  Popover trigger, and `actions` for a native horizontal ScrollView with Chips or
  buttons. A supplied banner reaches the sheet's content edges with no outer
  padding; the header, actions, body and footer keep 16 pt/dp insets in an inner
  Column. Native drag-handle space and safe areas remain platform-owned.
  Bridge RN artwork with RNHostView and a real width constraint.
- Use `BottomSheetBanner` from `@components/ui` for the shared 176 pt/dp banner
  with centered native children and animated circular inversion masks. Set its
  required `animate` prop from presentation and destination focus. The mask stays
  inside the banner, does not intercept taps and respects foreground and Reduce
  Motion through the shared motion clock. Skia loads only for a visible mask.
  The shared banner owns its RN bridge and nested native Host; do not add another.
- Banner compositions with `heightFraction` and no `contentHeight` or `scrollable`
  fill their presentation and allocate remaining height below the banner to the
  body. Keep caller-owned scrolling and fixed actions within that bounded body.
- Set `scrollable` and a finite positive `contentHeight` for a bounded native
  vertical scroll viewport. The entire composition, including the footer, scrolls
  together. Do not nest another vertical scroller in that mode. Omit `scrollable`
  when the caller already owns scrolling or needs a separate fixed footer.

- Keep the presenter mounted. Explicit Close sets state false; `onDismiss`
  synchronizes user dismissal. It is not an animation-completed callback.
- For multiple modal sheets, keep one active identifier and ignore delayed
  callbacks for another presentation. Do not clear content early.
- Opening a transactional sheet copies committed preferences into a draft.
  Apply commits; Cancel/native dismissal discards. Dismissal is not submission.
- Feature callers own async work, pending controls and stale-result guards.
  Pending work alone does not prevent dismissal. Set `dismissible={false}` for a
  required action: swipe, backdrop and Android Back dismissal are disabled and
  the drag indicator is hidden. Caller-owned buttons/state can still close it.
  Android locked sheets skip the partially expanded state so actions cannot be
  trapped below a non-expandable sheet.
  On Android, closing a locked sheet removes it immediately without waiting for
  a closing animation.
  Keep locked sheets inside an existing UniversalHost; at an RN boundary supply
  a full-size, non-intercepting UniversalHost rather than sizing to modal content.

## Modal presentation

Omit `presentation` or use `presentation="modal"`. Optional finite positive
`contentHeight` bounds content, not native detents or outer sheet height.
Optional `heightFraction` (greater than 0 and at most 1) presents the sheet at one
fraction of the available native height. Use a bounded fill-size content root;
iOS uses a single detent and Android sizes the content while skipping its partially
expanded state. Keep Android's outer modal unconstrained so its anchors use the full
window. Fractional Android sheets require an existing UniversalHost. Omit
`contentHeight` when content should fill that presentation.
There are no modal style, snap-point array, padding, ref or modifier props.

- Expo owns modal presentation and supplies a Host at an RN boundary. Use a
  single native layout root such as a Column for content with multiple children.
- Retain project UniversalHost context at an RN presenter boundary. RN artwork
  requires RNHostView; controls re-entering from RN require a new Host.
- Omit contentHeight for short intrinsic content. Constrain full-width controls;
  do not force intrinsic content with flex: 1.
- For long content, give contentHeight and the native ScrollView viewport the
  same responsive height before presenting. Keep inner content intrinsic.
- Native safe areas, corners, drag indicator and default expanded states use
  Expo defaults unless dismissal is locked. Padding uses native defaults without a
  banner; banner compositions move those insets to their inner content. The surface uses Host colors. Root app appearance controls the
  modal; an isolated Host override does not prove it.

Use the [bottom-sheet examples](../../../src/features/template/bottom-sheet-examples.tsx)
for basic, animated banner, improvements and action-rail compositions. Verify close/reopen, native dismissal, scrolling to the
final action, keyboard, Android Back, large text, appearance and RTL on both platforms.
Static checks do not establish native behavior or animation performance.
