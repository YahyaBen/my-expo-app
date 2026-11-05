import { RNHostView } from '@expo/ui';
import { SymbolView } from 'expo-symbols';
import { View } from 'react-native';
import type { IconProps } from './icon';

export type IconArtworkProps = Pick<IconProps, 'name' | 'color' | 'accessibilityLabel' | 'type'> & {
  size: number;
};

export function SymbolArtwork({
  name,
  size,
  color,
  accessibilityLabel,
  type,
}: Readonly<IconArtworkProps>) {
  return (
    <RNHostView matchContents>
      <View
        collapsable={false}
        pointerEvents="none"
        style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}
      >
        <SymbolView
          name={name}
          size={size}
          tintColor={color}
          type={type}
          accessible={Boolean(accessibilityLabel)}
          accessibilityLabel={accessibilityLabel}
          pointerEvents="none"
        />
      </View>
    </RNHostView>
  );
}
