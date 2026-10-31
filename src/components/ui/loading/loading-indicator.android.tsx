import {
  CircularProgressIndicator,
  LoadingIndicator as MaterialLoadingIndicator,
} from '@expo/ui/jetpack-compose';
import { semantics, testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import type { LoadingIndicatorProps } from './loading-indicator';

export function LoadingIndicator({
  color,
  testID,
  accessibilityLabel,
  variant = 'circular',
}: Readonly<LoadingIndicatorProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const Indicator = variant === 'expressive' ? MaterialLoadingIndicator : CircularProgressIndicator;
  return (
    <Indicator
      color={color ?? colors.tint}
      modifiers={[
        ...(testID ? [nativeTestID(testID)] : []),
        ...(accessibilityLabel ? [semantics({ contentDescription: accessibilityLabel })] : []),
      ]}
    />
  );
}
