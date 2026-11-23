import {
  BottomSheet,
  Button,
  ButtonContent,
  Chip,
  Column,
  EmptyState,
  Icon,
  IosHomeGrid,
  PageScreen,
  PageSection,
  RNHostView,
  Row,
  ScrollView,
  Skeleton,
  SkeletonContent,
  TabNavigationBar,
  TextInput,
  UniversalHost,
  UniversalTextContent as Text,
  nativeCenteredMinHeight,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
  useHostLayoutDirection,
  type PhotoItem,
  type TabNavigationItemId,
} from '@components/ui';
import { Image } from 'expo-image';
import { useIsFocused } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccessibilityInfo, FlatList, Keyboard, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { radii, screenContentMaxWidth, spacing, tabBarRaisedHeight } from '@/constants/layout';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { horizontalSafeAreaInset } from '@/lib/screen-insets';
import { explorePhotoSource, exploreStories, type ExploreStory } from './explore-stories';

const categories = ['all', 'nature', 'spaces', 'coast'] as const;
const icons = {
  search: Icon.select({ ios: 'magnifyingglass', android: 'search' }),
  account: Icon.select({ ios: 'person.crop.circle', android: 'account_circle' }),
  close: Icon.select({ ios: 'xmark', android: 'close' }),
  pause: Icon.select({ ios: 'pause.fill', android: 'pause' }),
  back: Icon.select({ ios: 'chevron.left', android: 'arrow_back' }),
  backRtl: Icon.select({ ios: 'chevron.right', android: 'arrow_forward' }),
};

