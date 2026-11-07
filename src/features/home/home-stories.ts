export type HomeStory = {
  id: string;
  title: string;
  description: string;
  category: 'nature' | 'spaces' | 'coast';
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
  {
    id: 'veniam',
    title: 'Ut enim ad minim veniam.',
    description:
      'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    category: 'nature',
    photoId: 1016,
    minutes: 4,
  },
  {
    id: 'commodo',
    title: 'Aliquip ex ea commodo.',
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque.',
    category: 'coast',
    photoId: 1022,
    minutes: 5,
  },
  {
    id: 'voluptate',
    title: 'In voluptate velit esse.',
    description: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
    category: 'nature',
    photoId: 1035,
    minutes: 3,
  },
  {
    id: 'cillum',
    title: 'Cillum dolore eu fugiat.',
    description:
      'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    category: 'nature',
    photoId: 1036,
    minutes: 6,
  },
  {
    id: 'perspiciatis',
    title: 'Sed ut perspiciatis unde.',
    description:
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.',
    category: 'nature',
    photoId: 1039,
    minutes: 4,
  },
  {
    id: 'inventore',
    title: 'Veritatis et quasi architecto.',
    description:
      'Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae.',
    category: 'spaces',
    photoId: 1040,
    minutes: 5,
  },
  {
    id: 'voluptas',
    title: 'Omnis voluptas assumenda.',
    description:
      'Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.',
    category: 'coast',
    photoId: 1041,
    minutes: 3,
  },
  {
    id: 'tempora',
    title: 'Quis autem vel eum iure.',
    description:
      'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus.',
    category: 'nature',
    photoId: 1043,
    minutes: 4,
  },
];
