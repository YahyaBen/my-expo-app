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
} from '@components/ui';
import catAnimation from '@assets/animations/cat.json';
import { Image } from 'expo-image';
import { useFocusEffect } from 'expo-router';
import LottieView from 'lottie-react-native';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenContentMaxWidth } from '@/constants/layout';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { homeStories, type HomeStory } from './home-stories';
import { DateTimeBanner } from './date-time-banner';

const icons = {
  components: Icon.select({ ios: 'square.grid.2x2', android: 'widgets' }),
  photo: Icon.select({ ios: 'photo', android: 'image' }),
};

const storyPhotos: readonly PhotoItem[] = homeStories.map((story) => ({
  id: story.id,
  source: `https://picsum.photos/id/${story.photoId}/900/650`,
  label: story.title,
}));
const latestPhotos = storyPhotos.slice(1);
const recommendationPreviewCount = 6;

/** Product-style sample home, composed in the existing native page and dock. */
export default function HomeScreen({
  title,
  showBack,
  onBrowseComponents,
}: Readonly<{ title: string; showBack: boolean; onBrowseComponents: () => void }>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  const { width, height, fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.max(
    1,
    Math.min(width - insets.left - insets.right, screenContentMaxWidth) - 32,
  );
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
    <PageScreen tab title={title} showBack={showBack}>
      <PageSection testID="template-wireframe" spacing={24}>
        <DateTimeBanner />
        <TesterThanks width={contentWidth} />
        <Column spacing={8} modifiers={nativeFillWidth}>
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

        <FeaturedStories width={contentWidth} onOpen={openStory} />
      </PageSection>

      <PageSection
        spacing={20}
        style={{ backgroundColor: colors.surfaceVariant, paddingVertical: 24 }}
        testID="home-recommendations"
      >
        <Row alignment="center" spacing={8} modifiers={nativeFillWidth}>
          <Column spacing={4} modifiers={nativeRowWeight}>
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

      <PageSection spacing={20} style={{ paddingVertical: 24 }} testID="home-latest">
        <Column spacing={4} modifiers={nativeFillWidth}>
          <UniversalTextContent variant="title">{t('home.latest')}</UniversalTextContent>
          <UniversalTextContent variant="body" tone="muted">
            {'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
          </UniversalTextContent>
        </Column>
        <StoryList
          items={latestPhotos}
          width={contentWidth}
          accessibilityLabel={t('home.latest')}
          onIndexChange={(index) => setLatestIndex(index)}
          testID="home-story-list"
        />
        <Column spacing={8} modifiers={nativeFillWidth}>
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
        </Column>
        <Column
          spacing={12}
          modifiers={nativeFillWidth}
          style={{ padding: 20, borderRadius: 20, backgroundColor: colors.surfaceVariant }}
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

      <BottomSheet
        isPresented={storyOpen}
        onDismiss={() => setStoryOpen(false)}
        contentHeight={Math.max(1, Math.min(height * 0.72, 680))}
        testID="home-story-sheet"
      >
        <ScrollView style={{ height: Math.max(1, Math.min(height * 0.72, 680)) }}>
          <Column spacing={16} modifiers={nativeFillWidth} style={{ paddingBottom: 24 }}>
            <Row alignment="center" spacing={12} modifiers={nativeFillWidth}>
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
          </Column>
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
  const artworkSize = Math.max(1, Math.min(180, width - 40));

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
      spacing={12}
      modifiers={nativeFillWidth}
      style={{ padding: 20, borderRadius: 24, backgroundColor: colors.surfaceVariant }}
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
  const tileWidth = compact ? width : (width - 16) / 2;

  return (
    <Column spacing={24} modifiers={nativeFillWidth}>
      {Array.from({ length: Math.ceil(stories.length / columns) }, (_, row) => (
        <Row key={row} spacing={16} modifiers={nativeFillWidth}>
          {stories.slice(row * columns, (row + 1) * columns).map((story) => (
            <Column key={story.id} spacing={10} style={{ width: tileWidth }}>
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
    <Column spacing={16} modifiers={nativeFillWidth} testID="home-featured">
      <Row spacing={12} alignment="center" modifiers={nativeFillWidth}>
        <Column modifiers={nativeRowWeight}>
          <UniversalTextContent variant="subtitle">{t('home.featured')}</UniversalTextContent>
        </Column>
        <Badge label={t('home.editorsPick')} variant="secondary" />
      </Row>
      <Column modifiers={nativeFillWidth} testID="template-card-placeholder">
        <StackedCarousel
          items={storyPhotos}
          width={width}
          accessibilityLabel={t('home.featured')}
          onIndexChange={(nextIndex) => setIndex(nextIndex)}
          testID="home-stacked-carousel"
        />
      </Column>
      <Column spacing={8} modifiers={nativeFillWidth}>
        <UniversalTextContent variant="caption" tone="muted">
          {`${t(`home.categories.${story.category}`)} · ${t('home.readTime', { count: story.minutes })}`}
        </UniversalTextContent>
        <UniversalTextContent variant="title">{story.title}</UniversalTextContent>
        <UniversalTextContent variant="body" tone="muted">
          {story.description}
        </UniversalTextContent>
      </Column>
      <ButtonContent
        variant="primary"
        fullWidth
        label={t('home.readStory')}
        onPress={() => onOpen(story)}
        testID="home-featured-open"
      />
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
        spacing={8}
        style={{
          width,
          height,
          paddingVertical: 16,
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
        source={`https://picsum.photos/id/${photoId}/900/650`}
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
