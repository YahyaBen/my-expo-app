import { Capsule, Circle, Rectangle, RoundedRectangle } from '@expo/ui/swift-ui';
import {
  accessibilityHidden,
  accessibilityLabel as nativeLabel,
  foregroundStyle,
  frame,
} from '@expo/ui/swift-ui/modifiers';
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
    testID,
    modifiers: [
      foregroundStyle(color ?? colors.tint),
      frame({ width, height }),
      accessibilityHidden(!accessibilityLabel),
      ...(accessibilityLabel ? [nativeLabel(accessibilityLabel)] : []),
    ],
  };
  if (variant === 'rectangle') return <Rectangle {...props} />;
  if (variant === 'capsule') return <Capsule {...props} cornerStyle="circular" />;
  if (variant === 'roundedRectangle')
    return <RoundedRectangle {...props} cornerRadius={cornerRadius} />;
  return <Circle {...props} />;
}
