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
  ThemeCanvas,
  UniversalTextContent,
  VerificationCodeFace,
  nativeFillWidth,
  useHostColorScheme,
  type PhotoItem,
  type VerificationCodeFaceStatus,
} from '@components/ui';
import { screenContentMaxWidth, spacing } from '@/constants/layout';
import { useThemeSettings } from '@/context/theme.context';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';

const photoIds = [1018, 1015, 1016, 1025, 1039, 1043, 1011, 1020, 1024, 1035, 1040, 1042];

/** Demo content and app preferences stay here; the UI components receive plain props. */
export function HomeComponents() {
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const width = Math.max(
    1,
    Math.min(windowWidth - insets.left - insets.right, screenContentMaxWidth) - spacing.lg * 2,
  );
  const [scaleEnabled, setScaleEnabled] = useState(false);
  const reducedMotion = useAppReducedMotion();
  const { appearanceReady, setColorScheme } = useThemeSettings();
  const colorScheme = useHostColorScheme();
  const [code, setCode] = useState('');
  const [codeStatus, setCodeStatus] = useState<VerificationCodeFaceStatus>('default');
  const photos: PhotoItem[] = photoIds.map((id, index) => ({
    id: String(id),
    source: `https://picsum.photos/id/${id}/600/600`,
    label: t('starter.homeGridPhoto', { number: index + 1 }),
  }));
  const carouselPhotos = photos.slice(0, 6).map((item) => ({
    ...item,
    source: `https://picsum.photos/id/${item.id}/600/800`,
  }));
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
        <VerificationCodeFace
          value={code}
          onChangeText={(next) => {
            setCode(next);
            setCodeStatus(
              /[^0-9\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]/.test(next) ? 'error' : 'default',
            );
          }}
          // This local rule belongs to the demo. A real flow can verify on its backend instead.
          onComplete={(normalizedCode) =>
            setCodeStatus(normalizedCode === '1111' ? 'success' : 'error')
          }
          status={codeStatus}
          label={t('starter.verificationFaceLabel')}
          helperText={
            codeStatus === 'default'
              ? undefined
              : t(
                  codeStatus === 'success'
                    ? 'starter.verificationFaceSuccess'
                    : 'starter.verificationFaceError',
                )
          }
          resetLabel={t('starter.verificationFaceReset')}
          testID="home-verification-face"
        />
      </ComponentSection>
      <ComponentSection
        title={t('starter.circularCarouselTitle')}
        hint={t('starter.storyListHint')}
      >
        <Switch
          label={t('starter.circularCarouselScale')}
          value={scaleEnabled}
          onValueChange={setScaleEnabled}
          disabled={reducedMotion}
          testID="home-circular-carousel-scale"
        />
        <CircularCarousel
          items={photos.slice(0, 6)}
          width={width}
          scaleEnabled={scaleEnabled}
          accessibilityLabel={t('starter.circularCarouselTitle')}
          getPositionLabel={positionLabel}
          testID="home-circular-carousel"
        />
      </ComponentSection>
      <ComponentSection title={t('starter.themeCanvasTitle')} hint={t('starter.themeCanvasHint')}>
        <ThemeCanvas
          colorScheme={colorScheme}
          onColorSchemeChange={setColorScheme}
          label={t('common.darkMode')}
          disabled={!appearanceReady}
          testID="home-theme-canvas"
        />
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

function ComponentSection({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth}>
      <UniversalTextContent variant="subtitle">{title}</UniversalTextContent>
      <UniversalTextContent tone="muted">{hint}</UniversalTextContent>
      {children}
    </Column>
  );
}
