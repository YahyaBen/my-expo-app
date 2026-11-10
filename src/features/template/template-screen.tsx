import {
  Icon,
  PageScreen,
  PageSection,
  TabNavigationBar,
  type TabNavigationItemId,
} from '@components/ui';
import { router, useFocusEffect } from 'expo-router';
import { Activity, useCallback, useRef, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAppBrand } from '@/config/brand';
import DiscoverScreen from '@/features/discover/discover-screen';
import HomeScreen from '@/features/home/home-screen';
import type { ComponentCategoryId } from './component-catalog';
import { ComponentCategoryList } from './component-category-list';
import { ComponentMenu } from './component-menu';

type SettingsScreenProps = ComponentProps<
  typeof import('@/features/settings/settings-screen').default
>;

/** Evaluate bundled Settings on first open without requesting a separate native JS chunk. */
function DeferredSettingsScreen(props: Readonly<SettingsScreenProps>) {
  const SettingsScreen: typeof import('@/features/settings/settings-screen').default =
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Keep native module evaluation deferred while bundling Settings synchronously for releases.
    require('@/features/settings/settings-screen').default;
  return <SettingsScreen {...props} />;
}

type ContentTabId = Exclude<TabNavigationItemId, 'home' | 'more'>;

/** Native template shell and its local component-navigation menu. */
export default function TemplateScreen({ showBack = false }: Readonly<{ showBack?: boolean }>) {
  const { t } = useTranslation();
  const brand = getAppBrand();
  const insets = useSafeAreaInsets();
  const [{ activeId, contentId, homeOpened, settingsOpened }, setTab] = useState<{
    activeId: TabNavigationItemId;
    contentId: ContentTabId;
    homeOpened: boolean;
    settingsOpened: boolean;
  }>({ activeId: 'search', contentId: 'search', homeOpened: false, settingsOpened: false });
  const [menuState, setMenuState] = useState<'unopened' | 'open' | 'closed'>('unopened');
  const menuOpen = menuState === 'open';
  const navigating = useRef(false);
  const closeMenu = useCallback(() => {
    setMenuState((state) => (state === 'open' ? 'closed' : state));
  }, []);
  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
      return closeMenu;
    }, [closeMenu]),
  );

  function navigateToCategory(id: ComponentCategoryId) {
    if (navigating.current) return;
    navigating.current = true;
    closeMenu();
    Keyboard.dismiss();
    router.push({ pathname: '/components/category/[id]', params: { id } });
  }

  function selectTab(id: TabNavigationItemId) {
    if (menuOpen) {
      closeMenu();
      return;
    }
    if (id === activeId) return;
    Keyboard.dismiss();
    setTab((current) => ({
      activeId: id,
      // Keep the hidden page's content and native scroll tree unchanged.
      contentId: id === 'more' || id === 'home' ? current.contentId : id,
      homeOpened: current.homeOpened || id === 'home',
      settingsOpened: current.settingsOpened || id === 'more',
    }));
  }

  const titles = {
    home: brand.name,
    search: t('discover.title'),
    recipes: t('template.components'),
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Activity retains native views/state and cleans up hidden-page effects. */}
        {homeOpened ? (
          <Activity mode={activeId === 'home' ? 'visible' : 'hidden'}>
            <HomeScreen
              title={titles.home}
              showBack={showBack}
              onBrowseComponents={() => selectTab('recipes')}
            />
          </Activity>
        ) : null}
        <Activity mode={activeId === 'more' || activeId === 'home' ? 'hidden' : 'visible'}>
          {contentId === 'search' ? (
            <DiscoverScreen
              showBack={showBack}
              onBrowseComponents={() => selectTab('recipes')}
              onSelectCategory={navigateToCategory}
            />
          ) : contentId === 'recipes' ? (
            <PageScreen
              tab
              title={titles[contentId]}
              description={t('componentCatalog.browseCategories')}
              showBack={showBack}
            >
              <PageSection>
                <ComponentCategoryList onSelect={navigateToCategory} />
              </PageSection>
            </PageScreen>
          ) : null}
        </Activity>
        {/* Do not render hidden Settings at startup: Activity also prerenders hidden children. */}
        {settingsOpened ? (
          <Activity mode={activeId === 'more' ? 'visible' : 'hidden'}>
            <DeferredSettingsScreen
              allowAppIconChange
              tab
              onBack={showBack ? () => router.back() : undefined}
            />
          </Activity>
        ) : null}
      </View>
      {menuState !== 'unopened' ? (
        <ComponentMenu isPresented={menuOpen} onClose={closeMenu} />
      ) : null}
      <TabNavigationBar
        activeId={activeId}
        onSelect={selectTab}
        bottomInset={insets.bottom}
        leftInset={insets.left}
        rightInset={insets.right}
        items={[
          {
            id: 'search',
            label: t('discover.title'),
            icon: Icon.select({ ios: 'safari', android: 'explore' }),
          },
          { id: 'home', label: t('common.home') },
          {
            id: 'recipes',
            label: t('template.components'),
            icon: Icon.select({ ios: 'square.grid.2x2', android: 'widgets' }),
          },
          {
            id: 'more',
            label: t('settings.tab'),
            icon: Icon.select({ ios: 'gearshape', android: 'settings' }),
          },
        ]}
        action={{
          kind: 'continue',
          label: t('template.openComponents'),
          onPress: () => {
            Keyboard.dismiss();
            setMenuState('open');
          },
          testID: 'template-component-menu-toggle',
        }}
      />
    </View>
  );
}
