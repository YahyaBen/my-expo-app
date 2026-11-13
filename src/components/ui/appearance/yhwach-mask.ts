import { Skia, type SkPath, type SkPathBuilder } from '@shopify/react-native-skia';

type AlmightyEye = {
  path: SkPath;
  x: number;
  y: number;
  angle: number;
  delay: number;
};
type YhwachMask = {
  width: number;
  height: number;
  eyes: AlmightyEye[];
  branches: SkPath[];
  edge: number[];
};

// An irregular fan of eyes, composed from the reference rather than a repeating grid.
const eyeField: readonly (readonly [number, number, number, number])[] = [
  [0.04, 0.035, 0.25, 1.08],
  [0.3, 0.075, 0.34, 1.14],
  [0.63, 0.04, 0.3, -1.18],
  [0.96, 0.08, 0.25, -1.04],
  [0.14, 0.24, 0.2, 1.09],
  [0.43, 0.27, 0.38, 0.98],
  [0.78, 0.2, 0.24, -0.85],
  [1.01, 0.3, 0.2, -1.13],
  [0.01, 0.43, 0.23, 1.12],
  [0.25, 0.46, 0.24, 0.91],
  [0.65, 0.4, 0.35, -1.02],
  [0.89, 0.45, 0.2, -0.72],
  [0.08, 0.63, 0.23, 1.03],
  [0.4, 0.6, 0.25, 1.16],
  [0.73, 0.59, 0.27, -0.87],
  [1, 0.66, 0.29, -1.14],
  [0.22, 0.8, 0.29, 0.92],
  [0.55, 0.77, 0.36, -1.18],
  [0.86, 0.8, 0.24, -0.63],
  [0.02, 0.97, 0.27, 0.83],
  [0.36, 0.96, 0.2, 1.23],
  [0.71, 0.96, 0.25, -1.12],
  [1.01, 0.97, 0.24, -0.91],
];

