import { ProgressView } from '@expo/ui/swift-ui';
import {
  accessibilityLabel as nativeLabel,
  progressViewStyle,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { normalizeProgress } from './progress-value';
import type { ProgressIndicatorProps } from './progress-indicator.types';

export function NativeProgressIndicator({
  variant = 'linear',
  value,
  color,
  testID,
  accessibilityLabel,
}: Readonly<ProgressIndicatorProps>) {
  return (
    <ProgressView
      value={normalizeProgress(value)}
      testID={testID}
      modifiers={[
        progressViewStyle(variant),
        ...(color ? [tint(color)] : []),
        ...(accessibilityLabel ? [nativeLabel(accessibilityLabel)] : []),
      ]}
    />
  );
}
