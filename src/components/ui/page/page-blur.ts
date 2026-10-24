import { requireOptionalNativeModule } from 'expo';
import type { BlurViewProps } from 'expo-blur';
import { Platform } from 'react-native';

const supportsTransparentTint =
  Platform.OS === 'android' &&
  requireOptionalNativeModule<{ supportsTransparentTint?: boolean }>('ExpoBlur')
    ?.supportsTransparentTint === true;

/** Keep native blur strength separate from the Android color overlay. */
export function pageBlurProps(
  colorScheme: 'light' | 'dark',
): Pick<BlurViewProps, 'tint' | 'intensity' | 'blurReductionFactor' | 'blurMethod'> {
  if (Platform.OS === 'android') {
    return {
      // The pinned native patch implements this tint. Never send it to an older binary.
      tint: supportsTransparentTint ? ('transparent' as BlurViewProps['tint']) : 'default',
      // Existing builds retain radius 10 (1 / 0.1) with the minimum supported tint.
      // Rebuilt binaries retain radius 10 (40 / 4) with an exactly transparent overlay.
      intensity: supportsTransparentTint ? 40 : 1,
      blurReductionFactor: supportsTransparentTint ? 4 : 0.1,
      blurMethod: 'dimezisBlurViewSdk31Plus',
    };
  }

  // UIKit supplies the most translucent public system material; no private tint APIs.
  return {
    tint: colorScheme === 'dark' ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight',
    intensity: 40,
  };
}
