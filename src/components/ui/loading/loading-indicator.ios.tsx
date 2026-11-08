import { ProgressView } from '@expo/ui/swift-ui';
import { accessibilityLabel as nativeLabel, tint } from '@expo/ui/swift-ui/modifiers';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import type { LoadingIndicatorProps } from './loading-indicator';

export function LoadingIndicator({
  color,
  testID,
  accessibilityLabel,
}: Readonly<LoadingIndicatorProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const indicatorColor = color ?? colors.tint;
  return (
    <ProgressView
      testID={testID}
      modifiers={[
        ...(indicatorColor === undefined ? [] : [tint(indicatorColor)]),
        ...(accessibilityLabel ? [nativeLabel(accessibilityLabel)] : []),
      ]}
    />
  );
}
