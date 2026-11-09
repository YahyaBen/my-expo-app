import { isLoaded, type FontSource } from 'expo-font';
import { Platform } from 'react-native';
import etLight from '@assets/animations/ET-light.lottie';
import etDark from '@assets/animations/ET-dark.lottie';
import assets from '../../config/brand-assets.json';
import { getAppBrand, type AppBrand, type HeadingFontId, type LaunchArtworkId } from './brand';

// Metro requires literal asset references. Keep paths aligned with brand-assets.json.
const fontSources: Record<HeadingFontId, FontSource | undefined> = {
  system: undefined,
  interBlack: require('@assets/fonts/Inter-Black.otf'),
  urbanistBold: require('@assets/fonts/Urbanist-Bold.ttf'),
};
const artworkSources: Record<LaunchArtworkId, { light: number; dark?: number }> = {
  et: { light: etLight, dark: etDark },
  templateIcon: { light: require('@assets/AppIcon-Dark.icon/Assets/icon.png') },
};

/** Stable build-time selection; the root loads only the selected font map. */
export function getBrandFonts(brand: AppBrand = getAppBrand()): Record<string, FontSource> {
  const id = brand.presentation.headingFont;
  const font = assets.headingFonts[id];
  const source = fontSources[id];
  return font.runtimeName && source !== undefined ? { [font.runtimeName]: source } : {};
}

/** Unsupported scripts keep native fallback instead of forcing a Latin font. */
export function getBrandHeadingFont(language: string, brand: AppBrand = getAppBrand()) {
  const font = assets.headingFonts[brand.presentation.headingFont];
  if (font.runtimeName && !isLoaded(font.runtimeName)) return undefined;
  if (!font.languages.some((supported) => supported === language)) return undefined;
  return (Platform.OS === 'ios' ? font.nativeFamily.ios : font.nativeFamily.android) ?? undefined;
}

export function getBrandLaunchArtwork(
  brand: AppBrand = getAppBrand(),
  colorScheme: 'light' | 'dark' = 'light',
) {
  const id = brand.presentation.launchArtwork;
  const sources = artworkSources[id];
  return {
    type: assets.launchArtworks[id].type,
    source: colorScheme === 'dark' ? (sources.dark ?? sources.light) : sources.light,
  };
}