/** Search and selection stay local; the route owns navigation to other app flows. */
export default function ExploreScreen({
  onBack,
  onSelectTab,
  onOpenComponents,
  onAccount,
}: Readonly<{
  onBack: () => void;
  onSelectTab: (id: TabNavigationItemId) => void;
  onOpenComponents: () => void;
  onAccount: () => void;
}>) {
  const { t, i18n } = useTranslation();
  const focused = useIsFocused();
  const colors = useThemeColors(useHostColorScheme());
  const rtl = useHostLayoutDirection() === 'rightToLeft';
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const frameWidth = Math.min(width, screenContentMaxWidth, 720);
  const viewportWidth = Math.max(1, frameWidth - horizontalSafeAreaInset(insets) * 2);
  const contentWidth = Math.max(1, viewportWidth - spacing.lg * 2);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof categories)[number]>('all');
  const [revision, setRevision] = useState(0);
  const [refreshError, setRefreshError] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedStory, setSelectedStory] = useState(exploreStories[0]);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [galleryPaused, setGalleryPaused] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(() => Keyboard.isVisible());
  const mounted = useRef(false);
  const photoRequest = useRef<Promise<void> | undefined>(undefined);
  const animate = useMotionEnabled(focused && !sheetOpen && !galleryPaused);
  // Keep the rail in the main scroll when fixed content would crowd large text or landscape.
  const fixedGallery = height >= 700 && fontScale <= 1.3;
  const locale = i18n.resolvedLanguage ?? 'en';
  const normalizedQuery = query.trim().toLocaleLowerCase(locale);
  const stories = exploreStories.filter((story) => {
    const matchesCategory = category === 'all' || story.category === category;
    const searchable = [
      t(`explore.stories.${story.id}.title`),
      t(`explore.stories.${story.id}.description`),
      t(`home.categories.${story.category}`),
    ]
      .join(' ')
      .toLocaleLowerCase(locale);
    return matchesCategory && searchable.includes(normalizedQuery);
  });
  const photos: PhotoItem[] = exploreStories.map((story) => ({
    id: story.id,
    source: explorePhotoSource(story.photoId, revision),
    label: t(`explore.stories.${story.id}.title`),
  }));

  const loadPhotos = useCallback((nextRevision: number) => {
    if (photoRequest.current) return photoRequest.current;
    setRefreshError(false);
    const request = Image.prefetch(
      exploreStories.map((story) => explorePhotoSource(story.photoId, nextRevision)),
      { cachePolicy: 'memory-disk' },
    )
      .then((loaded) => {
        if (!mounted.current) return;
        if (loaded) setRevision(nextRevision);
        else setRefreshError(true);
      })
      .catch(() => {
        if (mounted.current) setRefreshError(true);
      })
      .finally(() => {
        photoRequest.current = undefined;
        if (mounted.current) setInitialLoading(false);
      });
    photoRequest.current = request;
    return request;
  }, []);

  useEffect(() => {
    mounted.current = true;
    void loadPhotos(0);
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      mounted.current = false;
      show.remove();
      hide.remove();
    };
  }, [loadPhotos]);

  function openStory(story: ExploreStory) {
    Keyboard.dismiss();
    setSelectedStory(story);
    setSheetOpen(true);
  }

  const gallery = (
    <PhotoRail
      key={`${width}-${fontScale}`}
      items={photos}
      width={viewportWidth}
      fixed={fixedGallery}
      animate={animate && fixedGallery && !keyboardVisible}
      onSelect={() => setGalleryPaused(true)}
      onPause={() => setGalleryPaused(true)}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} testID="explore-screen">
      <View style={{ flex: 1, width: frameWidth, alignSelf: 'center' }}>
        <PageScreen title="" tab onRefresh={() => loadPhotos(revision + 1)}>
          <PageSection spacing={spacing.xl}>
            <Row alignment="center" spacing={spacing.md} modifiers={nativeFillWidth}>
              <ButtonContent
                variant="tertiary"
                circular
                accessibilityLabel={t('common.goBack')}
                onPress={onBack}
                testID="explore-back"
              >
                <Icon name={rtl ? icons.backRtl : icons.back} size={22} />
              </ButtonContent>
              <Column spacing={spacing.xs} modifiers={nativeRowWeight}>
                <Text variant="title" testID="explore-title">
                  {t('explore.title')}
                </Text>
                <Text variant="caption" tone="muted" testID="explore-results">
                  {t('explore.results', { count: stories.length })}
                </Text>
              </Column>
              <ButtonContent
                variant="tertiary"
                circular
                accessibilityLabel={t('explore.account')}
                onPress={onAccount}
                testID="explore-account"
              >
                <Icon name={icons.account} size={28} />
              </ButtonContent>
            </Row>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={t('explore.search')}
              accessibilityLabel={t('explore.search')}
              leftIcon={icons.search}
              rightIcon={query ? icons.close : undefined}
              rightIconAccessibilityLabel={t('common.clear')}
              onRightIconPress={() => setQuery('')}
              returnKeyType="search"
              onSubmitEditing={() => Keyboard.dismiss()}
              testID="explore-search"
            />
          </PageSection>

          <PageSection inset={false} style={{ paddingVertical: 0 }}>
            <ScrollView direction="horizontal" showsIndicators={false} testID="explore-filters">
              <Row spacing={spacing.sm} style={{ paddingHorizontal: spacing.lg }}>
                {categories.map((id) => (
                  <Chip
                    key={id}
                    variant="filter"
                    label={t(id === 'all' ? 'explore.all' : `home.categories.${id}`)}
                    selected={category === id}
                    onPress={() => setCategory(id)}
                    testID={`explore-filter-${id}`}
                  />
                ))}
              </Row>
            </ScrollView>
          </PageSection>

          <PageSection spacing={0} style={{ paddingTop: spacing.sm }}>
            {refreshError ? (
              <Text tone="error" testID="explore-refresh-error">
                {t('explore.refreshError')}
              </Text>
            ) : null}
            {initialLoading ? (
              <Column spacing={0} modifiers={nativeFillWidth} testID="explore-loading">
                <Text variant="caption" tone="muted">
                  {t('common.loading')}
                </Text>
                {[0, 1, 2].map((index) => (
                  <Row
                    key={index}
                    spacing={spacing.lg}
                    alignment="center"
                    modifiers={nativeFillWidth}
                    style={{
                      paddingVertical: spacing.lg,
                    }}
                  >
                    <SkeletonContent
                      style={{ width: 88, height: 88, borderRadius: radii.control }}
                    />
                    <Column spacing={spacing.md} modifiers={nativeRowWeight}>
                      <SkeletonContent style={{ height: 12 }} />
                      <SkeletonContent style={{ height: 20 }} />
                      <SkeletonContent style={{ width: 64, height: 12 }} />
                    </Column>
                  </Row>
                ))}
              </Column>
            ) : stories.length === 0 ? (
              <EmptyState
                title={t('explore.emptyTitle')}
                description={t('explore.emptyDescription')}
                icon={icons.search}
                primaryAction={{
                  label: t('explore.reset'),
                  onPress: () => {
                    setQuery('');
                    setCategory('all');
                  },
                  testID: 'explore-reset',
                }}
                testID="explore-empty"
              />
            ) : (
              stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  source={explorePhotoSource(story.photoId, revision)}
                  width={contentWidth}
                  onPress={() => openStory(story)}
                  onSelectPhoto={() => setGalleryPaused(true)}
                />
              ))
            )}
          </PageSection>
          {!fixedGallery ? gallery : null}
          <BottomSheet
            isPresented={sheetOpen}
            onDismiss={() => setSheetOpen(false)}
            scrollable
            contentHeight={Math.max(1, Math.min(height * 0.8, 720))}
            banner={
              <Column modifiers={nativeFillWidth} style={{ height: 240 }}>
                <RNHostView>
                  <PhotoArtwork
                    key={`${selectedStory.id}-${revision}`}
                    source={explorePhotoSource(selectedStory.photoId, revision)}
                    height={240}
                    testID="explore-sheet-photo"
                  />
                </RNHostView>
              </Column>
            }
            header={
              <Row alignment="center" spacing={spacing.md} modifiers={nativeFillWidth}>
                <Column spacing={spacing.xs} modifiers={nativeRowWeight}>
                  <Text variant="caption" tone="muted">
                    {t(`home.categories.${selectedStory.category}`)}
                  </Text>
                  <Text variant="title">{t(`explore.stories.${selectedStory.id}.title`)}</Text>
                </Column>
                <ButtonContent
                  variant="tertiary"
                  circular
                  accessibilityLabel={t('common.close')}
                  onPress={() => setSheetOpen(false)}
                  testID="explore-sheet-close"
                >
                  <Icon name={icons.close} />
                </ButtonContent>
              </Row>
            }
            testID="explore-story-sheet"
          >
            <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
              <Text variant="caption" tone="muted">
                {t('home.readTime', { count: selectedStory.minutes })}
              </Text>
              <Text>{t(`explore.stories.${selectedStory.id}.description`)}</Text>
            </Column>
          </BottomSheet>
        </PageScreen>
        {fixedGallery ? (
          <View style={{ display: keyboardVisible ? 'none' : 'flex' }}>
            <UniversalHost style={{ width: viewportWidth, alignSelf: 'center' }}>
              {gallery}
            </UniversalHost>
          </View>
        ) : null}
      </View>
      <TabNavigationBar
        activeId="search"
        onSelect={onSelectTab}
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
          onPress: onOpenComponents,
          testID: 'explore-components-menu',
        }}
      />
    </View>
  );
}

