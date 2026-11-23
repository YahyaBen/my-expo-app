import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { Keyboard } from 'react-native';
import type { TabNavigationItemId } from '@components/ui';
import ExploreScreen from '@/features/explore/explore-screen';

export default function ExploreRoute() {
  const navigating = useRef(false);
  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
    }, []),
  );

  function selectTab(tab: TabNavigationItemId) {
    if (navigating.current) return;
    navigating.current = true;
    Keyboard.dismiss();
    router.dismissTo({ pathname: '/', params: { tab } });
  }

  return (
    <ExploreScreen
      onBack={() => {
        if (navigating.current) return;
        navigating.current = true;
        Keyboard.dismiss();
        if (router.canGoBack()) router.back();
        else router.replace('/');
      }}
      onSelectTab={selectTab}
      onOpenComponents={() => selectTab('recipes')}
      onAccount={() => {
        if (navigating.current) return;
        navigating.current = true;
        Keyboard.dismiss();
        router.push('/account');
      }}
    />
  );
}
