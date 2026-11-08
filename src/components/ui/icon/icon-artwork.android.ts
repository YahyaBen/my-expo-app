import { useMaterialColors } from '@expo/ui/jetpack-compose';
import { createElement } from 'react';
import { SymbolArtwork, type IconArtworkProps } from './symbol-artwork';

/** Expo Symbols' RN artwork needs the native foreground across the RN bridge. */
export function IconArtwork(props: Readonly<IconArtworkProps>) {
  const colors = useMaterialColors();
  return createElement(SymbolArtwork, { ...props, color: props.color ?? colors.onSurface });
}
