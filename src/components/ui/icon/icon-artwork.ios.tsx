import { Image } from '@expo/ui/swift-ui';
import {
  accessibilityHidden,
  accessibilityLabel as labelModifier,
} from '@expo/ui/swift-ui/modifiers';
import { SymbolArtwork, type IconArtworkProps } from './symbol-artwork';

export function IconArtwork(props: Readonly<IconArtworkProps>) {
  const { name, size, color, accessibilityLabel, type } = props;

  // Expo Symbols handles explicitly requested rendering modes.
  if (type !== undefined) return <SymbolArtwork {...props} />;

  return (
    <Image
      systemName={name.ios}
      size={size}
      color={color}
      modifiers={[accessibilityLabel ? labelModifier(accessibilityLabel) : accessibilityHidden()]}
    />
  );
}
