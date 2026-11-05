import { useThemeColors } from '@/hooks/use-theme';
import { Row, type RowProps } from '@expo/ui';
import type { AndroidSymbol, SFSymbol, SymbolViewProps } from 'expo-symbols';
import { useContext } from 'react';
import { useHostColorScheme } from '../host/universal-host';
import { IconArtwork } from './icon-artwork';
import { IconColorContext } from './icon-color-context';

export type IconName = { ios: SFSymbol; android: AndroidSymbol };

export type IconProps = Omit<RowProps, 'children' | 'onPress' | 'alignment' | 'spacing'> & {
  name: IconName;
  size?: number;
  color?: SymbolViewProps['tintColor'];
  accessibilityLabel?: string;
  type?: SymbolViewProps['type'];
};

/** Platform symbol artwork inside an existing SwiftUI or Compose tree. */
export function Icon({
  name,
  size = 24,
  color,
  accessibilityLabel,
  type,
  style,
  ...props
}: Readonly<IconProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const inheritedColor = useContext(IconColorContext);

  return (
    <Row {...props} alignment="center" spacing={0} style={{ width: size, height: size, ...style }}>
      <IconArtwork
        name={name}
        size={size}
        color={color ?? inheritedColor ?? colors.text}
        accessibilityLabel={accessibilityLabel}
        type={type}
      />
    </Row>
  );
}

/** Keep both typed names for the platform renderers. */
Icon.select = (names: IconName): IconName => names;
