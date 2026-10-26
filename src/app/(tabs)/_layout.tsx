import { Tabs } from 'expo-router/js-tabs';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { AppTabBar } from '@/features/navigation/app-tab-bar';

export default function TabLayout() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const direction = useLayoutDirection();

  return (
    <Tabs
      backBehavior="firstRoute"
      activityEnabled={Platform.OS === 'android'}
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.background, direction },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('common.home') }} />
      <Tabs.Screen name="search" options={{ title: t('common.search') }} />
      <Tabs.Screen name="recipes" options={{ title: t('common.myRecipes') }} />
      <Tabs.Screen name="settings" options={{ title: t('common.more') }} />
    </Tabs>
  );
}
