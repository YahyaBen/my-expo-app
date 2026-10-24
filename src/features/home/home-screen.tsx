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
import { radii, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { requireAuth } = useAuthGuards();
  const colors = useThemeColors();
  const brand = getAppBrand();
  return (
    <PageScreen showBack={false} title={t('common.home')} description="">
      <PageSection spacing={spacing.xl}>
        <UniversalTextContent variant="label" tone="secondary" testID="home-brand">
          {brand.name.toUpperCase()}
        </UniversalTextContent>
        <Column
          spacing={spacing.xl}
          modifiers={nativeFillWidth}
          style={{
            backgroundColor: colors.surface,
            borderRadius: radii.card,
            padding: spacing.xl,
          }}
          testID="home-introduction"
        >
          <UniversalTextContent variant="body">{t('starter.homeDescription')}</UniversalTextContent>
          <UniversalButtonContent
            variant="primary"
            label={requireAuth ? t('common.account') : t('auth.signIn')}
            testID={requireAuth ? 'home-account' : 'home-login'}
            fullWidth
            onPress={() => router.push(requireAuth ? '/account' : '/login')}
          />
        </Column>
        <UniversalButtonContent
          variant="secondary"
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
                label={t('tools.showcase')}
                testID="home-showcase"
                fullWidth
                onPress={() => router.push('/ui')}
              />
            ) : null}
            {storybookEnabled ? (
              <UniversalButtonContent
                variant="tertiary"
                label="Storybook"
                testID="home-storybook"
                fullWidth
                onPress={() => router.push('/storybook')}
              />
            ) : null}
          </Column>
        ) : null}
      </PageSection>
    </PageScreen>
  );
}
