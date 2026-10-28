import { useThemeColors } from '@/hooks/use-theme';
import { RNHostView, Row, type RowProps } from '@expo/ui';
import { SymbolView, type AndroidSymbol, type SFSymbol, type SymbolViewProps } from 'expo-symbols';
import { useContext } from 'react';
import { View } from 'react-native';
import { useHostColorScheme } from '../host/universal-host';
import { IconColorContext } from './icon-color-context';

export type IconName = { ios: SFSymbol; android: AndroidSymbol };

export type IconProps = Omit<RowProps, 'children' | 'onPress' | 'alignment' | 'spacing'> & {
  name: IconName;
  size?: number;
  color?: SymbolViewProps['tintColor'];
  accessibilityLabel?: string;
  type?: SymbolViewProps['type'];
};

/** Expo Symbols artwork bridged into an existing SwiftUI or Compose tree. */
export function Icon({
  name,
  size = 24,
  color,
  accessibilityLabel,
  type,
  ...props
}: Readonly<IconProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const inheritedColor = useContext(IconColorContext);

  return (
    <Row {...props} alignment="center" spacing={0}>
      <RNHostView matchContents>
        {/* Keep a real RN container: the entire hosted subtree must leave taps to the native action. */}
        <View collapsable={false} pointerEvents="none" style={{ width: size, height: size }}>
          <SymbolView
            name={name}
            size={size}
            tintColor={color ?? inheritedColor ?? colors.text}
            type={type}
            accessible={Boolean(accessibilityLabel)}
            accessibilityLabel={accessibilityLabel}
            pointerEvents="none"
          />
        </View>
      </RNHostView>
    </Row>
  );
}

/** Keep both typed names so SymbolView can choose the native symbol library. */
Icon.select = (names: IconName): IconName => names;
