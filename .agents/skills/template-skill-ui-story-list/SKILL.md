---
name: template-skill-ui-story-list
description: Compose overlapping photo stories with snap selection and native accessibility.
---

# Story list

Import `StoryList` from `@components/ui` inside an existing native Host.
[Source](../../../src/components/ui/story-list/story-list.tsx) owns the Picsum
starter photos, overlapping-card transforms, labels and selectors.

- Use page-width content: card geometry follows the window, safe areas and shared
  page spacing rather than an arbitrary narrow parent.
- Keep native controls/text around the RN artwork/scroll boundary.
- Continuous scroll offset stays on the UI runtime. React updates selection
  only when scrolling settles or an accessibility action selects a photo.
- Preserve snap scrolling, overlapping-card transforms, physical LTR scroll
  coordinates and explicit RTL mirroring.
- Restore the selected photo after width/direction changes and retain adjustable
  increment/decrement actions.
- Reduced motion uses the simpler fade. Keep helpers within this family.

Use [native stories](../../../.rnstorybook/stories/components/story-list.stories.tsx)
to verify swiping, accessible selection, live RTL, resizing and both appearances.
