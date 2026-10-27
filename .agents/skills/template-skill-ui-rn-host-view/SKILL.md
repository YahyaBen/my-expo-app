---
name: template-skill-ui-rn-host-view
description: Bridge React Native content into an existing native UI tree.
---

# RNHostView

Import `RNHostView` from `@components/ui` for React Native components or
specialized artwork that must appear inside native content.

- Keep ordinary native layout in Row and Column.
- Supply an explicit width constraint; percentage widths can collapse under
  intrinsic native measurement.
- Its children enter a React Native subtree. A native group inside that subtree
  needs one `UniversalHost` or an existing standalone hosted control.
- Check the bridge's actual bounds, touch handling and large-text layout.

Source: [public export](../../../src/components/ui/index.ts) and installed
[RNHostView types](../../../node_modules/@expo/ui/src/universal/RNHostView/).
