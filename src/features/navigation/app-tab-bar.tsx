import { TabNavigationBar, type TabNavigationItemId } from '@components/ui';
import { useFocusEffect } from 'expo-router';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, Platform } from 'react-native';
import { DestinationSheet } from './destination-sheet';

const routeNames = {
  home: 'index',
  search: 'search',
  recipes: 'recipes',
  more: 'settings',
} as const;

export function AppTabBar({ state, emitter, navigateToTab, insets }: Readonly<BottomTabBarProps>) {
  const { t } = useTranslation();
  const focusedRoute = state.routes[state.index];
  const [actionRouteKey, setActionRouteKey] = useState<string | null>(null);
  const [keyboardVisible, setKeyboardVisible] = useState(() => Keyboard.isVisible());
  const closeAction = useCallback(() => setActionRouteKey(null), []);
  useFocusEffect(useCallback(() => closeAction, [closeAction]));
  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true),
    );
    const hide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const items = [
    { id: 'home', label: t('common.home'), testID: 'tab-home' },
    { id: 'search', label: t('common.search'), testID: 'tab-search' },
    { id: 'recipes', label: t('common.myRecipes'), testID: 'tab-recipes' },
    { id: 'more', label: t('common.more'), testID: 'tab-more' },
  ] as const;
  if (actionRouteKey !== null && actionRouteKey !== focusedRoute.key) setActionRouteKey(null);
  const actionOpen = actionRouteKey === focusedRoute.key;
  const activeId = items.find((item) => routeNames[item.id] === focusedRoute.name)?.id ?? 'home';

  function selectTab(id: TabNavigationItemId) {
    const route = state.routes.find((candidate) => candidate.name === routeNames[id]);
    if (!route) return;
    const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (route.key !== focusedRoute.key && !event.defaultPrevented) {
      closeAction();
      Keyboard.dismiss();
      // SDK 58 resolves placeholder keys for tabs that have not mounted yet.
      navigateToTab(route.key);
    }
  }

  return (
    <>
      {!keyboardVisible ? (
        <TabNavigationBar
          items={items}
          activeId={activeId}
          onSelect={selectTab}
          bottomInset={insets.bottom}
          leftInset={insets.left}
          rightInset={insets.right}
          action={{
            kind: 'continue',
            label: t('starter.centerAction'),
            testID: 'tab-context-action',
            onPress: () => setActionRouteKey(focusedRoute.key),
          }}
        />
      ) : null}
      <DestinationSheet isPresented={actionOpen} onDismiss={closeAction} />
    </>
  );
}
