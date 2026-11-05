import { Shape, Surface } from '@expo/ui/jetpack-compose';
import type { NativeBadgeSurfaceProps } from './native-badge-surface';

export function NativeBadgeSurface({
  children,
  backgroundColor,
  borderColor,
}: Readonly<NativeBadgeSurfaceProps>) {
  return (
    <Surface
      color={backgroundColor}
      shape={Shape.Pill({})}
      border={borderColor ? { color: borderColor, width: 1 } : undefined}
    >
      {children}
    </Surface>
  );
}
