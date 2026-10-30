const base64Alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/** Android's expo-image data loader expects Base64 bytes, including for SVG. */
export function svgImageSource(svg: string): string {
  const bytes = encodeURIComponent(svg).replace(/%([0-9A-F]{2})/g, (_, hex: string) =>
    String.fromCharCode(Number.parseInt(hex, 16)),
  );
  let encoded = '';
  for (let offset = 0; offset < bytes.length; offset += 3) {
    const first = bytes.charCodeAt(offset);
    const second = bytes.charCodeAt(offset + 1);
    const third = bytes.charCodeAt(offset + 2);
    encoded +=
      base64Alphabet[first >> 2] +
      base64Alphabet[((first & 3) << 4) | (second >> 4)] +
      (offset + 1 < bytes.length ? base64Alphabet[((second & 15) << 2) | (third >> 6)] : '=') +
      (offset + 2 < bytes.length ? base64Alphabet[third & 63] : '=');
  }
  return `data:image/svg+xml;base64,${encoded}`;
}
