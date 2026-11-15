import { PathOp, Skia, type SkPath, type SkPathBuilder } from '@shopify/react-native-skia';

type Point = readonly [number, number];
type GargantaMask = {
  path: SkPath;
  entrance: SkPath;
  centerX: number;
  centerY: number;
  completionZoom: number;
};

// Broad, unequal breaks around a horizontal seam, traced from the manga reference.
const upperEdge: readonly Point[] = [
  [-1, 0],
  [-0.94, -0.025],
  [-0.86, -0.045],
  [-0.85, -0.12],
  [-0.79, -0.14],
  [-0.785, -0.59],
  [-0.61, -0.58],
  [-0.605, -0.31],
  [-0.4, -0.29],
  [-0.395, -0.57],
  [-0.2, -0.56],
  [-0.195, -0.92],
  [0.035, -0.91],
  [0.04, -0.36],
  [0.265, -0.36],
  [0.27, -1.15],
  [0.49, -1.14],
  [0.495, -0.5],
  [0.7, -0.49],
  [0.705, -0.12],
  [0.85, -0.08],
  [0.91, -0.1],
  [0.94, -0.015],
  [1, 0.025],
];
const lowerEdge: readonly Point[] = [
  [1, 0.025],
  [0.94, 0.07],
  [0.85, 0.075],
  [0.77, 0.13],
  [0.765, 0.98],
  [0.575, 0.94],
  [0.57, 0.61],
  [0.51, 0.56],
  [0.505, 0.71],
  [0.295, 0.67],
  [0.29, 0.35],
  [0.13, 0.35],
  [0.12, 0.63],
  [-0.035, 0.62],
  [-0.04, 0.46],
  [-0.14, 0.48],
  [-0.145, 0.7],
  [-0.34, 0.66],
  [-0.345, 0.53],
  [-0.56, 0.44],
  [-0.565, 0.31],
  [-0.66, 0.25],
  [-0.68, 0.12],
  [-0.82, 0.1],
  [-0.83, 0.07],
  [-0.98, 0.035],
  [-1, 0],
];

