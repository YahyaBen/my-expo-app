import { Skia, type SkPath, type SkPathBuilder } from '@shopify/react-native-skia';

type AuraRibbon = { path: SkPath; x: number; delay: number; initialY: number; finalY: number };
type PressureWave = { path: SkPath; delay: number; initialY: number; finalY: number };
type DangaiMask = {
  width: number;
  height: number;
  ribbons: AuraRibbon[];
  waves: PressureWave[];
  fragments: SkPath;
  edge: number[];
};
type Point = readonly [number, number];

/** Fluid, torn reiatsu ribbons: only the selected aura's static artwork is constructed. */
export function createDangaiMask(width: number, height: number): DangaiMask {
  let seed = 41983;
  const random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const ribbons: AuraRibbon[] = [];
  const depth = height * 0.62;
  for (let strand = 0; strand < 11; strand += 1) {
    const x = ((strand + 0.5) / 11) * width;
    const breadth = width * (0.043 + random() * 0.035);
    const direction = strand < 5 ? -1 : 1;
    const phase = random() * Math.PI * 2;
    const profile = (t: number) => ({
      center: direction * breadth * (2.2 * (1 - t) ** 2 + Math.sin(t * 8 + phase) * (1 - t) * 0.7),
      radius:
        breadth *
        (0.025 + Math.sin((Math.PI / 2) * t) ** 0.65) *
        (0.78 + Math.sin(t * 13 + phase) * 0.18),
    });
    const left: Point[] = [];
    const right: Point[] = [];
    for (let sample = 0; sample <= 48; sample += 1) {
      const t = sample / 48;
      const { center, radius } = profile(t);
      left.push([center - radius * (0.86 + random() * 0.22), t * depth]);
      right.push([center + radius * (0.86 + random() * 0.22), t * depth]);
    }
    const builder = Skia.PathBuilder.Make();
    const bottom = height + depth + 12;
    const baseRadius = profile(1).radius;
    for (let sample = 1; sample <= 28; sample += 1) {
      const t = sample / 28;
      const y = depth + (bottom - depth) * t;
      const center = (Math.sin(t * 7 + phase) - Math.sin(phase)) * breadth * 0.24;
      const radius = baseRadius * (0.92 + Math.cos(t * 8) * 0.08);
      left.push([center - radius * (0.9 + random() * 0.1), y]);
      right.push([center + radius * (0.9 + random() * 0.1), y]);
    }
    builder.moveTo(left[left.length - 1][0], bottom);
    for (let point = left.length - 1; point >= 0; point -= 1)
      builder.lineTo(left[point][0], left[point][1]);
    for (const [px, py] of right) builder.lineTo(px, py);
    builder.lineTo(right[right.length - 1][0], bottom).close();

    // Thin old-theme tears follow the same curved flow as each aura strand.
    for (let tear = 0; tear < 3; tear += 1) {
      const start = 0.18 + random() * 0.3;
      const length = 0.15 + random() * 0.26;
      const offset = (tear - 1) * 0.28;
      for (let sample = 0; sample <= 12; sample += 1) {
        const t = start + (sample / 12) * length;
        const { center, radius } = profile(t);
        const half = Math.sin((sample / 12) * Math.PI) * radius * 0.055;
        const px = center + radius * offset - half;
        if (sample === 0) builder.moveTo(px, t * depth);
        else builder.lineTo(px, t * depth);
      }
      for (let sample = 12; sample >= 0; sample -= 1) {
        const t = start + (sample / 12) * length;
        const { center, radius } = profile(t);
        const half = Math.sin((sample / 12) * Math.PI) * radius * 0.055;
        builder.lineTo(center + radius * offset + half, t * depth);
      }
      builder.close();
    }
    for (let grain = 0; grain < 24; grain += 1) {
      const t = 0.2 + random() * 0.7;
      const { center, radius } = profile(t);
      builder.addCircle(
        center + (random() - 0.5) * radius,
        t * depth,
        Math.min(radius * 0.12, 0.25 + random() * 1.1),
        true,
      );
    }
    const path = builder.build();
    builder.dispose();
    ribbons.push({
      path,
      x,
      delay: Math.abs(strand - 5) * 0.014 + random() * 0.04,
      initialY: height + 4,
      finalY: -depth - 8,
    });
  }

  const waves: PressureWave[] = [];
  for (let wave = 0; wave < 3; wave += 1) {
    const rx = width * (0.7 + wave * 0.08);
    const ry = height * (0.1 + wave * 0.025);
    const thickness = 2.4 + wave * 1.1;
    const builder = Skia.PathBuilder.Make();
    const innerX = Math.max(0, rx - thickness);
    const innerY = Math.max(0, ry - thickness);
    builder
      .moveTo(-rx, 0)
      .cubicTo(-rx, -ry * 0.5523, -rx * 0.5523, -ry, 0, -ry)
      .cubicTo(rx * 0.5523, -ry, rx, -ry * 0.5523, rx, 0)
      .lineTo(innerX, 0)
      .cubicTo(innerX, -innerY * 0.5523, innerX * 0.5523, -innerY, 0, -innerY)
      .cubicTo(-innerX * 0.5523, -innerY, -innerX, -innerY * 0.5523, -innerX, 0)
      .close();
    waves.push({
      path: builder.build(),
      delay: 0.04 + wave * 0.15,
      initialY: height + ry + 4,
      finalY: -ry - 4,
    });
    builder.dispose();
  }

  const builder = Skia.PathBuilder.Make();
  for (let fleck = 0; fleck < 72; fleck += 1) {
    const x = random() * width;
    const y = random() * height * 0.7;
    const size = 0.6 + random() ** 2 * 3;
    const length = size * (1.3 + random() * 4);
    builder
      .moveTo(x, y)
      .lineTo(x + size, y + length * 0.3)
      .lineTo(x + size * 0.4, y + length)
      .lineTo(x - size * 0.7, y + length * 0.6)
      .close();
  }
  const fragments = builder.build();
  builder.dispose();
  const edge = Array.from(
    { length: 65 },
    (_, index) =>
      height * (0.02 + 0.09 * (0.5 + 0.5 * Math.sin(index * 1.73 + random() * 0.8)) ** 4),
  );
  return { width, height, ribbons, waves, fragments, edge };
}

