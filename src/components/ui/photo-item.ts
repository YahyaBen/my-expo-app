import type { ImageSource } from 'expo-image';

/** Stable IDs preserve selection; labels belong to the caller's language. */
export type PhotoItem = {
  id: string;
  source: ImageSource | string | number;
  label: string;
};
