import {
  Badge,
  BottomSheet,
  ButtonContent,
  Column,
  Icon,
  PageScreen,
  PageSection,
  RNHostView,
  Row,
  ScrollView,
  StackedCarousel,
  StoryList,
  UniversalTextContent,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
  type PhotoItem,
  type PageScreenProps,
} from '@components/ui';
import catAnimation from '@assets/animations/cat.json';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenContentMaxWidth, spacing } from '@/constants/layout';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { horizontalSafeAreaInset } from '@/lib/screen-insets';
import { homeStories, type HomeStory } from './home-stories';
import { DateTimeBanner } from './date-time-banner';

const icons = {
  components: Icon.select({ ios: 'square.grid.2x2', android: 'widgets' }),
  photo: Icon.select({ ios: 'photo', android: 'image' }),
};

const photoSessionSeed = Math.random().toString(36).slice(2);

function getHomePhotoSource(photoId: number) {
  return `https://picsum.photos/seed/${photoSessionSeed}-${photoId}/900/650`;
}

const storyPhotos: readonly PhotoItem[] = homeStories.map((story) => ({
  id: story.id,
  source: getHomePhotoSource(story.photoId),
  label: story.title,
}));
const featuredPhotos = storyPhotos.slice(0, 4);
const latestPhotos = storyPhotos.slice(1, 5);
const recommendationPreviewCount = 6;

