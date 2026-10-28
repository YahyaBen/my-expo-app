import { Column, Row } from '@expo/ui';
import { Icon } from '../icon/icon';
import { View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { screenContentMaxWidth, tabBarRaisedHeight } from '@/constants/layout';
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
  const left = leftInset;
  const right = rightInset;

  const tab = (item: TabNavigationItem) => {
    const selected = activeId === item.id;
    return (
      <Column key={item.id} modifiers={nativeRowWeight}>
        <NavigationTab
          icon={item.id === 'home' && selected ? selectedHome : icons[item.id]}
          label={item.label}
          selected={selected}
          color={selected ? colors.tabBarActive : colors.tabBarInactive}
          selectedBackgroundColor={colors.tabBarSelectedBackground}
          testID={item.testID ?? `tab-${item.id}`}
          onPress={() => onSelect(item.id)}
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
      <View
        testID="tab-dock-surface"
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{
          position: 'absolute',
          top: tabBarRaisedHeight,
          left,
          right,
          bottom: 0,
          backgroundColor: colors.tabBarBackground,
          borderTopWidth: 1,
          borderColor: colors.tabBarBorder,
        }}
      />
      <View
        testID="tab-dock-controls"
        style={{
          paddingLeft: left,
          paddingRight: right,
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
