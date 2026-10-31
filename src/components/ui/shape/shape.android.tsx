import { Shape as MaterialShape } from '@expo/ui/jetpack-compose';
import { semantics, size, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import type { ShapeProps } from './shape.types';

export type { ShapeProps } from './shape.types';

export function Shape({
  variant = 'circle',
  width = 64,
  height = 64,
  cornerRadius = 12,
  color,
  testID,
  accessibilityLabel,
}: Readonly<ShapeProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const props = {
    color: color ?? colors.tint,
    modifiers: [
      size(width, height),
      ...(testID ? [nativeTestID(testID)] : []),
      ...(accessibilityLabel ? [semantics({ contentDescription: accessibilityLabel })] : []),
    ],
  };
  if (variant === 'rectangle') return <MaterialShape.Rectangle {...props} />;
  if (variant === 'capsule') return <MaterialShape.Pill {...props} />;
  if (variant === 'roundedRectangle') {
    return (
      <MaterialShape.RoundedCorner
        {...props}
        cornerRadii={{
          topStart: cornerRadius,
          topEnd: cornerRadius,
          bottomStart: cornerRadius,
          bottomEnd: cornerRadius,
        }}
      />
    );
  }
  // The upstream native radius defaults to zero. Explicitly request a full circle.
  return <MaterialShape.Circle {...props} radius={1} />;
}
