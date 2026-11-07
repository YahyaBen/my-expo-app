export const homeCategories = ['all', 'nature', 'spaces', 'coast'] as const;
export type HomeCategory = (typeof homeCategories)[number];

export type HomeStory = {
  id: string;
  title: string;
  description: string;
  category: Exclude<HomeCategory, 'all'>;
  photoId: number;
  minutes: number;
};

/** Small, local editorial collection; photos are served by Lorem Picsum. */
export const homeStories: readonly HomeStory[] = [
  {
    id: 'lorem',
    title: 'Lorem ipsum dolor sit amet.',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    category: 'nature',
    photoId: 1018,
    minutes: 5,
  },
  {
    id: 'consectetur',
    title: 'Consectetur adipiscing elit.',
    description:
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'coast',
    photoId: 1011,
    minutes: 4,
  },
  {
    id: 'eiusmod',
    title: 'Eiusmod tempor incididunt.',
    description:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
    category: 'spaces',
    photoId: 1031,
    minutes: 3,
  },
  {
    id: 'aliqua',
    title: 'Et dolore magna aliqua.',
    description:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    category: 'nature',
    photoId: 1015,
    minutes: 6,
  },
];
