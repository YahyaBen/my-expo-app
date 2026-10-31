import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { NativeProgressIndicator } from './progress-indicator-native';
import type { ProgressIndicatorProps } from './progress-indicator.types';

export type { ProgressIndicatorProps } from './progress-indicator.types';

/** Native progress inside an existing Host. Linear progress needs a bounded width. */
export function ProgressIndicator({ color, ...props }: Readonly<ProgressIndicatorProps>) {
  const colors = useThemeColors(useHostColorScheme());
  return <NativeProgressIndicator {...props} color={color ?? colors.tint} />;
}
