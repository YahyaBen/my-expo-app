import {
  Badge,
  BottomSheet,
  ButtonContent,
  Chip,
  Column,
  EmptyState,
  Icon,
  PageScreen,
  PageSection,
  RNHostView,
  Row,
  ScrollView,
  StackedCarousel,
  StoryList,
  TextInput,
  UniversalTextContent,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
  type PhotoItem,
} from '@components/ui';
import { Image } from 'expo-image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Keyboard, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenContentMaxWidth } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { homeCategories, homeStories, type HomeCategory, type HomeStory } from './home-stories';

const icons = {
  search: Icon.select({ ios: 'magnifyingglass', android: 'search' }),
  clear: Icon.select({ ios: 'xmark.circle.fill', android: 'cancel' }),
  bookmark: Icon.select({ ios: 'bookmark', android: 'bookmark_border' }),
  saved: Icon.select({ ios: 'bookmark.fill', android: 'bookmark' }),
  components: Icon.select({ ios: 'square.grid.2x2', android: 'widgets' }),
  photo: Icon.select({ ios: 'photo', android: 'image' }),
};

const storyPhotos: readonly PhotoItem[] = homeStories.map((story) => ({
  id: story.id,
  source: `https://picsum.photos/id/${story.photoId}/900/650`,
  label: story.title,
}));
const latestPhotos = storyPhotos.slice(1);

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
  const tileWidth = compact ? contentWidth : (contentWidth - 16) / 2;
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<HomeCategory>('all');
  const [savedIds, setSavedIds] = useState<readonly string[]>([]);
  const [savedOnly, setSavedOnly] = useState(false);
  const [selectedStory, setSelectedStory] = useState<HomeStory>(homeStories[0]);
  const [storyOpen, setStoryOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [latestIndex, setLatestIndex] = useState(0);
  const query = search.trim().toLocaleLowerCase();
  const filteredStories = homeStories.filter(
    (story) =>
      (!savedOnly || savedIds.includes(story.id)) &&
      (category === 'all' || story.category === category) &&
      (!query ||
        `${story.title} ${story.description} ${t(`home.categories.${story.category}`)}`
          .toLocaleLowerCase()
          .includes(query)),
  );
  const browsingCollection = query.length > 0 || savedOnly;
  const recommended = showAll || browsingCollection ? filteredStories : filteredStories.slice(0, 2);
  const latest = homeStories[latestIndex + 1];

  function openStory(story: HomeStory) {
    Keyboard.dismiss();
    setSelectedStory(story);
    setStoryOpen(true);
  }

  function toggleSaved(story: HomeStory) {
    setSavedIds((current) =>
      current.includes(story.id) ? current.filter((id) => id !== story.id) : [...current, story.id],
    );
  }

  function resetFilters() {
    setSearch('');
    setCategory('all');
    setSavedOnly(false);
    setShowAll(false);
  }

  return (
    <PageScreen tab title={title} showBack={showBack}>
      <PageSection testID="template-wireframe" spacing={24}>
        {!browsingCollection ? (
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
        ) : null}

        <TextInput
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          returnKeyType="search"
          placeholder={t('home.search')}
          accessibilityLabel={t('home.search')}
          leftIcon={icons.search}
          rightIcon={search ? icons.clear : undefined}
          onRightIconPress={() => setSearch('')}
          rightIconAccessibilityLabel={t('query.clearSearch')}
          testID="home-search"
        />

        {!browsingCollection ? (
          <FeaturedStories
            width={contentWidth}
            savedIds={savedIds}
            onOpen={openStory}
            onToggleSaved={toggleSaved}
          />
        ) : null}
      </PageSection>

      <PageSection
        spacing={20}
        style={{ backgroundColor: colors.surfaceVariant, paddingVertical: 24 }}
        testID="home-recommendations"
      >
        <Row alignment="center" spacing={8} modifiers={nativeFillWidth}>
          <Column spacing={4} modifiers={nativeRowWeight}>
            <UniversalTextContent variant="title">
              {t(savedOnly ? 'home.savedStories' : 'home.forYou')}
            </UniversalTextContent>
            <UniversalTextContent variant="caption" tone="muted">
              {t('home.collectionCount', { count: filteredStories.length })}
            </UniversalTextContent>
          </Column>
          {!browsingCollection && filteredStories.length > 2 ? (
            <ButtonContent
              variant="link"
              size="sm"
              label={t(showAll ? 'home.showLess' : 'home.viewAll')}
              onPress={() => setShowAll((value) => !value)}
              testID="home-view-all"
            />
          ) : null}
        </Row>

        <ScrollView
          direction="horizontal"
          showsIndicators={false}
          style={{ width: contentWidth }}
          testID="home-category-filters"
        >
          <Row spacing={8} alignment="center">
            <Chip
              variant="filter"
              label={t('home.savedCount', { count: savedIds.length })}
              selected={savedOnly}
              onPress={() => setSavedOnly((value) => !value)}
              testID="home-filter-saved"
            />
            {homeCategories.map((id) => (
              <Chip
                key={id}
                variant="filter"
                label={t(`home.categories.${id}`)}
                selected={category === id}
                onPress={() => setCategory(id)}
                testID={`home-category-${id}`}
              />
            ))}
          </Row>
        </ScrollView>

        {recommended.length === 0 ? (
          <EmptyState
            icon={savedOnly ? icons.bookmark : icons.search}
            title={t(savedOnly ? 'home.noSaved' : 'home.noResults')}
            description={t(savedOnly ? 'home.noSavedHint' : 'home.noResultsHint')}
            primaryAction={{
              label: t('home.exploreAll'),
              onPress: resetFilters,
              testID: 'home-reset-filters',
            }}
            testID="home-empty"
          />
        ) : (
          <Column spacing={24} modifiers={nativeFillWidth}>
            {Array.from({ length: Math.ceil(recommended.length / (compact ? 1 : 2)) }, (_, row) => (
              <Row key={row} spacing={16} modifiers={nativeFillWidth}>
                {recommended
                  .slice(row * (compact ? 1 : 2), (row + 1) * (compact ? 1 : 2))
                  .map((story) => (
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
                      <Row alignment="center" spacing={4} modifiers={nativeFillWidth}>
                        <Column modifiers={nativeRowWeight}>
                          <ButtonContent
                            variant="link"
                            size="sm"
                            label={t('common.details')}
                            onPress={() => openStory(story)}
                            testID={`home-story-${story.id}`}
                          />
                        </Column>
                        <SaveButton
                          story={story}
                          saved={savedIds.includes(story.id)}
                          onPress={() => toggleSaved(story)}
                          testID={`home-save-${story.id}`}
                        />
                      </Row>
                    </Column>
                  ))}
              </Row>
            ))}
          </Column>
        )}
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
          height={240}
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
            <ButtonContent
              variant={savedIds.includes(selectedStory.id) ? 'secondary' : 'primary'}
              fullWidth
              label={t(savedIds.includes(selectedStory.id) ? 'home.removeSaved' : 'home.saveStory')}
              onPress={() => toggleSaved(selectedStory)}
              testID="home-story-toggle-save"
            />
          </Column>
        </ScrollView>
      </BottomSheet>
    </PageScreen>
  );
}

