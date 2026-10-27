---
name: template-skill-ui-scroll-view
description: Compose bounded scrolling native content with the public ScrollView export.
---

# ScrollView

Import `ScrollView` from `@components/ui` inside an existing native Host.

- Give the scroll viewport bounded dimensions and let content grow along its axis.
- Avoid nested scroll containers on the same axis.
- Use the existing `RefreshableScrollView` component when pull-to-refresh is needed.
- Keep query state and refresh work in the feature.
- Use a virtualized feature list for large datasets; ScrollView renders its children.
- Preserve the owning page's header clearance and safe-area insets.

Read the [public export](../../../src/components/ui/index.ts) and installed
[ScrollView types](../../../node_modules/@expo/ui/src/universal/ScrollView/)
before adding props or modifiers.