/** A rising pressure release, with stationary theme content behind the animated stencil. */
export function appendDangaiMask(builder: SkPathBuilder, mask: DangaiMask, progress: number) {
  'worklet';
  for (const ribbon of mask.ribbons) {
    const local = Math.max(0, Math.min(1, (progress - ribbon.delay) / (1 - ribbon.delay)));
    const surge =
      local < 0.16 ? 0.025 * (local / 0.16) ** 2 : 1 - 0.975 * ((1 - local) / 0.84) ** 2;
    const y = ribbon.initialY + (ribbon.finalY - ribbon.initialY) * surge;
    builder.addPath(ribbon.path, Skia.Matrix().translate(ribbon.x, y));
  }
  for (const wave of mask.waves) {
    const local = Math.max(0, Math.min(1, (progress - wave.delay) / 0.62));
    const eased = local * local * (3 - 2 * local);
    builder.addPath(
      wave.path,
      Skia.Matrix().translate(
        mask.width / 2,
        wave.initialY + (wave.finalY - wave.initialY) * eased,
      ),
    );
  }
  const debrisY = mask.height + 2 - (mask.height * 1.75 + 24) * progress;
  builder.addPath(mask.fragments, Skia.Matrix().translate(0, debrisY));

  const sweep = Math.max(0, Math.min(1, (progress - 0.45) / 0.55));
  if (sweep <= 0) return;
  const eased = sweep * sweep * (3 - 2 * sweep);
  const margin = mask.height * 0.14;
  const front = mask.height + margin + 2 - (mask.height + margin * 2 + 4) * eased;
  builder.moveTo(-2, mask.height + 2).lineTo(-2, front + mask.edge[0]);
  for (let point = 1; point < mask.edge.length; point += 1) {
    const previousX = ((point - 1) / (mask.edge.length - 1)) * mask.width;
    const x = (point / (mask.edge.length - 1)) * mask.width;
    builder.quadTo(
      previousX,
      front + mask.edge[point - 1],
      (previousX + x) / 2,
      front + (mask.edge[point - 1] + mask.edge[point]) / 2,
    );
  }
  builder
    .lineTo(mask.width + 2, front + mask.edge[mask.edge.length - 1])
    .lineTo(mask.width + 2, mask.height + 2)
    .close();
}