/** The reference's many eyes become windows between the two actual app appearances. */
export function createYhwachMask(width: number, height: number): YhwachMask {
  let seed = 90871;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const landscape = width > height;
  const unit = Math.min(width, height);
  const eyes: AlmightyEye[] = [];
  for (const [px, py, size, tilt] of eyeField) {
    const x = (landscape ? py : px) * width;
    const y = (landscape ? 1 - px : py) * height;
    const breadth = unit * size;
    const halfWidth = breadth / 2;
    const halfHeight = breadth * (0.3 + random() * 0.018);
    const irisX = -breadth * 0.035;
    const builder = Skia.PathBuilder.Make();
    // A sharp, uneven outer rim surrounds the pale sclera visible in the reference.
    builder
      .moveTo(-halfWidth, 0)
      .cubicTo(
        -halfWidth * 0.45,
        -halfHeight * 1.2,
        halfWidth * 0.36,
        -halfHeight * 0.9,
        halfWidth,
        0,
      )
      .cubicTo(
        halfWidth * 0.35,
        halfHeight * 1.05,
        -halfWidth * 0.23,
        halfHeight * 0.88,
        -halfWidth,
        0,
      )
      .close();
    const innerWidth = halfWidth * 0.91;
    const innerHeight = halfHeight * 0.8;
    builder
      .moveTo(-innerWidth, 0)
      .cubicTo(
        -innerWidth * 0.23,
        innerHeight * 0.88,
        innerWidth * 0.35,
        innerHeight * 1.05,
        innerWidth,
        0,
      )
      .cubicTo(
        innerWidth * 0.36,
        -innerHeight * 0.9,
        -innerWidth * 0.45,
        -innerHeight * 1.2,
        -innerWidth,
        0,
      )
      .close();

    // Smooth, nested oval irises and an oval pupil follow the eye's long axis.
    // Alternating winding represents the reference's layered colors using only the two themes.
    builder.addOval({
      x: irisX - breadth * 0.25,
      y: -breadth * 0.145,
      width: breadth * 0.5,
      height: breadth * 0.29,
    });
    builder.addOval(
      {
        x: irisX - breadth * 0.23,
        y: -breadth * 0.13,
        width: breadth * 0.46,
        height: breadth * 0.26,
      },
      true,
    );
    builder.addOval({
      x: irisX - breadth * 0.215,
      y: -breadth * 0.118,
      width: breadth * 0.43,
      height: breadth * 0.236,
    });
    builder.addOval(
      {
        x: irisX - breadth * 0.16,
        y: -breadth * 0.085,
        width: breadth * 0.32,
        height: breadth * 0.17,
      },
      true,
    );
    builder.addOval({
      x: irisX - breadth * 0.061,
      y: -breadth * 0.038,
      width: breadth * 0.122,
      height: breadth * 0.076,
    });
    builder.addCircle(irisX + breadth * 0.14, breadth * 0.065, breadth * 0.008, true);
    builder.addCircle(irisX + breadth * 0.18, breadth * 0.02, breadth * 0.006, true);
    const path = builder.build();
    builder.dispose();
    eyes.push({
      path,
      x,
      y,
      angle: tilt - (landscape ? Math.PI / 2 : 0),
      delay: Math.max(0, 1 - y / height) * 0.16 + random() * 0.04,
    });
  }

  const branches: SkPath[] = [];
  for (let branch = 0; branch < 9; branch += 1) {
    const root = (branch / 8) * width;
    const tip = (branch / 8) * width;
    const weight = width * (0.035 + random() * 0.035);
    const bend = (random() - 0.5) * width * 0.34;
    const builder = Skia.PathBuilder.Make();
    builder
      .moveTo(root - weight, height + 4)
      .cubicTo(
        root + bend - weight,
        height * 0.57,
        tip + bend - weight * 0.35,
        height * 0.24,
        tip,
        -height * 0.12,
      )
      .cubicTo(
        tip + bend + weight * 0.35,
        height * 0.28,
        root + bend + weight,
        height * 0.55,
        root + weight,
        height + 4,
      )
      .close();
    branches.push(builder.build());
    builder.dispose();
  }
  const edge = Array.from({ length: 49 }, () => height * (0.01 + random() * 0.055));
  return { width, height, eyes, branches, edge };
}

/** Eye apertures open first; branching shadows and a final upward sweep merge them. */
export function appendYhwachMask(builder: SkPathBuilder, mask: YhwachMask, progress: number) {
  'worklet';
  for (const eye of mask.eyes) {
    const local = Math.max(0, Math.min(1, (progress - eye.delay) / 0.32));
    if (local <= 0) continue;
    const openness = local * local * (3 - 2 * local);
    builder.addPath(
      eye.path,
      Skia.Matrix().translate(eye.x, eye.y).rotate(eye.angle).scale(1, openness),
    );
  }

  const growth = Math.max(0, Math.min(1, (progress - 0.36) / 0.45));
  if (growth > 0) {
    const eased = growth * growth * (3 - 2 * growth);
    const matrix = Skia.Matrix()
      .translate(0, mask.height)
      .scale(1, eased)
      .translate(0, -mask.height);
    for (const branch of mask.branches) builder.addPath(branch, matrix);
  }

  const sweep = Math.max(0, Math.min(1, (progress - 0.62) / 0.38));
  if (sweep <= 0) return;
  const eased = sweep * sweep * (3 - 2 * sweep);
  const margin = mask.height * 0.08;
  const y = mask.height + margin + 2 - (mask.height + margin * 2 + 4) * eased;
  builder.moveTo(-2, mask.height + 2).lineTo(-2, y + mask.edge[0]);
  for (let point = 0; point < mask.edge.length; point += 1) {
    builder.lineTo((point / (mask.edge.length - 1)) * mask.width, y + mask.edge[point]);
  }
  builder
    .lineTo(mask.width + 2, y + mask.edge[mask.edge.length - 1])
    .lineTo(mask.width + 2, mask.height + 2)
    .close();
}
