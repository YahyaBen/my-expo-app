import { getBrandHeadingFont } from '@/config/brand-assets';
import { useLanguage } from '@/context/language.context';
import { useLayoutDirection } from '@/context/layout-direction.context';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { horizontalSafeAreaInset } from '@/lib/screen-insets';
import {
  ButtonContent,
  Column,
  Icon,
  nativeFillSize,
  nativeFillWidth,
  nativeRowWeight,
  PageFrame,
  RNHostView,
  Row,
  ScrollView,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useFocusEffect, useIsFocused, useLocalSearchParams } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  AccessibilityInfo,
  BackHandler,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import Animated, { FadeInLeft, FadeInRight, ReduceMotion } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { completeOnboarding } from './onboarding-preference';

const steps = [
  {
    id: 'discover',
    image: require('@assets/images/photo-examples/alpine-lake.jpg'),
    icon: Icon.select({ ios: 'safari.fill', android: 'explore' }),
  },
  {
    id: 'appearance',
    image: require('@assets/images/photo-examples/lavender-field.jpg'),
    icon: Icon.select({ ios: 'paintpalette.fill', android: 'palette' }),
  },
  {
    id: 'components',
    image: require('@assets/images/photo-examples/desert-arch.jpg'),
    icon: Icon.select({ ios: 'square.grid.2x2.fill', android: 'widgets' }),
  },
] as const;

const enterFromLeft = FadeInLeft.duration(230)
  .withInitialValues({ opacity: 0, transform: [{ translateX: -24 }] })
  .reduceMotion(ReduceMotion.Never);
