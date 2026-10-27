import type { PhotoItem } from '@components/ui';

/** Remote demo images belong to stories, never to reusable UI components. */
export const photoFixtures: readonly PhotoItem[] = [1018, 1015, 1016, 1025, 1039, 1043].map(
  (id, index) => ({
    id: String(id),
    source: `https://picsum.photos/id/${id}/600/600`,
    label: `Photo ${index + 1}`,
  }),
);
