import { Skia } from '@shopify/react-native-skia';
import type { RefObject } from 'react';
import type { ViewInstance } from 'react-native';

export async function captureAppearance(view: RefObject<ViewInstance | null>) {
  // Skia 2 walks ViewGroup children without drawing the Compose host itself.
  // View-shot draws that host; load it only when a user requests a reveal.
  const { captureRef, releaseCapture } = await import('react-native-view-shot');
  const uri = await captureRef(view, { format: 'png', result: 'tmpfile' });
  try {
    const data = await Skia.Data.fromURI(uri);
    try {
      return Skia.Image.MakeImageFromEncoded(data);
    } finally {
      data.dispose();
    }
  } finally {
    releaseCapture(uri);
  }
}
