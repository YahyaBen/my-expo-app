import { Column, Row } from '@expo/ui';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon, type IconName } from '../icon/icon';
import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { screenContentMaxWidth, tabBarRaisedHeight } from '@/constants/layout';
import { navigationTheme } from '@/constants/navigation-theme';
import { triggerHaptic } from '@/lib/haptics';
import { horizontalSafeAreaInset } from '@/lib/screen-insets';
import {
  FloatingActionButton,
  type FloatingActionButtonProps,
} from '../floating-action/floating-action';
import { UniversalHost, useHostColorScheme, useHostLayoutDirection } from '../host/universal-host';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { NavigationTab } from './navigation-tab';

export type TabNavigationItemId = 'home' | 'search' | 'recipes' | 'more';

export type TabNavigationItem = {
  id: TabNavigationItemId;
  label: string;
  icon?: IconName;
  testID?: string;
};

export type TabNavigationBarProps = {
  items: readonly [TabNavigationItem, TabNavigationItem, TabNavigationItem, TabNavigationItem];
  activeId: TabNavigationItemId;
  onSelect: (id: TabNavigationItemId) => void;
  action: Omit<FloatingActionButtonProps, 'colorScheme'>;
  bottomInset?: number;
  leftInset?: number;
  rightInset?: number;
  colorScheme?: 'light' | 'dark';
};

const icons = {
  home: Icon.select({ ios: 'house', android: 'home' }),
  search: Icon.select({
    ios: 'magnifyingglass',
    android: 'search',
  }),
  recipes: Icon.select({ ios: 'book', android: 'menu_book' }),
  more: Icon.select({
    ios: 'line.3.horizontal',
    android: 'menu',
  }),
};
const selectedHome = Icon.select({
  ios: 'house.fill',
  android: 'home',
});

/** Four native destinations surround a raised action inside one measured dock. */
export function TabNavigationBar({
  items,
  activeId,
  onSelect,
  action,
  bottomInset = 0,
  leftInset = 0,
  rightInset = 0,
  colorScheme,
}: Readonly<TabNavigationBarProps>) {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const direction = useHostLayoutDirection();
  const motionEnabled = useMotionEnabled();
  const horizontalInset = horizontalSafeAreaInset({ left: leftInset, right: rightInset });
  const defaults = navigationTheme(scheme, colors).colors;
  const dockStyle = {
    position: 'absolute' as const,
    top: tabBarRaisedHeight,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.tabBarBackground ?? defaults.card,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.tabBarBorder ?? defaults.border,
  };

  const tab = (item: TabNavigationItem) => {
    const selected = activeId === item.id;
    return (
      <Column key={item.id} modifiers={nativeRowWeight}>
        <NavigationTab
          icon={item.icon ?? (item.id === 'home' && selected ? selectedHome : icons[item.id])}
          label={item.label}
          selected={selected}
          motionEnabled={motionEnabled}
          color={selected ? colors.tabBarActive : colors.tabBarInactive}
          selectedBackgroundColor={colors.tabBarSelectedBackground}
          testID={item.testID ?? `tab-${item.id}`}
          onPress={() => {
            if (!selected) triggerHaptic('selection');
            onSelect(item.id);
          }}
        />
      </Column>
    );
  };

  return (
    <View
      testID="main-tab-bar"
      pointerEvents="box-none"
      style={{
        height: 84 + bottomInset,
        marginTop: -tabBarRaisedHeight,
        flexShrink: 0,
        overflow: 'hidden',
        direction: direction === 'rightToLeft' ? 'rtl' : 'ltr',
        backgroundColor: 'transparent',
      }}
    >
      {colors.tabBarGradientStart !== undefined &&
      colors.tabBarBackground !== undefined &&
      colors.tabBarGradientEnd !== undefined ? (
        <LinearGradient
          testID="tab-dock-surface"
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          colors={[colors.tabBarGradientStart, colors.tabBarBackground, colors.tabBarGradientEnd]}
          locations={[0, 0.55, 1]}
          start={{ x: direction === 'rightToLeft' ? 1 : 0, y: 0 }}
          end={{ x: direction === 'rightToLeft' ? 0 : 1, y: 1 }}
          style={dockStyle}
        >
          {colors.tabBarHighlightClear !== undefined && colors.tabBarHighlight !== undefined ? (
            <LinearGradient
              testID="tab-dock-highlight"
              pointerEvents="none"
              colors={[
                colors.tabBarHighlightClear,
                colors.tabBarHighlight,
                colors.tabBarHighlightClear,
              ]}
              locations={[0, 0.5, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 1,
              }}
            />
          ) : null}
        </LinearGradient>
      ) : (
        <View testID="tab-dock-surface" pointerEvents="none" style={dockStyle} />
      )}
      <View
        testID="tab-dock-controls"
        style={{
          paddingHorizontal: horizontalInset,
        }}
      >
        <UniversalHost
          colorScheme={scheme}
          viewportHeight={84}
          ignoreSafeArea="all"
          style={{ maxWidth: screenContentMaxWidth, alignSelf: 'center' }}
        >
          <Row alignment="end" spacing={0} modifiers={nativeFillWidth} style={{ height: 84 }}>
            {items.slice(0, 2).map(tab)}
            <Column style={{ width: 76, paddingVertical: 4 }}>
              <FloatingActionButton {...action} colorScheme={scheme} />
            </Column>
            {items.slice(2).map(tab)}
          </Row>
        </UniversalHost>
      </View>
    </View>
  );
}
