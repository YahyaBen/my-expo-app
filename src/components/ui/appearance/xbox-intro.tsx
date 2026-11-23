import { Fill, Group, Image, Path, Skia, usePathValue, type SkImage } from 'react-native-skia';
import { useDerivedValue, type SharedValue } from 'react-native-reanimated';
import { appendXboxEntrance, getXboxFrame, type createXboxArtwork } from './xbox-artwork';

/** Canvas content only; the existing reveal owns capture, timing and cancellation. */
export function XboxIntro({
  artwork,
  progress,
  image,
  width,
  height,
  background,
  foreground,
}: Readonly<{
  artwork: ReturnType<typeof createXboxArtwork>;
  progress: SharedValue<number>;
  image: SharedValue<SkImage | null>;
  width: number;
  height: number;
  background: string;
  foreground: string;
}>) {
  const { radius, maxRadius, centerX, centerY } = artwork;
  const frame = useDerivedValue(() => getXboxFrame(progress.get(), radius, maxRadius));
  const cover = useDerivedValue(() => frame.get().cover);
  const solid = useDerivedValue(() => frame.get().solid);
  const matrix = useDerivedValue(() =>
    Skia.Matrix()
      .translate(centerX, centerY)
      .scale(frame.get().scale)
      .translate(0, -frame.get().entryY),
  );
  const entrance = usePathValue((builder) => {
    'worklet';
    appendXboxEntrance(builder, artwork, progress.get());
  });

  return (
    <Group clip={entrance} invertClip>
      <Image image={image} x={0} y={0} width={width} height={height} fit="fill" />
      <Group opacity={cover}>
        <Fill color={background} />
        <Group matrix={matrix}>
          <Path path={artwork.solid} opacity={solid} color={foreground} />
        </Group>
      </Group>
    </Group>
  );
}
