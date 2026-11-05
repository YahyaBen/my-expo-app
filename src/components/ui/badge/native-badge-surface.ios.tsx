import { HStack } from '@expo/ui/swift-ui';
import { background, shapes, strokeBorder } from '@expo/ui/swift-ui/modifiers';
import type { NativeBadgeSurfaceProps } from './native-badge-surface';

export function NativeBadgeSurface({
  children,
  backgroundColor,
  borderColor,
}: Readonly<NativeBadgeSurfaceProps>) {
  return (
    <HStack
      spacing={0}
      modifiers={[
        background(backgroundColor, shapes.capsule()),
        ...(borderColor
          ? [strokeBorder({ content: borderColor, shape: 'capsule', style: { lineWidth: 1 } })]
          : []),
      ]}
    >
      {children}
    </HStack>
  );
}
