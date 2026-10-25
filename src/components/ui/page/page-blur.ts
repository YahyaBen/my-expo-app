import type { BlurViewProps } from 'expo-blur';
import { Platform } from 'react-native';

/** Use Expo's Android blur defaults and the existing iOS system material. */
export function pageBlurProps(
  colorScheme: 'light' | 'dark',
): Pick<BlurViewProps, 'tint' | 'intensity' | 'blurMethod'> {
  if (Platform.OS === 'android') {
    return {
      blurMethod: 'dimezisBlurViewSdk31Plus',
    };
  }

  // UIKit supplies the most translucent public system material; no private tint APIs.
  return {
    tint: colorScheme === 'dark' ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight',
    intensity: 40,
  };
}