/** Keep the caption and actions in the same selection lifecycle as the carousel. */
function FeaturedStories({
  width,
  savedIds,
  onOpen,
  onToggleSaved,
}: Readonly<{
  width: number;
  savedIds: readonly string[];
  onOpen: (story: HomeStory) => void;
  onToggleSaved: (story: HomeStory) => void;
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
          height={280}
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
      <Row spacing={12} alignment="center" modifiers={nativeFillWidth}>
        <Column modifiers={nativeRowWeight}>
          <ButtonContent
            variant="primary"
            fullWidth
            label={t('home.readStory')}
            onPress={() => onOpen(story)}
            testID="home-featured-open"
          />
        </Column>
        <SaveButton
          story={story}
          saved={savedIds.includes(story.id)}
          onPress={() => onToggleSaved(story)}
          testID="home-featured-save"
        />
      </Row>
    </Column>
  );
}

function SaveButton({
  story,
  saved,
  onPress,
  testID,
}: Readonly<{ story: HomeStory; saved: boolean; onPress: () => void; testID: string }>) {
  const { t } = useTranslation();
  return (
    <ButtonContent
      variant="tertiary"
      circular
      size="sm"
      accessibilityLabel={t(saved ? 'home.unsaveNamed' : 'home.saveNamed', { title: story.title })}
      onPress={onPress}
      testID={testID}
    >
      <Icon name={saved ? icons.saved : icons.bookmark} size={20} />
    </ButtonContent>
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