const enterFromRight = FadeInRight.duration(230)
  .withInitialValues({ opacity: 0, transform: [{ translateX: 24 }] })
  .reduceMotion(ReduceMotion.Never);

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { replay } = useLocalSearchParams<{ replay?: string }>();
  const { height } = useWindowDimensions();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const direction = useLayoutDirection();
  const focused = useIsFocused();
  const animate = useMotionEnabled(focused);
  const [{ index, backward }, setStep] = useState({ index: 0, backward: false });
  const [saving, setSaving] = useState(false);
  const finishing = useRef(false);
  const step = steps[index];
  const lastStep = index === steps.length - 1;
  const stepLabel = t('onboarding.step', { current: index + 1, total: steps.length });
  const title = t(`onboarding.${step.id}.title`);
  const bodyAnimation = backward === (direction === 'ltr') ? enterFromLeft : enterFromRight;

  const moveToStep = useCallback(
    (next: number) => {
      if (finishing.current) return;
      setStep({ index: next, backward: next < index });
      AccessibilityInfo.announceForAccessibility(
        [
          t('onboarding.step', { current: next + 1, total: steps.length }),
          t(`onboarding.${steps[next].id}.title`),
        ].join('. '),
      );
    },
    [index, t],
  );

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        if (finishing.current) return true;
        if (index === 0) return false;
        moveToStep(index - 1);
        return true;
      });
      return () => subscription.remove();
    }, [index, moveToStep]),
  );

  async function finish() {
    if (finishing.current) return;
    finishing.current = true;
    if (replay === '1' && router.canGoBack()) {
      router.back();
      return;
    }
    setSaving(true);
    await completeOnboarding();
    router.dismissTo('/');
  }

  return (
    <PageFrame>
      <View
        testID="onboarding-screen"
        style={[
          styles.page,
          {
            paddingHorizontal: Math.max(24, horizontalSafeAreaInset(insets) + 12),
            paddingBottom: insets.bottom + 12,
          },
        ]}
      >
        <UniversalHost ignoreSafeArea="all">
          <Column spacing={8} modifiers={nativeFillWidth}>
            <Row alignment="center" spacing={12} modifiers={nativeFillWidth}>
              <Column modifiers={nativeRowWeight}>
                <Text variant="label" tone="primary" testID="onboarding-progress">
                  {stepLabel}
                </Text>
              </Column>
              <ButtonContent
                variant="tertiary"
                size="sm"
                label={t(replay === '1' ? 'common.close' : 'onboarding.skip')}
                onPress={() => void finish()}
                disabled={saving}
                testID="onboarding-skip"
              />
            </Row>
            <Row spacing={6} modifiers={nativeFillWidth}>
              {steps.map(({ id }, position) => (
                <Column
                  key={id}
                  modifiers={nativeRowWeight}
                  style={{
                    height: 4,
                    borderRadius: 2,
                    backgroundColor:
                      position <= index
                        ? (colors.tint ?? '#6875E8')
                        : (colors.surfaceVariant ?? '#80808038'),
                  }}
                />
              ))}
            </Row>
          </Column>
        </UniversalHost>
        <Animated.View
          key={step.id}
          entering={animate && (index > 0 || backward) ? bodyAnimation : undefined}
          style={styles.body}
        >
          <UniversalHost
            ignoreSafeArea="all"
            matchContents={false}
            useViewportSizeMeasurement={Platform.OS === 'android'}
            style={styles.body}
          >
            <ScrollView modifiers={nativeFillSize} testID="onboarding-scroll">
              <Column spacing={24} modifiers={nativeFillWidth} style={{ paddingVertical: 20 }}>
                <Column
                  modifiers={nativeFillWidth}
                  style={{ height: Math.min(320, Math.max(128, height * 0.36)) }}
                >
                  <RNHostView>
                    <View
                      style={styles.artwork}
                      pointerEvents="none"
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants"
                    >
                      <Image
                        source={step.image}
                        style={StyleSheet.absoluteFill}
                        contentFit="cover"
                      />
                      <LinearGradient
                        colors={['#08132500', '#0813258C']}
                        style={StyleSheet.absoluteFill}
                      />
                      <View style={styles.artworkIcon}>
                        <UniversalHost inline ignoreSafeArea="all">
                          <Icon name={step.icon} size={28} color="#FFFFFF" />
                        </UniversalHost>
                      </View>
                    </View>
                  </RNHostView>
                </Column>
                <Column spacing={10} modifiers={nativeFillWidth}>
                  <Text
                    variant="heading"
                    textStyle={{ fontFamily: getBrandHeadingFont(language) }}
                    testID={`onboarding-${step.id}-title`}
                  >
                    {title}
                  </Text>
                  <Text variant="body" tone="muted">
                    {t(`onboarding.${step.id}.description`)}
                  </Text>
                </Column>
              </Column>
            </ScrollView>
          </UniversalHost>
        </Animated.View>
        <UniversalHost ignoreSafeArea="all">
          <Row alignment="center" spacing={12} modifiers={nativeFillWidth}>
            {index > 0 ? (
              <ButtonContent
                variant="secondary"
                size="lg"
                circular
                accessibilityLabel={t('common.goBack')}
                onPress={() => moveToStep(index - 1)}
                disabled={saving}
                testID="onboarding-back"
              >
                <Icon
                  name={Icon.select({
                    ios: 'arrow.backward',
                    android: direction === 'rtl' ? 'arrow_forward' : 'arrow_back',
                  })}
                  size={20}
                />
              </ButtonContent>
            ) : null}
            <Column modifiers={nativeRowWeight}>
              <ButtonContent
                variant="primary"
                size="lg"
                fullWidth
                label={t(
                  saving ? 'common.wait' : lastStep ? 'onboarding.start' : 'onboarding.next',
                )}
                onPress={lastStep ? () => void finish() : () => moveToStep(index + 1)}
                disabled={saving}
                testID="onboarding-next"
              />
            </Column>
          </Row>
        </UniversalHost>
      </View>
    </PageFrame>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignSelf: 'center',
    width: '100%',
    maxWidth: 520,
    paddingTop: 8,
  },
  body: { flex: 1, overflow: 'hidden' },
  artwork: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 28,
    backgroundColor: '#182635',
  },
  artworkIcon: {
    position: 'absolute',
    end: 16,
    bottom: 16,
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FFFFFF66',
    backgroundColor: '#152537B3',
  },
});
