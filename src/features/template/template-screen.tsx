import {
  EmptyState,
  Icon,
  PageScreen,
  PageSection,
  SkeletonContent,
  TabNavigationBar,
  TextInput,
  UniversalTextContent,
  type TabNavigationItemId,
} from '@components/ui';
import { router, useFocusEffect } from 'expo-router';
import { Activity, useCallback, useRef, useState, type ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getAppBrand } from '@/config/brand';
import { componentCatalog, type ComponentId } from './component-catalog';
import { ComponentList } from './component-list';
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

type ContentTabId = Exclude<TabNavigationItemId, 'more'>;

const searchIcon = Icon.select({ ios: 'magnifyingglass', android: 'search' });
const clearIcon = Icon.select({ ios: 'xmark.circle.fill', android: 'cancel' });

/** Native template shell and its local component-navigation menu. */
export default function TemplateScreen({ showBack = false }: Readonly<{ showBack?: boolean }>) {
  const { t } = useTranslation();
  const brand = getAppBrand();
  const insets = useSafeAreaInsets();
  const [{ activeId, contentId, settingsOpened }, setTab] = useState<{
    activeId: TabNavigationItemId;
    contentId: ContentTabId;
    settingsOpened: boolean;
  }>({ activeId: 'home', contentId: 'home', settingsOpened: false });
  const [menuState, setMenuState] = useState<'unopened' | 'open' | 'closed'>('unopened');
  const menuOpen = menuState === 'open';
  const [search, setSearch] = useState('');
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

  function clearSearch() {
    setSearch('');
  }

  function navigateToComponent(id: ComponentId) {
    if (navigating.current) return;
    navigating.current = true;
    closeMenu();
    Keyboard.dismiss();
    router.push({ pathname: '/components/[id]', params: { id } });
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
      contentId: id === 'more' ? current.contentId : id,
      settingsOpened: current.settingsOpened || id === 'more',
    }));
  }

  const titles = {
    home: brand.name,
    search: t('template.search'),
    recipes: t('template.components'),
  };
  const searchTerm = search.trim().toLocaleLowerCase();
  const components =
    contentId === 'search' && searchTerm
      ? componentCatalog.filter(({ id }) =>
          t(`componentCatalog.names.${id}`).toLocaleLowerCase().includes(searchTerm),
        )
      : componentCatalog;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {/* Activity retains native views/state and cleans up hidden-page effects. */}
        <Activity mode={activeId === 'more' ? 'hidden' : 'visible'}>
          <PageScreen tab title={titles[contentId]} showBack={showBack}>
            {contentId === 'home' ? (
              <PageSection testID="template-wireframe">
                <UniversalTextContent variant="title">{t('template.title')}</UniversalTextContent>
                <UniversalTextContent tone="muted">
                  {t('template.description')}
                </UniversalTextContent>
                <SkeletonContent style={{ height: 160 }} testID="template-card-placeholder" />
                <SkeletonContent style={{ height: 20 }} />
                <SkeletonContent style={{ height: 16 }} />
                <SkeletonContent style={{ height: 16 }} />
              </PageSection>
            ) : (
              <PageSection>
                {contentId === 'search' ? (
                  <TextInput
                    accessibilityLabel={titles.search}
                    placeholder={titles.search}
                    value={search}
                    onChangeText={setSearch}
                    leftIcon={searchIcon}
                    rightIcon={search.length > 0 ? clearIcon : undefined}
                    onRightIconPress={clearSearch}
                    rightIconAccessibilityLabel={t('query.clearSearch')}
                    testID="template-component-search"
                  />
                ) : null}
                {components.length > 0 ? (
                  <ComponentList
                    items={components}
                    onSelect={navigateToComponent}
                    testIDPrefix="template-component"
                  />
                ) : (
                  <EmptyState
                    icon={searchIcon}
                    title={t('template.noComponents')}
                    description={t('query.searchEmptyHint')}
                    primaryAction={{ label: t('query.clearSearch'), onPress: clearSearch }}
                    testID="template-components-empty"
                  />
                )}
              </PageSection>
            )}
          </PageScreen>
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
        <ComponentMenu isPresented={menuOpen} onClose={closeMenu} onSelect={navigateToComponent} />
      ) : null}
      <TabNavigationBar
        activeId={activeId}
        onSelect={selectTab}
        bottomInset={insets.bottom}
        leftInset={insets.left}
        rightInset={insets.right}
        items={[
          { id: 'home', label: t('common.home') },
          { id: 'search', label: t('template.search') },
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
