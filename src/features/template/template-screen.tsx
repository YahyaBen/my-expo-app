import {
  Column,
  EmptyState,
  Icon,
  ListItem,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigating = useRef(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
      return closeMenu;
    }, [closeMenu]),
  );

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
                    label={t('template.search')}
                    value={search}
                    onChangeText={setSearch}
                    testID="template-component-search"
                  />
                ) : null}
                <Column spacing={0}>
                  {components.map(({ id, icon }) => (
                    <ListItem
                      key={id}
                      leading={<Icon name={icon} />}
                      onPress={() => navigateToComponent(id)}
                      testID={`template-component-${id}`}
                    >
                      {t(`componentCatalog.names.${id}`)}
                    </ListItem>
                  ))}
                </Column>
                {components.length === 0 ? (
                  <EmptyState
                    icon={Icon.select({ ios: 'magnifyingglass', android: 'search' })}
                    title={t('template.noComponents')}
                    description={t('query.searchEmptyHint')}
                    primaryAction={{ label: t('query.clearSearch'), onPress: () => setSearch('') }}
                    testID="template-components-empty"
                  />
                ) : null}
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
      <ComponentMenu isPresented={menuOpen} onClose={closeMenu} onNavigate={navigateToComponent} />
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
            setMenuOpen(true);
          },
          testID: 'template-component-menu-toggle',
        }}
      />
    </View>
  );
}