function edgeY(edge: readonly Point[], x: number) {
  for (let point = 1; point < edge.length; point += 1) {
    const [x0, y0] = edge[point - 1];
    const [x1, y1] = edge[point];
    if (x >= Math.min(x0, x1) && x <= Math.max(x0, x1)) {
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return 0;
}

// All added ink contours share the body's winding, including strokes that curl back.
function appendContour(builder: SkPathBuilder, points: Point[]) {
  let area = 0;
  for (let point = 0; point < points.length; point += 1) {
    const next = points[(point + 1) % points.length];
    area += points[point][0] * next[1] - next[0] * points[point][1];
  }
  if (area < 0) points.reverse();
  builder.moveTo(points[0][0], points[0][1]);
  for (let point = 1; point < points.length; point += 1) {
    builder.lineTo(points[point][0], points[point][1]);
  }
  builder.close();
}

function appendThread(builder: SkPathBuilder, points: Point[], thickness: number) {
  const left: Point[] = [];
  const right: Point[] = [];
  for (let point = 0; point < points.length; point += 1) {
    const before = points[Math.max(0, point - 1)];
    const after = points[Math.min(points.length - 1, point + 1)];
    const length = Math.hypot(after[0] - before[0], after[1] - before[1]) || 1;
    const taper = Math.sin((Math.PI * (point + 0.15)) / (points.length - 0.7)) ** 0.4;
    const nx = ((after[1] - before[1]) / length) * thickness * taper * 0.5;
    const ny = ((before[0] - after[0]) / length) * thickness * taper * 0.5;
    left.push([points[point][0] - nx, points[point][1] - ny]);
    right.push([points[point][0] + nx, points[point][1] + ny]);
  }
  appendContour(builder, [...left, ...right.reverse()]);
}

/** Seeded ink detail is built only when Garganta is selected, never per frame. */
export function createGargantaMask(width: number, height: number): GargantaMask {
  const halfWidth = Math.min(width * 0.47, height * 0.66);
  const halfHeight = Math.min(height * 0.19, width * 0.29);
  const inkScale = halfWidth / 240;
  let seed = 86071;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const builder = Skia.PathBuilder.Make();
  const silhouette: Point[] = [];
  for (const edge of [upperEdge, lowerEdge]) {
    for (let point = 1; point < edge.length; point += 1) {
      const previous = edge[point - 1];
      const next = edge[point];
      const dx = (next[0] - previous[0]) * halfWidth;
      const dy = (next[1] - previous[1]) * halfHeight;
      const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (inkScale * 1.6)));
      for (let step = 0; step < steps; step += 1) {
        const t = step / steps;
        const rough = step ? inkScale * (random() > 0.94 ? 3.2 : 0.9) : 0;
        silhouette.push([
          previous[0] * halfWidth + dx * t + (random() - 0.5) * rough,
          previous[1] * halfHeight + dy * t + (random() - 0.5) * rough * 2,
        ]);
      }
    }
  }
  appendContour(builder, silhouette);

  // The whole opening is live theme content; retain only a narrow manga-ink rim.
  const body = builder.build();
  const rim = Skia.Path.Stroke(body, { width: inkScale * 5 });
  const entrance = (rim ? Skia.Path.MakeFromOp(body, rim, PathOp.Difference) : null) ?? body.copy();
  rim?.dispose();
  body.dispose();

  // Short, dense pen bristles roughen the shoulders and vertical walls as well as the caps.
  for (let bristle = 0; bristle < 480; bristle += 1) {
    const point = Math.floor(random() * silhouette.length);
    const root = silhouette[point];
    const next = silhouette[(point + 1) % silhouette.length];
    const dx = next[0] - root[0];
    const dy = next[1] - root[1];
    const length = Math.hypot(dx, dy) || 1;
    const nx = dy / length;
    const ny = -dx / length;
    const reach = inkScale * (1 + random() ** 2 * 7);
    const lean = inkScale * (random() - 0.5) * 4;
    appendThread(
      builder,
      [
        [root[0] - nx * inkScale, root[1] - ny * inkScale],
        [root[0] + nx * reach * 0.6 - ny * lean, root[1] + ny * reach * 0.6 + nx * lean],
        [root[0] + nx * reach, root[1] + ny * reach],
      ],
      inkScale * (0.3 + random() * 1.1),
    );
  }

  for (const side of [-1, 1]) {
    const edge = side < 0 ? upperEdge : lowerEdge;

    // Long dry-pen filaments, with a handful of heavier broken vertical strokes.
    for (let line = 0; line < 46; line += 1) {
      const x = -0.94 + random() * 1.88;
      const rootX = x * halfWidth;
      const rootY = edgeY(edge, x) * halfHeight - side * inkScale * 3;
      const length = halfHeight * (0.12 + random() ** 1.5 * 1.8);
      const lean = (random() - 0.5) * inkScale * 5;
      const phase = random() * Math.PI * 2;
      const thickness = inkScale * (line % 11 === 0 ? 1.8 : 0.16 + random() ** 3 * 0.9);
      const points: Point[] = [];
      for (let node = 0; node <= 18; node += 1) {
        const t = node / 18;
        points.push([
          rootX + lean * t + Math.sin(t * 19 + phase) * inkScale * 0.35,
          rootY + side * length * t,
        ]);
      }
      appendThread(builder, points, thickness);
    }

    // Tangled, irregular loops fray every cap rather than outlining a clean polygon.
    for (let thread = 0; thread < 180; thread += 1) {
      const x = -0.97 + random() * 1.94;
      const rootX = x * halfWidth;
      const rootY = edgeY(edge, x) * halfHeight + side * inkScale * (random() - 0.4) * 7;
      const curl = inkScale * (1.5 + random() * 7);
      const reach = inkScale * (3 + random() ** 1.5 * 26);
      const lean = (random() - 0.5) * inkScale * 18;
      const phase = random() * Math.PI * 2;
      const points: Point[] = [];
      for (let node = 0; node <= 16; node += 1) {
        const t = node / 16;
        const arch = Math.sin(Math.PI * t);
        points.push([
          rootX + lean * t + Math.sin(t * 9 + phase) * curl * arch,
          rootY + side * (arch * reach + Math.sin(t * 17 + phase) * curl * arch),
        ]);
      }
      appendThread(builder, points, inkScale * (0.16 + random() * 0.38));
    }

    // Sparse sweeping threads connect the broken sections without a regular halo.
    for (let arc = 0; arc < 9; arc += 1) {
      const x = -0.8 + random() * 1.6;
      const rootY = edgeY(edge, x) * halfHeight;
      const reach = halfHeight * (0.25 + random() * 0.6);
      const lean = halfWidth * (random() - 0.5) * 0.6;
      const points: Point[] = [];
      for (let node = 0; node <= 24; node += 1) {
        const t = node / 24;
        points.push([
          x * halfWidth + lean * t ** 1.7 + Math.sin(t * 13) * inkScale * 0.3,
          rootY + side * reach * Math.sin(t * Math.PI * 0.65),
        ]);
      }
      appendThread(builder, points, inkScale * (0.15 + random() * 0.22));
    }

    // Peripheral flecks and tiny counter-wound pinholes retain the paper-like texture.
    for (let grain = 0; grain < 220; grain += 1) {
      const x = -0.97 + random() * 1.94;
      const y = edgeY(edge, x) * halfHeight;
      const offset = inkScale * (1 + random() ** 2 * 16);
      const radius = inkScale * (0.12 + random() ** 2 * 0.7);
      builder.addCircle(x * halfWidth, y + side * offset, radius);
      const inset = y - side * inkScale * (2 + random() * 8);
      if (Math.abs(inset) > halfHeight * 0.32 && Math.abs(y) > halfHeight * 0.18) {
        builder.addOval(
          {
            x: x * halfWidth,
            y: inset,
            width: inkScale * (0.15 + random() * 0.45),
            height: inkScale * (0.5 + random() * 3),
          },
          true,
        );
      }
    }
  }

  const path = builder.build();
  builder.dispose();
  return {
    path,
    entrance,
    centerX: width / 2,
    centerY: height / 2,
    // Push every viewport corner inside the entrance's clear core before removing the overlay.
    completionZoom: Math.max(width / (halfWidth * 0.4), height / (halfHeight * 0.24)) * 1.06,
  };
}