/** Product-style sample home, composed in the existing native page and dock. */
export default function HomeScreen({
  title,
  onBrowseComponents,
  onScrollGeometryChange,
}: Readonly<{
  title: string;
  onBrowseComponents: () => void;
  onScrollGeometryChange?: PageScreenProps['onScrollGeometryChange'];
}>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const viewportWidth = Math.max(
    1,
    Math.min(width, screenContentMaxWidth) - horizontalSafeAreaInset(insets) * 2,
  );
  const contentWidth = Math.max(1, viewportWidth - spacing.lg * 2);
  const compact = contentWidth < 340 || fontScale > 1.3;
  const [selectedStory, setSelectedStory] = useState<HomeStory>(homeStories[0]);
  const [storyOpen, setStoryOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [latestIndex, setLatestIndex] = useState(0);
  const recommended = showAll ? homeStories : homeStories.slice(0, recommendationPreviewCount);
  const latest = homeStories[latestIndex + 1];

  function openStory(story: HomeStory) {
    setSelectedStory(story);
    setStoryOpen(true);
  }

  return (
    <PageScreen tab title={title} onScrollGeometryChange={onScrollGeometryChange}>
      <PageSection testID="template-wireframe" spacing={spacing.xl}>
        <DateTimeBanner />
        <TesterThanks width={contentWidth} />
        <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
          <UniversalTextContent variant="caption" tone="muted" textStyle={{ letterSpacing: 1.8 }}>
            {t('home.eyebrow')}
          </UniversalTextContent>
          <UniversalTextContent
            variant="heading"
            fontSize={34}
            fontWeight="700"
            testID="home-title"
          >
            {'Lorem ipsum,\ndolor sit amet.'}
          </UniversalTextContent>
          <UniversalTextContent variant="body" tone="muted">
            {'Consectetur adipiscing elit. Ut enim ad minim veniam.'}
          </UniversalTextContent>
        </Column>
      </PageSection>

      <PageSection inset={false}>
        <FeaturedStories width={viewportWidth} onOpen={openStory} />
      </PageSection>

      <PageSection
        spacing={spacing.xl}
        style={{ backgroundColor: colors.surfaceVariant, paddingVertical: spacing.xl }}
        testID="home-recommendations"
      >
        <Row alignment="center" spacing={spacing.sm} modifiers={nativeFillWidth}>
          <Column spacing={spacing.xs} modifiers={nativeRowWeight}>
            <UniversalTextContent variant="title">{t('home.forYou')}</UniversalTextContent>
            <UniversalTextContent variant="caption" tone="muted">
              {t('home.collectionCount', { count: homeStories.length })}
            </UniversalTextContent>
          </Column>
          {homeStories.length > recommendationPreviewCount ? (
            <ButtonContent
              variant="link"
              size="sm"
              label={t(showAll ? 'home.showLess' : 'home.viewAll')}
              onPress={() => setShowAll((value) => !value)}
              testID="home-view-all"
            />
          ) : null}
        </Row>

        <StoryGrid
          stories={recommended}
          width={contentWidth}
          compact={compact}
          onOpen={openStory}
        />
      </PageSection>

      <PageSection
        inset={false}
        spacing={spacing.xl}
        style={{ paddingVertical: spacing.xl }}
        testID="home-latest"
      >
        <Column
          spacing={spacing.xs}
          modifiers={nativeFillWidth}
          style={{ paddingHorizontal: spacing.lg }}
        >
          <UniversalTextContent variant="title">{t('home.latest')}</UniversalTextContent>
          <UniversalTextContent variant="body" tone="muted">
            {'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          </UniversalTextContent>
        </Column>
        <StoryList
          items={latestPhotos}
          width={viewportWidth}
          accessibilityLabel={t('home.latest')}
          onIndexChange={(index) => setLatestIndex(index)}
          testID="home-story-list"
        />
        <PageSection spacing={spacing.sm} style={{ paddingVertical: 0 }}>
          <UniversalTextContent variant="subtitle">{latest.title}</UniversalTextContent>
          <UniversalTextContent variant="body" tone="muted">
            {latest.description}
          </UniversalTextContent>
          <ButtonContent
            variant="link"
            label={t('home.readStory')}
            onPress={() => openStory(latest)}
            testID={`home-latest-${latest.id}`}
          />
        </PageSection>
        <PageSection style={{ paddingVertical: 0 }}>
          <Column
            spacing={spacing.md}
            modifiers={nativeFillWidth}
            style={{
              padding: spacing.lg,
              borderRadius: 20,
              backgroundColor: colors.surfaceVariant,
            }}
            testID="home-discover-more"
          >
            <Icon name={icons.components} size={28} />
            <UniversalTextContent variant="subtitle">{t('home.discoverMore')}</UniversalTextContent>
            <UniversalTextContent variant="body" tone="muted">
              {'Lorem ipsum dolor sit amet. Duis aute irure dolor in reprehenderit.'}
            </UniversalTextContent>
            <ButtonContent
              variant="secondary"
              fullWidth
              label={t('home.browseComponents')}
              onPress={onBrowseComponents}
              testID="home-browse-components"
            />
          </Column>
        </PageSection>
      </PageSection>

      <BottomSheet
        isPresented={storyOpen}
        onDismiss={() => setStoryOpen(false)}
        contentHeight={Math.max(1, Math.min(height * 0.72, 680))}
        testID="home-story-sheet"
      >
        <ScrollView style={{ height: Math.max(1, Math.min(height * 0.72, 680)) }}>
          <PageSection style={{ paddingBottom: spacing.xl }}>
            <Row alignment="center" spacing={spacing.md} modifiers={nativeFillWidth}>
              <Column modifiers={nativeRowWeight}>
                <Badge label={t(`home.categories.${selectedStory.category}`)} variant="secondary" />
              </Column>
              <ButtonContent
                variant="link"
                label={t('common.close')}
                onPress={() => setStoryOpen(false)}
                testID="home-story-close"
              />
            </Row>
            <HomePhoto
              key={selectedStory.id}
              photoId={selectedStory.photoId}
              width={Math.min(contentWidth, 440)}
              height={200}
              testID="home-story-photo"
            />
            <UniversalTextContent variant="caption" tone="muted">
              {t('home.readTime', { count: selectedStory.minutes })}
            </UniversalTextContent>
            <UniversalTextContent variant="title">{selectedStory.title}</UniversalTextContent>
            <UniversalTextContent variant="body">{selectedStory.description}</UniversalTextContent>
            <UniversalTextContent variant="body" tone="muted">
              {
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.'
              }
            </UniversalTextContent>
          </PageSection>
        </ScrollView>
      </BottomSheet>
    </PageScreen>
  );
}

function TesterThanks({ width }: Readonly<{ width: number }>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const animate = useMotionEnabled();
  const animation = useRef<LottieView>(null);
  const artworkSize = Math.max(1, Math.min(180, width - spacing.lg * 2));

  useFocusEffect(
    useCallback(() => {
      const artwork = animation.current;
      if (animate) artwork?.play();
      else artwork?.pause();
      return () => artwork?.pause();
    }, [animate]),
  );

  return (
    <Column
      alignment="center"
      spacing={spacing.md}
      modifiers={nativeFillWidth}
      style={{ padding: spacing.lg, borderRadius: 24, backgroundColor: colors.surfaceVariant }}
      testID="home-tester-thanks"
    >
      <RNHostView matchContents>
        <View
          accessible={false}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={{ width: artworkSize, height: artworkSize }}
        >
          <LottieView
            ref={animation}
            source={catAnimation}
            autoPlay={false}
            loop={false}
            resizeMode="contain"
            style={{ width: artworkSize, height: artworkSize }}
            testID="home-tester-cat"
          />
        </View>
      </RNHostView>
      <UniversalTextContent variant="title" textStyle={{ textAlign: 'center' }}>
        {t('home.testers.title')}
      </UniversalTextContent>
      <UniversalTextContent variant="body" tone="muted" textStyle={{ textAlign: 'center' }}>
        {t('home.testers.description')}
      </UniversalTextContent>
    </Column>
  );
}

function StoryGrid({
  stories,
  width,
  compact,
  onOpen,
}: Readonly<{
  stories: readonly HomeStory[];
  width: number;
  compact: boolean;
  onOpen: (story: HomeStory) => void;
}>) {
  const { t } = useTranslation();
  const columns = compact ? 1 : 2;
  const tileWidth = compact ? width : (width - spacing.lg) / 2;

  return (
    <Column spacing={spacing.xl} modifiers={nativeFillWidth}>
      {Array.from({ length: Math.ceil(stories.length / columns) }, (_, row) => (
        <Row key={row} spacing={spacing.lg} modifiers={nativeFillWidth}>
          {stories.slice(row * columns, (row + 1) * columns).map((story) => (
            <Column key={story.id} spacing={spacing.md} style={{ width: tileWidth }}>
              <HomePhoto
                photoId={story.photoId}
                width={tileWidth}
                height={compact ? 200 : 148}
                testID={`home-photo-${story.id}`}
              />
              <UniversalTextContent variant="caption" tone="muted">
                {t(`home.categories.${story.category}`)}
              </UniversalTextContent>
              <UniversalTextContent variant="subtitle">{story.title}</UniversalTextContent>
              <ButtonContent
                variant="link"
                size="sm"
                label={t('common.details')}
                onPress={() => onOpen(story)}
                testID={`home-story-${story.id}`}
              />
            </Column>
          ))}
        </Row>
      ))}
    </Column>
  );
}

/** Keep the caption and actions in the same selection lifecycle as the carousel. */
function FeaturedStories({
  width,
  onOpen,
}: Readonly<{
  width: number;
  onOpen: (story: HomeStory) => void;
}>) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const story = homeStories[index];

  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth} testID="home-featured">
      <Row
        spacing={spacing.md}
        alignment="center"
        modifiers={nativeFillWidth}
        style={{ paddingHorizontal: spacing.lg }}
      >
        <Column modifiers={nativeRowWeight}>
          <UniversalTextContent variant="subtitle">{t('home.featured')}</UniversalTextContent>
        </Column>
        <Badge label={t('home.editorsPick')} variant="secondary" />
      </Row>
      <Column modifiers={nativeFillWidth} testID="template-card-placeholder">
        <StackedCarousel
          items={featuredPhotos}
          width={width}
          itemWidth={Math.min(width - spacing.lg * 2, 480)}
          accessibilityLabel={t('home.featured')}
          onIndexChange={(nextIndex) => setIndex(nextIndex)}
          testID="home-stacked-carousel"
        />
      </Column>
      <Column
        spacing={spacing.sm}
        modifiers={nativeFillWidth}
        style={{ paddingHorizontal: spacing.lg }}
      >
        <UniversalTextContent variant="caption" tone="muted">
          {`${t(`home.categories.${story.category}`)} · ${t('home.readTime', { count: story.minutes })}`}
        </UniversalTextContent>
        <UniversalTextContent variant="title">{story.title}</UniversalTextContent>
        <UniversalTextContent variant="body" tone="muted">
          {story.description}
        </UniversalTextContent>
      </Column>
      <Column modifiers={nativeFillWidth} style={{ paddingHorizontal: spacing.lg }}>
        <ButtonContent
          variant="primary"
          fullWidth
          label={t('home.readStory')}
          onPress={() => onOpen(story)}
          testID="home-featured-open"
        />
      </Column>
    </Column>
  );
}

function HomePhoto({
  photoId,
  width,
  height,
  testID,
}: Readonly<{ photoId: number; width: number; height: number; testID: string }>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <Column
        alignment="center"
        spacing={spacing.sm}
        style={{
          width,
          height,
          paddingVertical: spacing.lg,
          backgroundColor: colors.surfaceVariant,
          borderRadius: 16,
        }}
        testID={`${testID}-unavailable`}
      >
        <ButtonContent
          variant="link"
          circular
          size="sm"
          accessibilityLabel={t('home.retryPhoto')}
          onPress={() => setFailed(false)}
          testID={`${testID}-retry`}
        >
          <Icon name={icons.photo} color={colors.muted} />
        </ButtonContent>
      </Column>
    );
  }
  return (
    <RNHostView matchContents>
      <Image
        source={getHomePhotoSource(photoId)}
        contentFit="cover"
        accessible={false}
        pointerEvents="none"
        onError={() => setFailed(true)}
        style={{ width, height, borderRadius: 16, backgroundColor: colors.surfaceVariant }}
        testID={testID}
      />
    </RNHostView>
  );
}
