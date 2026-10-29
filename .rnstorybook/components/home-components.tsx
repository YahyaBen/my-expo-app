import { useState, type ReactNode } from 'react';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import {
  CircularCarousel,
  Column,
  IosHomeGrid,
  StackedCarousel,
  StoryList,
  Switch,
  UniversalTextContent,
  VerificationCodeFace,
  nativeFillWidth,
  type PhotoItem,
  type VerificationCodeFaceStatus,
} from '@components/ui';
import { screenContentMaxWidth, spacing } from '@/constants/layout';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { photoFixtures } from './photo-fixtures';

/** Demo content and validation stay here; the UI components receive plain props. */
export function HomeComponents() {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.max(
    1,
    Math.min(windowWidth - insets.left - insets.right, screenContentMaxWidth) - spacing.lg * 2,
  );
  const photos = photoFixtures.map((item, index) => ({
    ...item,
    label: t('starter.homeGridPhoto', { number: index + 1 }),
  }));
  const carouselPhotos = photos.slice(0, 6);
  const positionLabel = (index: number, total: number) =>
    t('starter.storyListPosition', { number: index + 1, total });

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth}>
      <ComponentSection title={t('starter.storyListTitle')} hint={t('starter.storyListHint')}>
        <StoryList
          items={carouselPhotos}
          width={width}
          accessibilityLabel={t('starter.storyListTitle')}
          getPositionLabel={positionLabel}
          testID="home-story-list"
        />
      </ComponentSection>
      <ComponentSection title={t('starter.stackedCarouselTitle')} hint={t('starter.storyListHint')}>
        <StackedCarousel
          items={carouselPhotos}
          width={width}
          accessibilityLabel={t('starter.stackedCarouselTitle')}
          getPositionLabel={positionLabel}
          testID="home-stacked-carousel"
        />
      </ComponentSection>
      <ComponentSection
        title={t('starter.verificationFaceTitle')}
        hint={t('starter.verificationFaceHint')}
      >
        <VerificationPreview />
      </ComponentSection>
      <ComponentSection
        title={t('starter.circularCarouselTitle')}
        hint={t('starter.storyListHint')}
      >
        <CircularPreview items={carouselPhotos} width={width} positionLabel={positionLabel} />
      </ComponentSection>
      <ComponentSection title={t('starter.homeGridTitle')} hint={t('starter.homeGridHint')}>
        <IosHomeGrid
          items={photos}
          width={width}
          closeLabel={t('common.close')}
          dismissHint={t('starter.homeGridDismiss')}
          testID="home-ios-home-grid"
        />
      </ComponentSection>
    </Column>
  );
}

// Editing one demo must not rerender the gallery's other native views and images.
function VerificationPreview() {
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<VerificationCodeFaceStatus>('default');
  return (
    <VerificationCodeFace
      value={code}
      onChangeText={(next) => {
        setCode(next);
        setStatus(/[^0-9\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]/.test(next) ? 'error' : 'default');
      }}
      onComplete={(normalized) => setStatus(normalized === '1111' ? 'success' : 'error')}
      status={status}
      label={t('starter.verificationFaceLabel')}
      helperText={
        status === 'default'
          ? undefined
          : t(
              status === 'success'
                ? 'starter.verificationFaceSuccess'
                : 'starter.verificationFaceError',
            )
      }
      resetLabel={t('starter.verificationFaceReset')}
      testID="home-verification-face"
    />
  );
}

function CircularPreview({
  items,
  width,
  positionLabel,
}: Readonly<{
  items: readonly PhotoItem[];
  width: number;
  positionLabel: (index: number, total: number) => string;
}>) {
  const { t } = useTranslation();
  const [scaleEnabled, setScaleEnabled] = useState(false);
  const reducedMotion = useAppReducedMotion();
  return (
    <>
      <Switch
        label={t('starter.circularCarouselScale')}
        value={scaleEnabled}
        onValueChange={setScaleEnabled}
        disabled={reducedMotion}
        testID="home-circular-carousel-scale"
      />
      <CircularCarousel
        items={items}
        width={width}
        scaleEnabled={scaleEnabled}
        accessibilityLabel={t('starter.circularCarouselTitle')}
        getPositionLabel={positionLabel}
        testID="home-circular-carousel"
      />
    </>
  );
}

function ComponentSection({
  title,
  hint,
  children,
}: Readonly<{
  title: string;
  hint: string;
  children: ReactNode;
}>) {
  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth}>
      <UniversalTextContent variant="subtitle">{title}</UniversalTextContent>
      <UniversalTextContent tone="muted">{hint}</UniversalTextContent>
      {children}
    </Column>
  );
}
