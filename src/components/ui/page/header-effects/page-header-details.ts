import type { PageHeaderShape } from '@/constants/header-motion';
import type { SkPathBuilder } from '@shopify/react-native-skia';
import { drawVectorPath, type VectorCommand } from './page-header-shapes';

function sparkle(x: number, y: number, radius: number): VectorCommand[] {
  const inset = radius * 0.22;
  return [
    ['M', x, y - radius],
    ['L', x + inset, y - inset],
    ['L', x + radius, y],
    ['L', x + inset, y + inset],
    ['L', x, y + radius],
    ['L', x - inset, y + inset],
    ['L', x - radius, y],
    ['L', x - inset, y - inset],
    ['Z'],
  ];
}

type SeasonalDetail = {
  colors: Record<'light' | 'dark', string>;
  commands: readonly VectorCommand[];
};

const seasonalDetails: Partial<Record<PageHeaderShape, SeasonalDetail>> = {
  halloween: {
    colors: { light: '#c2410c', dark: '#fb923c' },
    commands: [
      // Pumpkin silhouette, stem and carved features.
      ['M', 0, -10],
      ['C', 9, -19, 24, -12, 24, 1],
      ['C', 24, 15, 11, 21, 0, 17],
      ['C', -11, 21, -24, 15, -24, 1],
      ['C', -24, -12, -9, -19, 0, -10],
      ['Z'],
      ['M', -3, -10],
      ['C', -3, -16, -1, -20, 6, -22],
      ['L', 7, -18],
      ['C', 3, -17, 2, -14, 2, -10],
      ['Z'],
      ['M', -15, -3],
      ['L', -9, 3],
      ['L', -4, -3],
      ['Z'],
      ['M', 4, -3],
      ['L', 9, 3],
      ['L', 15, -3],
      ['Z'],
      ['M', -11, 6],
      ['C', -5, 16, 5, 16, 11, 6],
      ['C', 4, 10, -4, 10, -11, 6],
      ['Z'],
    ],
  },
  ramadan: {
    colors: { light: '#0f766e', dark: '#5eead4' },
    commands: [
      ['M', 3, -20],
      ['C', -16, -23, -28, -5, -20, 9],
      ['C', -13, 22, 6, 23, 16, 10],
      ['C', 1, 17, -11, 5, -7, -8],
      ['C', -5, -14, -1, -18, 3, -20],
      ['Z'],
      ...sparkle(13, -9, 9),
      ...sparkle(28, 2, 5),
    ],
  },
  'new-year': {
    colors: { light: '#a16207', dark: '#facc15' },
    commands: [...sparkle(1, -3, 19), ...sparkle(-25, 7, 9), ...sparkle(27, 6, 10)],
  },
};

export function getSeasonalHeaderColor(shape: PageHeaderShape, scheme: 'light' | 'dark') {
  return seasonalDetails[shape]?.colors[scheme];
}

function rainDetails(time: number): VectorCommand[] {
  'worklet';
  const paths: VectorCommand[] = [];
  for (let index = 0; index < 12; index++) {
    const duration = 1.5 + (index % 3) * 0.5;
    const progress = (time / duration + index * 0.381966) % 1;
    const visible = Math.sin(progress * Math.PI);
    const x = 468 + index * 45 - progress * 13;
    const y = 8 + progress * 76;
    const width = 2.8 * visible;
    const length = (10 + (index % 4) * 3) * visible;
    paths.push(
      ['M', x + 3 * visible, y - length],
      ['C', x + width, y - 3 * visible, x + width, y + 2 * visible, x, y + 3 * visible],
      ['C', x - width, y + 3 * visible, x - width, y, x + 3 * visible, y - length],
      ['Z'],
    );
    const ripple = Math.max(0, (progress - 0.72) / 0.28);
    const radius = ripple * 17;
    const thickness = Math.sin(ripple * Math.PI) * 1.4;
    paths.push(
      ['M', x - radius, 86],
      ['C', x - radius, 86 - thickness, x + radius, 86 - thickness, x + radius, 86],
      ['C', x + radius, 86 + thickness, x - radius, 86 + thickness, x - radius, 86],
      ['Z'],
    );
  }
  return paths;
}

export function drawHeaderDetails(
  builder: SkPathBuilder,
  shape: PageHeaderShape,
  time: number,
  scaleX: number,
  scaleY: number,
) {
  'worklet';
  if (shape === 'rain') {
    drawVectorPath(builder, rainDetails(time));
    return;
  }

  const detail = seasonalDetails[shape];
  const widthScale = Math.abs(scaleX);
  if (!detail || widthScale === 0) return;

  // Preserve proportions and cap the width of the motif on narrow headers.
  const horizontalScale = Math.min(3, scaleY / widthScale);
  const verticalScale = (horizontalScale * widthScale) / scaleY;
  const centerY = 70 + 3 * Math.sin((time * Math.PI) / 3);
  drawVectorPath(builder, detail.commands);
  builder.transform([horizontalScale, 0, 835, 0, verticalScale, centerY, 0, 0, 1]);
}
