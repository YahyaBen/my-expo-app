import { CircularProgressIndicator } from '@expo/ui/jetpack-compose';
import { testID as nativeTestID } from '@expo/ui/jetpack-compose/modifiers';
import type { LoadingIndicatorProps } from './loading-indicator';

export function LoadingIndicator({ color, testID }: Readonly<LoadingIndicatorProps>) {
  return (
    <CircularProgressIndicator
      color={color}
      modifiers={testID ? [nativeTestID(testID)] : undefined}
    />
  );
}
