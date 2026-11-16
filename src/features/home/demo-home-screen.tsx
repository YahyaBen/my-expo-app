import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';
import {
  ButtonContent,
  PageScreen,
  PageSection,
  UniversalTextContent as Text,
} from '@components/ui';
import { useAuthContext } from '@/context/auth.context';
import { getAuthErrorMessage } from '@/services/auth/auth.error-message';

/** Placeholder content; access still requires a real backend session. */
export default function DemoHomeScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuthContext();
  const name = user?.firstName || user?.userName;
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const signingOut = useRef(false);
  async function logout() {
    if (signingOut.current) return;
    signingOut.current = true;
    setPending(true);
    setError(undefined);
    try {
      await signOut();
    } catch (error) {
      setError(getAuthErrorMessage(error));
    } finally {
      signingOut.current = false;
      setPending(false);
    }
  }
  return (
    <PageScreen title={t('auth.demoHomeTitle')} showBack={false}>
      <PageSection>
        <Text variant="heading" testID="auth-home-greeting">
          {name ? t('auth.greeting', { name }) : t('auth.welcomeBack')}
        </Text>
        {user?.email ? (
          <Text tone="muted" testID="auth-home-email">
            {user.email}
          </Text>
        ) : null}
        <Text variant="subtitle">{t('auth.demoCardTitle')}</Text>
        <Text tone="muted">{t('auth.demoDescription')}</Text>
        <ButtonContent
          variant="secondary"
          label={t('auth.exploreComponents')}
          fullWidth
          disabled={pending}
          onPress={() => router.dismissTo('/')}
          testID="auth-home-components"
        />
        <ButtonContent
          variant="tertiary"
          label={t(pending ? 'common.wait' : 'auth.signOut')}
          disabled={pending}
          fullWidth
          onPress={() => void logout()}
          testID="auth-logout"
        />
        {error ? (
          <Text tone="error" testID="auth-logout-error">
            {error}
          </Text>
        ) : null}
      </PageSection>
    </PageScreen>
  );
}