function StoryCard({
  story,
  source,
  width,
  onPress,
  onSelectPhoto,
}: Readonly<{
  story: ExploreStory;
  source: string;
  width: number;
  onPress: () => void;
  onSelectPhoto: () => void;
}>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const thumbnailSize = Math.min(88, width * 0.3);
  const title = t(`explore.stories.${story.id}.title`);
  return (
    <Column spacing={0} modifiers={nativeFillWidth}>
      <Row
        spacing={spacing.lg}
        alignment="center"
        modifiers={nativeFillWidth}
        style={{ paddingVertical: spacing.lg }}
      >
        <Column style={{ width: thumbnailSize }}>
          <IosHomeGrid
            items={[{ id: story.id, source, label: title }]}
            width={thumbnailSize}
            columns={1}
            showLabels={false}
            borderRadius={radii.control}
            closeLabel={t('common.close')}
            dismissHint={t('showcase.homeGridDismiss')}
            onSelect={onSelectPhoto}
            testID={`explore-thumbnail-${story.id}`}
          />
        </Column>
        <Column modifiers={nativeRowWeight}>
          <ButtonContent
            variant="tertiary"
            fullWidth
            borderRadius={radii.sm}
            contentPadding={0}
            accessibilityLabel={`${title}, ${t('home.readTime', { count: story.minutes })}`}
            onPress={onPress}
            testID={`explore-story-${story.id}`}
          >
            <Column
              spacing={spacing.sm}
              modifiers={nativeFillWidth}
              style={{ paddingVertical: spacing.xs }}
            >
              <Text variant="caption" tone="muted">
                {t(`home.categories.${story.category}`)}
              </Text>
              <Text variant="subtitle" fontWeight="600">
                {title}
              </Text>
              <Text variant="caption" tone="muted">
                {t('home.readTime', { count: story.minutes })}
              </Text>
            </Column>
          </ButtonContent>
        </Column>
      </Row>
      <Column modifiers={nativeFillWidth} style={{ height: 1, backgroundColor: colors.divider }} />
    </Column>
  );
}

