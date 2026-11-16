import { useMutation } from '@tanstack/react-query';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  AuthScreenFrame,
  ButtonContent,
  FormSubmit,
  FormTextInput,
  UniversalTextContent as Text,
} from '@components/ui';
import { getAuthErrorMessage } from '@/services/auth/auth.error-message';
import { verifyEmailResolver } from '@/validation/resolvers/auth';
import { useAuthFlow } from './auth-flow.context';
import { useAuthForm } from './hooks/use-auth-form';

export default function VerificationScreen() {
  const { t, i18n } = useTranslation();
  const flow = useAuthFlow();
  const challenge = flow.registrationChallenge;
  const [now, setNow] = useState(Date.now);
  const resendAt = Date.parse(challenge?.otpResendAvailableAtUtc ?? '');
  const expiresAt = Date.parse(challenge?.otpExpiresAtUtc ?? '');
  const expired = Number.isFinite(expiresAt) && now >= expiresAt;
  // Wake only at a displayed state transition, and recheck after foregrounding.
  useFocusEffect(
    useCallback(() => {
      let timer: ReturnType<typeof setTimeout> | undefined;
      function update() {
        clearTimeout(timer);
        const current = Date.now();
        setNow(current);
        const next = Math.min(...[resendAt, expiresAt].filter((time) => time > current));
        if (Number.isFinite(next)) timer = setTimeout(update, Math.max(1, next - current));
      }
      update();
      const active = AppState.addEventListener('change', (state) => {
        if (state === 'active') update();
        else clearTimeout(timer);
      });
      return () => {
        clearTimeout(timer);
        active.remove();
      };
    }, [resendAt, expiresAt]),
  );

  const auth = useAuthForm(verifyEmailResolver, { code: '' }, async ({ code }) => {
    if (Number.isFinite(expiresAt) && Date.now() >= expiresAt) throw new Error('auth.codeExpired');
    await flow.confirmRegistration(code);
  });
  const resend = useMutation({
    mutationFn: flow.resendRegistration,
    networkMode: 'always',
    retry: 0,
    onSuccess: () => {
      auth.form.reset({ code: '' });
      auth.clearError();
    },
  });
  const pending = auth.pending || resend.isPending;
  const error = auth.error ?? resend.error;
  const timeLabel = (time: number) =>
    new Date(time).toLocaleTimeString(i18n.resolvedLanguage, {
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <AuthScreenFrame
      testID="auth-verification"
      title={t(challenge ? 'auth.verifyEmailTitle' : 'auth.verificationSessionExpired')}
      description={
        challenge
          ? t('auth.verificationDescription', {
              email: challenge.maskedEmail ?? t('auth.yourEmail'),
            })
          : t('auth.registerAgain')
      }
    >
      {challenge ? (
        <>
          <FormTextInput
            control={auth.form.control}
            name="code"
            label={t('auth.verificationCode')}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            maxLength={6}
            autoCorrect={false}
            returnKeyType="done"
            disabled={pending || expired}
            onEdited={() => {
              auth.clearError();
              resend.reset();
            }}
            onSubmitEditing={() => {
              if (!pending && !expired) void auth.submit();
            }}
            testID="auth-verification-code"
          />
          {expired ? (
            <Text tone="error" testID="auth-code-expired">
              {t('auth.codeExpired')}
            </Text>
          ) : (
            <>
              {Number.isFinite(expiresAt) ? (
                <Text variant="caption" tone="muted">
                  {t('auth.codeExpiresAt', { time: timeLabel(expiresAt) })}
                </Text>
              ) : null}
              <FormSubmit
                testID="auth-verification-submit"
                label={t('auth.verifyEmail')}
                pending={pending}
                error={error ? getAuthErrorMessage(error) : undefined}
                onPress={() => void auth.submit()}
              />
            </>
          )}
          {expired && error ? (
            <Text tone="error" testID="auth-verification-error">
              {getAuthErrorMessage(error)}
            </Text>
          ) : null}
          <ButtonContent
            variant="secondary"
            label={t(resend.isPending ? 'common.wait' : 'auth.resendCode')}
            fullWidth
            disabled={pending || !flow.canResendRegistration || now < resendAt}
            onPress={() => {
              if (Date.now() >= resendAt || !Number.isFinite(resendAt)) resend.mutate();
            }}
            testID="auth-verification-resend"
          />
          {now < resendAt ? (
            <Text variant="caption" tone="muted">
              {t('auth.resendAvailableAt', { time: timeLabel(resendAt) })}
            </Text>
          ) : null}
          {!flow.canResendRegistration ? <Text tone="muted">{t('auth.loginForCode')}</Text> : null}
        </>
      ) : null}
      <ButtonContent
        variant="link"
        label={t('auth.backToSignIn')}
        fullWidth
        disabled={pending}
        onPress={() => {
          flow.clearChallenge();
          router.dismissTo('/components/login');
        }}
        testID="auth-verification-cancel"
      />
    </AuthScreenFrame>
  );
}
