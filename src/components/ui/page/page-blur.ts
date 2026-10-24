import { requireOptionalNativeModule } from 'expo';
import type { BlurViewProps } from 'expo-blur';
import { Platform } from 'react-native';
import { DEFAULT_HEADER_BLUR, isHeaderBlur } from '@/constants/header-blur';

const supportsTransparentTint =
  Platform.OS === 'android' &&
  requireOptionalNativeModule<{ supportsTransparentTint?: boolean }>('ExpoBlur')
    ?.supportsTransparentTint === true;

/** Keep native blur strength separate from the Android color overlay. */
export function pageBlurProps(
  colorScheme: 'light' | 'dark',
  level = DEFAULT_HEADER_BLUR,
): Pick<BlurViewProps, 'tint' | 'intensity' | 'blurReductionFactor' | 'blurMethod'> {
  const strength = isHeaderBlur(level) ? level : DEFAULT_HEADER_BLUR;
  if (Platform.OS === 'android') {
    return {
      // The pinned native patch implements this tint. Never send it to an older binary.
      tint: supportsTransparentTint ? ('transparent' as BlurViewProps['tint']) : 'default',
      // Both paths produce radius strength / 4. Existing binaries keep their tint
      // at 1 / 255 while blur strength changes independently through the divisor.
      intensity: supportsTransparentTint ? strength : 1,
      blurReductionFactor: supportsTransparentTint ? 4 : 4 / strength,
      blurMethod: 'dimezisBlurViewSdk31Plus',
    };
  }

  // UIKit supplies the most translucent public system material; no private tint APIs.
  return {
    tint: colorScheme === 'dark' ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight',
    intensity: strength,
  };
}