/** Loading is tied to the image request, with a native retry action after failure. */
function PhotoArtwork({
  source,
  height,
  testID,
}: Readonly<{ source: string; height: number; testID: string }>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  return (
    <View
      pointerEvents={status === 'error' ? 'box-none' : 'none'}
      style={{ flex: 1, height, backgroundColor: colors.surfaceVariant }}
    >
      {status === 'loading' ? (
        <Skeleton
          animate={false}
          style={{ width: '100%', height, borderRadius: 0 }}
          testID={`${testID}-loading`}
        />
      ) : null}
      <Image
        key={attempt}
        source={source}
        contentFit="cover"
        cachePolicy="memory-disk"
        accessible={false}
        pointerEvents="none"
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('error')}
        style={{ position: 'absolute', width: '100%', height }}
        testID={testID}
      />
      {status === 'error' ? (
        <View style={{ position: 'absolute', inset: 0, justifyContent: 'center' }}>
          <Button
            variant="tertiary"
            circular
            accessibilityLabel={t('explore.retryPhoto')}
            onPress={() => {
              setStatus('loading');
              setAttempt((value) => value + 1);
            }}
            testID={`${testID}-retry`}
          >
            <Icon name={Icon.select({ ios: 'arrow.clockwise', android: 'refresh' })} />
          </Button>
        </View>
      ) : null}
    </View>
  );
}

function PhotoRail({
  items,
  width,
  fixed,
  animate,
  onSelect,
  onPause,
}: Readonly<{
  items: readonly PhotoItem[];
  width: number;
  fixed: boolean;
  animate: boolean;
  onSelect: () => void;
  onPause: () => void;
}>) {
  const { t } = useTranslation();
  const list = useRef<FlatList<PhotoItem>>(null);
  const offset = useRef(0);
  const [screenReader, setScreenReader] = useState(true);
  const tileSize = Math.max(1, Math.min(72, width - spacing.lg * 2));
  const stride = tileSize + spacing.md;
  const maxOffset = Math.max(0, items.length * stride - spacing.md + spacing.lg * 2 - width);
  const advancing = animate && !screenReader && maxOffset > 0;

  useEffect(() => {
    let live = true;
    let changed = false;
    const subscription = AccessibilityInfo.addEventListener('screenReaderChanged', (value) => {
      changed = true;
      setScreenReader(value);
    });
    void AccessibilityInfo.isScreenReaderEnabled()
      .then((value) => {
        if (live && !changed) setScreenReader(value);
      })
      .catch(() => {});
    return () => {
      live = false;
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (!advancing) return;
    // The fixed rail is visible; user dragging or Pause stops progression for this visit.
    const interval = setInterval(() => {
      offset.current =
        offset.current >= maxOffset ? 0 : Math.min(maxOffset, offset.current + stride);
      list.current?.scrollToOffset({ offset: offset.current, animated: true });
    }, 3500);
    return () => clearInterval(interval);
  }, [advancing, maxOffset, stride]);

  return (
    <Column
      spacing={spacing.sm}
      modifiers={nativeFillWidth}
      style={{ paddingTop: spacing.sm, paddingBottom: fixed ? tabBarRaisedHeight : spacing.lg }}
      testID="explore-gallery"
    >
      <Row
        spacing={spacing.sm}
        alignment="center"
        modifiers={nativeCenteredMinHeight(44)}
        style={{ paddingHorizontal: spacing.lg }}
      >
        <Column modifiers={nativeRowWeight}>
          <Text variant="label">{t('explore.gallery')}</Text>
        </Column>
        {advancing ? (
          <ButtonContent
            variant="tertiary"
            circular
            size="sm"
            accessibilityLabel={t('explore.pauseGallery')}
            onPress={onPause}
            testID="explore-gallery-pause"
          >
            <Icon name={icons.pause} size={18} />
          </ButtonContent>
        ) : null}
      </Row>
      <RNHostView matchContents>
        <FlatList
          ref={list}
          data={items}
          horizontal
          style={{ width, height: tileSize, direction: 'ltr' }}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.md }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <UniversalHost style={{ width: tileSize }}>
              <IosHomeGrid
                items={[item]}
                width={tileSize}
                columns={1}
                showLabels={false}
                borderRadius={radii.control}
                closeLabel={t('common.close')}
                dismissHint={t('showcase.homeGridDismiss')}
                onSelect={onSelect}
                testID={`explore-gallery-${item.id}`}
              />
            </UniversalHost>
          )}
          onScrollBeginDrag={onPause}
          showsHorizontalScrollIndicator={false}
          removeClippedSubviews={false}
          initialNumToRender={Math.ceil(width / stride) + 1}
          windowSize={3}
          testID="explore-gallery-scroll"
        />
      </RNHostView>
    </Column>
  );
}
