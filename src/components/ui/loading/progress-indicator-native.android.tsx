import { CircularProgressIndicator, LinearProgressIndicator } from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  semantics,
  testID as nativeTestID,
} from '@expo/ui/jetpack-compose/modifiers';
import { normalizeProgress } from './progress-value';
import type { ProgressIndicatorProps } from './progress-indicator.types';

export function NativeProgressIndicator({
  variant = 'linear',
  value,
  color,
  testID,
  accessibilityLabel,
}: Readonly<ProgressIndicatorProps>) {
  const Indicator = variant === 'circular' ? CircularProgressIndicator : LinearProgressIndicator;
  return (
    <Indicator
      progress={normalizeProgress(value)}
      color={color}
      modifiers={[
        ...(variant === 'linear' ? [fillMaxWidth()] : []),
        ...(testID ? [nativeTestID(testID)] : []),
        ...(accessibilityLabel ? [semantics({ contentDescription: accessibilityLabel })] : []),
      ]}
    />
  );
}
