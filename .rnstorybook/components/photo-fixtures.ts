import type { PhotoItem } from '@components/ui';
import { svgImageSource } from './svg-image-source';

const photoIds = [1018, 1015, 1016, 1025, 1039, 1043, 1011, 1020, 1024, 1035, 1040, 1042];

/** Offline wireframe artwork retains the original item IDs and derived selectors. */
export const photoFixtures: readonly PhotoItem[] = photoIds.map((id, index) => {
  const shade = ['#e5e5e5', '#d4d4d4', '#c4c4c4', '#b3b3b3'][index % 4];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect width="600" height="800" fill="${shade}"/><circle cx="${140 + (index % 3) * 120}" cy="240" r="72" fill="#fafafa"/><path d="M0 640L200 400L350 560L470 440L600 620V800H0Z" fill="#737373"/><path d="M0 730L230 540L500 800H0Z" fill="#525252"/></svg>`;
  return {
    id: String(id),
    source: svgImageSource(svg),
    label: `Photo ${index + 1}`,
  };
});
