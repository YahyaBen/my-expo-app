import { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ButtonContent,
  Column,
  LoadingContent,
  PageSection,
  ScrollView,
  UniversalHost,
  UniversalTextContent as Text,
  nativeCenteredMinHeight,
  nativeFillSize,
} from '@components/ui';
import { getAppBrand } from '@/config/brand';
import { getBrandHeadingFont } from '@/config/brand-assets';
import { screenContentMaxWidth, spacing } from '@/constants/layout';
import { useAuthContext } from '@/context/auth.context';
import { useLanguage } from '@/context/language.context';
import { StartupLayoutContext } from '@/context/startup-layout.context';
import { horizontalSafeAreaInset } from '@/lib/screen-insets';

/** Render before the auth navigator exists, leaving its URL and params untouched. */
export function SessionRestoreScreen({ onBack }: Readonly<{ onBack: () => void }>) {
  const { t } = useTranslation();
  const { error, retryRestore } = useAuthContext();
  const onStartupLayout = useContext(StartupLayoutContext);
  const insets = useSafeAreaInsets();
  const { language } = useLanguage();
  const brand = getAppBrand();
  const [viewportHeight, setViewportHeight] = useState(0);
  return (
    <View
      testID="auth-restoring"
      onLayout={onStartupLayout}
      style={{
        flex: 1,
        marginTop: insets.top,
        marginBottom: insets.bottom,
        marginHorizontal: horizontalSafeAreaInset(insets),
      }}
    >
      <UniversalHost
        matchContents={false}
        ignoreSafeArea="all"
        useViewportSizeMeasurement={Platform.OS === 'android'}
        onLayout={({ nativeEvent: { layout } }) => setViewportHeight(layout.height)}
        style={{ flex: 1, maxWidth: screenContentMaxWidth, alignSelf: 'center' }}
      >
        <ScrollView modifiers={nativeFillSize} testID="auth-restoring-scroll">
          <Column modifiers={nativeCenteredMinHeight(viewportHeight)} spacing={0}>
            <PageSection spacing={spacing.lg}>
              <Text
                variant="caption"
                tone="secondary"
                fontWeight="700"
                testID="auth-restoring-brand"
              >
                {brand.name.toUpperCase()}
              </Text>
              <Text
                variant="heading"
                tone="primary"
                textStyle={{ fontFamily: getBrandHeadingFont(language, brand) }}
                testID="auth-restoring-title"
              >
                {t('common.loading')}
              </Text>
              <Text variant="body" tone="muted">
                {t('auth.restoringSession')}
              </Text>
              {error ? (
                <>
                  <Text tone="error" testID="auth-restore-error">
                    {error}
                  </Text>
                  <ButtonContent
                    variant="primary"
                    label={t('common.retry')}
                    onPress={retryRestore}
                    testID="auth-restore-retry"
                  />
                </>
              ) : (
                <LoadingContent testID="auth-restore-loading" />
              )}
              <ButtonContent
                variant="tertiary"
                label={t('common.goBack')}
                onPress={onBack}
                testID="auth-restore-back"
              />
            </PageSection>
          </Column>
        </ScrollView>
      </UniversalHost>
    </View>
  );
}