export function getGargantaPaperOpacity(progress: number) {
  'worklet';
  const cover = Math.max(0, Math.min(1, progress / 0.12));
  return cover * cover * (3 - 2 * cover);
}

export function getGargantaZoom(progress: number) {
  'worklet';
  return Math.max(0, Math.min(1, (progress - 0.72) / 0.28)) ** 2.4;
}

function getGargantaMatrix(mask: GargantaMask, progress: number) {
  'worklet';
  const seam = Math.max(0, Math.min(1, (progress - 0.12) / 0.28));
  const spread = 1 - (1 - seam) ** 3;
  const opening = Math.max(0, Math.min(1, (progress - 0.28) / 0.33));
  const gap = 0.007 + 0.993 * opening * opening * (3 - 2 * opening);
  const zoom = 1 + (mask.completionZoom - 1) * getGargantaZoom(progress);
  return Skia.Matrix()
    .translate(mask.centerX, mask.centerY)
    .scale(spread * zoom, gap * zoom);
}

/** A center seam spreads sideways, the ink rift opens, then the viewer pushes through it. */
export function appendGargantaMask(builder: SkPathBuilder, mask: GargantaMask, progress: number) {
  'worklet';
  if (progress <= 0.12) return;
  builder.addPath(mask.path, getGargantaMatrix(mask, progress));
}

/** Reveal the live destination as the jaws part, then carry it through the final zoom. */
export function appendGargantaEntrance(
  builder: SkPathBuilder,
  mask: GargantaMask,
  progress: number,
) {
  'worklet';
  if (progress <= 0.28) return;
  builder.addPath(mask.entrance, getGargantaMatrix(mask, progress));
}
