import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import {
  Column,
  nativeFillWidth,
  PageScreen,
  PageSection,
  UniversalButtonContent,
  UniversalTextContent,
} from '@components/ui';
import { useAuthGuards } from '@/guards/auth-guards';
import { developerScreensEnabled, storybookEnabled } from '@/config/developer-tools';
import { getAppBrand } from '@/config/brand';
import { spacing } from '@/constants/layout';
import { SampleRecipeRows } from '@/features/navigation/sample-recipes';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { requireAuth } = useAuthGuards();
  const brand = getAppBrand();
  return (
    <PageScreen tab title={t('common.home')} description="">
      <PageSection spacing={spacing.xl}>
        <UniversalTextContent variant="label" tone="secondary" testID="home-brand">
          {brand.name.toUpperCase()}
        </UniversalTextContent>
        <Column spacing={spacing.xl} modifiers={nativeFillWidth} testID="home-introduction">
          <UniversalTextContent variant="body">{t('starter.homeDescription')}</UniversalTextContent>
          <UniversalButtonContent
            variant="primary"
            borderRadius={0}
            label={requireAuth ? t('common.account') : t('auth.signIn')}
            testID={requireAuth ? 'home-account' : 'home-login'}
            fullWidth
            onPress={() => router.push(requireAuth ? '/account' : '/login')}
          />
        </Column>
        <UniversalButtonContent
          variant="secondary"
          borderRadius={0}
          label={t('settings.title')}
          testID="home-settings"
          fullWidth
          onPress={() => router.push('/settings')}
        />
        {developerScreensEnabled || storybookEnabled ? (
          <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
            {developerScreensEnabled ? (
              <UniversalButtonContent
                variant="tertiary"
                borderRadius={0}
                label={t('tools.showcase')}
                testID="home-showcase"
                fullWidth
                onPress={() => router.push('/ui')}
              />
            ) : null}
            {storybookEnabled ? (
              <UniversalButtonContent
                variant="tertiary"
                borderRadius={0}
                label="Storybook"
                testID="home-storybook"
                fullWidth
                onPress={() => router.push('/storybook')}
              />
            ) : null}
          </Column>
        ) : null}
      </PageSection>
      <PageSection spacing={0}>
        <UniversalTextContent tone="muted">
          {t('starter.navigationExampleDescription')}
        </UniversalTextContent>
        <SampleRecipeRows testIDPrefix="home" />
      </PageSection>
    </PageScreen>
  );
}
