// eslint-disable-next-line no-restricted-syntax -- Only the shared adapter renders native artwork; an RNHostView consumes icon-center taps inside Android modals.
import { Icon as NativeIcon, useMaterialColors } from '@expo/ui/jetpack-compose';
import { unstable_getMaterialSymbolSourceAsync } from 'expo-symbols';
import { useEffect, useState } from 'react';
import type { IconArtworkProps } from './symbol-artwork';

type SymbolSource = Awaited<ReturnType<typeof unstable_getMaterialSymbolSourceAsync>>;
const sources = new Map<string, Promise<SymbolSource>>();

/** Draw the existing Material Symbol natively so its parent owns the entire touch target. */
export function IconArtwork({ name, size, color, accessibilityLabel }: Readonly<IconArtworkProps>) {
  const colors = useMaterialColors();
  const key = `${name.android}:${size}`;
  const [artwork, setArtwork] = useState<{ key: string; source: SymbolSource }>();

  useEffect(() => {
    let cancelled = false;
    let source = sources.get(key);
    if (!source) {
      // Font rendering writes a PNG; share it across mounts and tint it natively for each theme.
      source = unstable_getMaterialSymbolSourceAsync(name.android, size, '#FFFFFF');
      sources.set(key, source);
      void source.then(
        (result) => {
          if (result === null) sources.delete(key);
        },
        () => sources.delete(key),
      );
    }
    void source
      .then((result) => {
        if (!cancelled) setArtwork({ key, source: result });
      })
      .catch((error: unknown) => {
        if (__DEV__) console.warn('Unable to render Android symbol', error);
      });
    return () => {
      cancelled = true;
    };
  }, [key, name.android, size]);

  if (artwork?.key !== key || artwork.source === null) return null;
  return (
    <NativeIcon
      source={artwork.source}
      size={size}
      tint={color ?? colors.onSurface}
      contentDescription={accessibilityLabel}
    />
  );
}
