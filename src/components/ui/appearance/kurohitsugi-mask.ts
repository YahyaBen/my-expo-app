import { Skia, type SkPath, type SkPathBuilder } from '@shopify/react-native-skia';

type Point = readonly [number, number];
type Monolith = {
  path: SkPath;
  x: number;
  delay: number;
  initialY: number;
  finalY: number;
};

// Each crown is drawn separately: broad broken caps, deep shoulders and thin offshoots.
const profiles: readonly { end: number; delay: number; crown: readonly Point[] }[] = [
  {
    end: 0.115,
    delay: 0.17,
    crown: [
      [0.04, 1.4],
      [0.11, 1.1],
      [0.12, 0.51],
      [0.22, 0.54],
      [0.24, 0.27],
      [0.7, 0.21],
      [0.72, 0.3],
      [0.85, 0.24],
      [0.9, 0.92],
      [0.97, 1.3],
    ],
  },
  {
    end: 0.295,
    delay: 0.045,
    crown: [
      [0.04, 1.2],
      [0.09, 0.75],
      [0.16, 0.79],
      [0.19, 0.16],
      [0.41, 0.18],
      [0.43, 0.07],
      [0.76, 0.1],
      [0.77, 0.42],
      [0.87, 0.39],
      [0.94, 1.3],
    ],
  },
  {
    end: 0.435,
    delay: 0.105,
    crown: [
      [0.03, 1.3],
      [0.1, 0.58],
      [0.17, 0.62],
      [0.17, 0.33],
      [0.32, 0.35],
      [0.35, 0.11],
      [0.69, 0.14],
      [0.7, 0.24],
      [0.84, 0.19],
      [0.91, 0.85],
      [0.98, 1.4],
    ],
  },
  {
    end: 0.605,
    delay: 0,
    crown: [
      [0.03, 1.5],
      [0.1, 0.42],
      [0.18, 0.47],
      [0.19, 0.06],
      [0.26, 0.09],
      [0.27, 0],
      [0.71, 0.04],
      [0.73, 0.18],
      [0.82, 0.12],
      [0.88, 0.78],
      [0.97, 1.25],
    ],
  },
  {
    end: 0.75,
    delay: 0.065,
    crown: [
      [0.03, 1.3],
      [0.12, 0.76],
      [0.17, 0.81],
      [0.18, 0.16],
      [0.29, 0.19],
      [0.31, 0.09],
      [0.75, 0.14],
      [0.8, 0.39],
      [0.87, 0.36],
      [0.96, 1.4],
    ],
  },
  {
    end: 0.885,
    delay: 0.13,
    crown: [
      [0.04, 1.3],
      [0.11, 0.88],
      [0.16, 0.92],
      [0.2, 0.32],
      [0.44, 0.28],
      [0.46, 0.1],
      [0.64, 0.12],
      [0.65, 0.37],
      [0.8, 0.32],
      [0.94, 1.2],
    ],
  },
  {
    end: 1,
    delay: 0.19,
    crown: [
      [0.03, 1.4],
      [0.12, 0.83],
      [0.17, 0.88],
      [0.18, 0.23],
      [0.53, 0.19],
      [0.55, 0.29],
      [0.76, 0.24],
      [0.79, 0.56],
      [0.9, 0.49],
      [0.98, 1.4],
    ],
  },
];

