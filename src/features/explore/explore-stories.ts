export type ExploreStory = {
  id: 'forest' | 'coast' | 'space' | 'mountain' | 'lake' | 'studio';
  category: 'nature' | 'spaces' | 'coast';
  photoId: number;
  minutes: number;
};

// shortcut: this collection is a local sample; replace it when an editorial API is available.
export const exploreStories: readonly ExploreStory[] = [
  { id: 'forest', category: 'nature', photoId: 1018, minutes: 5 },
  { id: 'coast', category: 'coast', photoId: 1011, minutes: 4 },
  { id: 'space', category: 'spaces', photoId: 1031, minutes: 3 },
  { id: 'mountain', category: 'nature', photoId: 1015, minutes: 6 },
  { id: 'lake', category: 'nature', photoId: 1016, minutes: 4 },
  { id: 'studio', category: 'spaces', photoId: 1040, minutes: 5 },
];

export function explorePhotoSource(photoId: number, revision: number) {
  return `https://picsum.photos/id/${photoId}/900/650?revision=${revision}`;
}
