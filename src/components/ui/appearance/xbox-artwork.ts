import { Skia, type SkPathBuilder } from 'react-native-skia';

// Solid 24-unit SVG Repo logo supplied by the user; each source path keeps its own origin.
const solidData = [
  'm24 12c0-.001 0-.001 0-.002 0-3.618-1.606-6.861-4.144-9.054l-.015-.013c-1.91 1.023-3.548 2.261-4.967 3.713l-.004.004c.044.046.087.085.131.132 3.719 4.012 7.106 9.73 6.546 12.471 1.53-1.985 2.452-4.508 2.452-7.246 0-.002 0-.004 0-.006z',
  'm12.591 3.955c1.68-1.104 3.699-1.833 5.872-2.022l.048-.003c-1.837-1.21-4.09-1.929-6.511-1.929-2.171 0-4.207.579-5.962 1.591l.058-.031c.658.567 2.837.781 5.484 2.4.143.089.316.142.502.142.189 0 .365-.055.513-.149l-.004.002z',
  'm9.166 6.778c.046-.049.093-.09.138-.138-1.17-1.134-2.446-2.174-3.806-3.1l-.099-.064c-.302-.221-.681-.354-1.091-.354-.146 0-.288.017-.425.049l.013-.002c-2.398 2.198-3.896 5.344-3.896 8.84 0 2.909 1.037 5.576 2.762 7.651l-.016-.02c-1.031-2.547 2.477-8.672 6.419-12.862z',
  'm12.084 9.198c-3.962 3.503-9.477 8.73-8.632 11.218 2.174 2.213 5.198 3.584 8.542 3.584 3.493 0 6.637-1.496 8.826-3.883l.008-.009c.486-2.618-4.755-7.337-8.744-10.91z',
];

/** Parse the supplied solid logo only when this intro mounts. */
export function createXboxArtwork(width: number, height: number) {
  const radius = Math.min(width, height) * 0.16;
  const centerX = width / 2;
  const centerY = height / 2;
  const builder = Skia.PathBuilder.Make();
  for (const segment of solidData) {
    const source = Skia.Path.MakeFromSVGString(segment);
    if (!source) throw new Error('Invalid Xbox logo path.');
    builder.addPath(
      source,
      Skia.Matrix()
        .translate(-radius, -radius)
        .scale(radius / 12),
    );
    source.dispose();
  }
  const solid = builder.build();
  builder.dispose();
  return {
    solid,
    radius,
    centerX,
    centerY,
    maxRadius: Math.hypot(centerX, Math.max(centerY, height - centerY)) + 2,
  };
}

function smooth(value: number) {
  'worklet';
  const clamped = Math.max(0, Math.min(1, value));
  return clamped * clamped * (3 - 2 * clamped);
}

/** Flat Series X-style fade and hold, followed by a push through the actual SVG mask. */
export function getXboxFrame(progress: number, radius: number, maxRadius: number) {
  'worklet';
  const arrival = smooth((progress - 0.12) / 0.33);
  const push = Math.max(0, Math.min(1, (progress - 0.74) / 0.26)) ** 3;
  // Enter the broad lower lobe, whose central core contains the entire final viewport.
  const completionScale = (maxRadius / (radius * 0.18)) * 1.08;
  const scale = (0.86 + arrival * 0.14) * (1 + (completionScale - 1) * push);
  return {
    cover: smooth(progress / 0.12),
    scale,
    solid: arrival,
    entryY: radius * 0.35 * push,
    masked: progress >= 0.74,
  };
}

/** The supplied filled SVG, rather than a circle, cuts through the monochrome stage. */
export function appendXboxEntrance(
  builder: SkPathBuilder,
  artwork: ReturnType<typeof createXboxArtwork>,
  progress: number,
) {
  'worklet';
  const frame = getXboxFrame(progress, artwork.radius, artwork.maxRadius);
  // Turn the visible logo into the opening without growing a second logo inside it.
  if (!frame.masked) return;
  builder.addPath(
    artwork.solid,
    Skia.Matrix()
      .translate(artwork.centerX, artwork.centerY)
      .scale(frame.scale)
      .translate(0, -frame.entryY),
  );
}