/** One-shot, seeded artwork generation. No random geometry is rebuilt during animation. */
export function createKurohitsugiMask(width: number, height: number): Monolith[] {
  let start = 0;
  return profiles.map(({ end, delay, crown }, column) => {
    let seed = 719 + column * 7919;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const x = start * width;
    const breadth = (end - start) * width;
    const cap = Math.min(58, height * 0.085) * (0.75 + random() * 0.4);
    const textureDepth = height * (0.44 + random() * 0.1);
    const finalY = -(textureDepth + cap + 8);
    const bottom = height - finalY + 4;
    const builder = Skia.PathBuilder.Make();

    builder.moveTo(-1, bottom).lineTo(-1, cap + textureDepth);
    for (let edge = 0; edge <= 32; edge += 1) {
      const t = edge / 32;
      builder.lineTo(
        -1 + t * breadth * (0.015 + random() ** 2 * 0.1),
        cap + textureDepth * (1 - t),
      );
    }
    let previous = crown[0];
    builder.lineTo(previous[0] * breadth, previous[1] * cap);
    for (let point = 1; point < crown.length; point += 1) {
      const next = crown[point];
      const steps = Math.max(
        1,
        Math.ceil(
          Math.hypot((next[0] - previous[0]) * breadth, (next[1] - previous[1]) * cap) / 2.5,
        ),
      );
      for (let step = 1; step <= steps; step += 1) {
        const t = step / steps;
        const rough = step === steps ? 0 : (random() - 0.4) * (random() > 0.85 ? 5 : 1.8);
        builder.lineTo(
          (previous[0] + (next[0] - previous[0]) * t) * breadth,
          (previous[1] + (next[1] - previous[1]) * t) * cap + rough,
        );
      }
      previous = next;
    }
    for (let edge = 0; edge <= 32; edge += 1) {
      const t = edge / 32;
      builder.lineTo(
        breadth + 1 - (1 - t) * breadth * (0.015 + random() ** 2 * 0.11),
        cap + textureDepth * t,
      );
    }
    builder.lineTo(breadth + 1, bottom).close();

    // Broken bristles reach above the cap and down its edges, with irregular tapered widths.
    for (let bristle = 0; bristle < 8; bristle += 1) {
      const edge = bristle % 2 ? 0.83 + random() * 0.15 : 0.02 + random() * 0.14;
      const length = height * (0.055 + random() * 0.2);
      appendBrush(
        builder,
        breadth * edge,
        -length * (0.35 + random() * 0.5),
        0.5 + random() * 2.1,
        length,
        random,
        false,
      );
    }

    // Counter-wound tears leave long, uneven slits of the old theme inside the new theme.
    for (let tear = 0; tear < 7; tear += 1) {
      const top = cap * 1.6 + random() * textureDepth * 0.36;
      const length = Math.min(18 + random() * textureDepth * 0.65, cap + textureDepth - top - 6);
      appendBrush(
        builder,
        breadth * (0.2 + random() * 0.6),
        top,
        0.5 + random() ** 2 * breadth * 0.065,
        length,
        random,
        true,
      );
    }

    // Dry-ink pinholes are deliberately uneven in size and density.
    for (let grain = 0; grain < 96; grain += 1) {
      const onCrown = grain < 18;
      const gx = breadth * (onCrown ? 0.32 + random() * 0.32 : 0.18 + random() * 0.64);
      const gy = onCrown
        ? cap * (0.65 + random() * 0.9)
        : cap * 1.65 + random() * (textureDepth - cap * 0.65 - 4);
      const radius = 0.25 + random() ** 2.6 * (onCrown ? 0.8 : 1.8);
      builder.addCircle(gx, gy, radius, true);
      if (grain % 5 === 0) {
        builder.addRect(
          {
            x: gx + radius * 1.8,
            y: gy - radius * 2,
            width: 0.5 + random(),
            height: 2 + random() * 5,
          },
          true,
        );
      }
    }

    // Detached spray has angular chips and clustered fine droplets rather than a regular grid.
    for (let fleck = 0; fleck < 22; fleck += 1) {
      const fx = breadth * (-0.08 + random() * 1.16);
      const fy = -4 - random() ** 1.6 * height * 0.23;
      const radius = 0.4 + random() ** 2.5 * 3.3;
      builder.moveTo(fx + radius, fy);
      for (let corner = 1; corner < 6; corner += 1) {
        const angle = (corner / 6) * Math.PI * 2;
        const jag = radius * (0.55 + random() * 0.6);
        builder.lineTo(fx + Math.cos(angle) * jag, fy + Math.sin(angle) * jag * 1.3);
      }
      builder.close();
    }

    const path = builder.build();
    builder.dispose();
    const initialY = height - path.getBounds().y + 2;
    start = end;
    return { path, x, delay, initialY, finalY };
  });
}

function appendBrush(
  builder: SkPathBuilder,
  x: number,
  y: number,
  width: number,
  length: number,
  random: () => number,
  cutout: boolean,
) {
  const left: Point[] = [];
  const right: Point[] = [];
  for (let step = 1; step < 10; step += 1) {
    const t = step / 10;
    const spread = Math.sin(Math.PI * t) ** 0.6 * width;
    const drift = (random() - 0.5) * width * 0.5;
    left.push([x + drift - spread * (0.3 + random() * 0.7), y + t * length]);
    right.push([x + drift + spread * (0.3 + random() * 0.7), y + t * length]);
  }
  builder.moveTo(x, y);
  const first = cutout ? left : right;
  const second = cutout ? right : left;
  for (const [px, py] of first) builder.lineTo(px, py);
  builder.lineTo(x, y + length);
  for (let point = second.length - 1; point >= 0; point -= 1) {
    builder.lineTo(second[point][0], second[point][1]);
  }
  builder.close();
}

/** Only seven translations run each frame; the detailed artwork is already constructed. */
export function appendKurohitsugiMask(
  builder: SkPathBuilder,
  monoliths: Monolith[],
  progress: number,
) {
  'worklet';
  for (const monolith of monoliths) {
    const local = Math.max(0, Math.min(1, (progress - monolith.delay) / (1 - monolith.delay)));
    const eased =
      local < 0.18 ? 0.035 * (local / 0.18) ** 2 : 1 - 0.965 * ((1 - local) / 0.82) ** 2;
    const y = monolith.initialY + (monolith.finalY - monolith.initialY) * eased;
    builder.addPath(monolith.path, Skia.Matrix().translate(monolith.x, y));
  }
}
