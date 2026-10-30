import { spacing, radii } from '@/constants/layout';
import { Column, Row, ScrollView, Spacer, type TextInputRef } from '@expo/ui';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppActive } from '@/hooks/use-motion-enabled';
import { AccessibilityInfo, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useThemeColors } from '@/hooks/use-theme';
import { triggerHaptic } from '@/lib/haptics';
import { BottomSheet } from '../bottom-sheet/bottom-sheet';
import { UniversalButtonContent } from '../button/universal-button';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { LoadingContent } from '../loading/loading-state';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalTextContent } from '../text/universal-text';
import { VerificationFace } from '../verification-code-face/verification-face';
import { OTP_LENGTH, OtpInput } from './otp-input';

export interface OtpBottomSheetProps {
  isPresented: boolean;
  onDismiss: () => void;
  recipient: string;
  /** Return false for a rejected code; throw for a request failure. */
  onVerify: (code: string) => boolean | Promise<boolean>;
  /** Omit when resending is unavailable. Cooldown begins after a successful resend. */
  onResend?: () => void | Promise<void>;
  resendCooldownSeconds?: number;
  hint?: string;
  colorScheme?: 'light' | 'dark';
  testID?: string;
}

export function OtpBottomSheet({
  colorScheme,
  testID = 'otp-sheet',
  ...props
}: Readonly<OtpBottomSheetProps>) {
  return (
    <UniversalHost colorScheme={colorScheme}>
      <BottomSheet isPresented={props.isPresented} onDismiss={props.onDismiss} testID={testID}>
        <OtpForm {...props} testID={testID} />
      </BottomSheet>
    </UniversalHost>
  );
}

function OtpForm({
  isPresented,
  onDismiss,
  recipient,
  onVerify,
  onResend,
  resendCooldownSeconds = 30,
  hint,
  testID = 'otp-sheet',
}: Readonly<OtpBottomSheetProps>) {
  const { t } = useTranslation();
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const { height } = useWindowDimensions();
  const cooldown = Number.isFinite(resendCooldownSeconds) ? Math.max(0, resendCooldownSeconds) : 30;
  // Intrinsic sheet Hosts measure with an unbounded height. Compose scrolling needs a limit.
  const viewportHeight = Math.min(620, height * 0.7);
  const inputRef = useRef<TextInputRef>(null);
  const session = useRef(0);
  const pending = useRef(false);
  const [deadline, setDeadline] = useState(() => (isPresented ? Date.now() + cooldown * 1000 : 0));
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'resending' | 'error' | 'success'>(
    'idle',
  );
  const [error, setError] = useState<'invalid' | 'verifyFailed' | 'resendFailed' | null>(null);
  const [resent, setResent] = useState(false);
  const [presentation, setPresentation] = useState({ isPresented, cooldown });
  if (presentation.isPresented !== isPresented || presentation.cooldown !== cooldown) {
    setPresentation({ isPresented, cooldown });
    if (isPresented) {
      setDeadline(() => Date.now() + cooldown * 1000);
      if (!presentation.isPresented) {
        // Adjust local state before committing the new presentation, retaining the native field.
        setCode('');
        setStatus('idle');
        setError(null);
        setResent(false);
      }
    }
  }
  useLayoutEffect(() => {
    // Only opening/closing changes request ownership; cooldown edits do not.
    session.current += 1;
    pending.current = false;
    if (!isPresented) {
      inputRef.current?.blur();
      return;
    }
    return () => {
      session.current += 1;
      pending.current = false;
    };
  }, [isPresented]);

  const busy = status === 'verifying' || status === 'resending';
  const complete = code.length === OTP_LENGTH;
  const success = status === 'success';
  function changeCode(next: string) {
    if (pending.current || success) return;
    setCode(next);
    setStatus('idle');
    setError(null);
    setResent(false);
  }
  function dismiss() {
    session.current += 1;
    pending.current = false;
    inputRef.current?.blur();
    onDismiss();
  }
  async function verify() {
    if (!isPresented || !complete || pending.current || success) return;
    const currentSession = session.current;
    pending.current = true;
    setStatus('verifying');
    setError(null);
    inputRef.current?.blur();
    try {
      const accepted = await onVerify(code);
      if (session.current !== currentSession) return;
      setStatus(accepted ? 'success' : 'error');
      setError(accepted ? null : 'invalid');
      triggerHaptic(accepted ? 'success' : 'error');
      AccessibilityInfo.announceForAccessibility(t(accepted ? 'otp.successTitle' : 'otp.invalid'));
    } catch {
      if (session.current !== currentSession) return;
      setStatus('error');
      setError('verifyFailed');
      triggerHaptic('error');
      AccessibilityInfo.announceForAccessibility(t('otp.verifyFailed'));
    } finally {
      if (session.current === currentSession) pending.current = false;
    }
  }
  async function resend() {
    if (!isPresented || !onResend || pending.current || success || Date.now() < deadline) return;
    const currentSession = session.current;
    pending.current = true;
    setStatus('resending');
    setError(null);
    try {
      await onResend();
      if (session.current !== currentSession) return;
      setDeadline(Date.now() + cooldown * 1000);
      setCode('');
      setResent(true);
      setStatus('idle');
      inputRef.current?.focus();
      triggerHaptic('success');
      AccessibilityInfo.announceForAccessibility(t('otp.resent'));
    } catch {
      if (session.current !== currentSession) return;
      setStatus('error');
      setError('resendFailed');
      triggerHaptic('error');
      AccessibilityInfo.announceForAccessibility(t('otp.resendFailed'));
    } finally {
      if (session.current === currentSession) pending.current = false;
    }
  }
  return (
    <ScrollView style={{ height: viewportHeight }}>
      <Column
        alignment="center"
        spacing={spacing.xl}
        modifiers={nativeFillWidth}
        style={{ padding: spacing.lg }}
      >
        <Row modifiers={nativeFillWidth} alignment="center">
          <Spacer flexible />
          <UniversalButtonContent
            variant="link"
            label={t('common.close')}
            onPress={dismiss}
            testID={`${testID}-close`}
          />
        </Row>
        <VerificationFace
          progress={code.length / OTP_LENGTH}
          status={success ? 'success' : status === 'error' ? 'error' : 'default'}
          visible={isPresented}
          testID={`${testID}-artwork`}
        />
        <Column
          alignment={success ? 'center' : 'start'}
          spacing={spacing.xl}
          modifiers={nativeFillWidth}
        >
          <UniversalTextContent
            testID={`${testID}-title`}
            fontSize={30}
            fontWeight="700"
            textStyle={{ textAlign: success ? 'center' : undefined }}
          >
            {t(success ? 'otp.successTitle' : 'otp.title')}
          </UniversalTextContent>
          <Column
            alignment={success ? 'center' : 'start'}
            spacing={spacing.sm}
            modifiers={nativeFillWidth}
          >
            <UniversalTextContent
              fontSize={18}
              textStyle={{ textAlign: success ? 'center' : undefined, color: colors.muted }}
            >
              {t(success ? 'otp.successDescription' : 'otp.description')}
            </UniversalTextContent>
            {!success && (
              <UniversalTextContent fontSize={18} fontWeight="700">
                {recipient}
              </UniversalTextContent>
            )}
          </Column>
        </Column>
        {!success && (
          <Column spacing={spacing.md} modifiers={nativeFillWidth}>
            <OtpInput
              ref={inputRef}
              value={code}
              onChangeText={changeCode}
              label={t('otp.codeLabel')}
              disabled={busy || !isPresented}
              error={!!error}
              onSubmitEditing={() => void verify()}
              testID={testID}
            />
            {(error || resent || hint) && (
              <UniversalTextContent
                testID={`${testID}-status`}
                variant="caption"
                textStyle={{
                  color: error ? colors.error : resent ? colors.success : colors.muted,
                  textAlign: 'center',
                }}
              >
                {error ? t(`otp.${error}`) : resent ? t('otp.resent') : hint}
              </UniversalTextContent>
            )}
          </Column>
        )}
        <UniversalButtonContent
          variant={success ? 'success' : 'primary'}
          color={success ? colors.success : undefined}
          contentColor={success ? colors.onSuccess : undefined}
          fullWidth
          contentPadding={spacing.md}
          borderRadius={radii.control}
          testID={`${testID}-verify`}
          label={t(success ? 'otp.done' : 'otp.verify')}
          disabled={!success && (!complete || busy)}
          onPress={success ? dismiss : () => void verify()}
        >
          {busy ? (
            <LoadingContent label={t(status === 'resending' ? 'otp.resending' : 'otp.verifying')} />
          ) : undefined}
        </UniversalButtonContent>
        {!success && onResend && (
          <Column alignment="center" spacing={spacing.none} modifiers={nativeFillWidth}>
            <OtpResendButton
              testID={`${testID}-resend`}
              deadline={deadline}
              isPresented={isPresented}
              busy={busy}
              onPress={() => void resend()}
            />
          </Column>
        )}
      </Column>
    </ScrollView>
  );
}

/** Only the resend label updates each second; the native form and input stay untouched. */
function OtpResendButton({
  deadline,
  isPresented,
  busy,
  onPress,
  testID,
}: Readonly<{
  deadline: number;
  isPresented: boolean;
  busy: boolean;
  onPress: () => void;
  testID: string;
}>) {
  const { t } = useTranslation();
  const active = useAppActive();
  const visible = isPresented && active;
  const [countdown, setCountdown] = useState(() => ({
    deadline,
    visible,
    remaining: Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
  }));
  if (countdown.deadline !== deadline || countdown.visible !== visible) {
    setCountdown(() => ({
      deadline,
      visible,
      remaining: Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
    }));
  }
  const { remaining } = countdown;
  useEffect(() => {
    // The deadline keeps elapsing in the background; only its visible label needs a clock.
    if (!visible) return;
    const secondsLeft = () => Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
    if (secondsLeft() === 0) return;
    const timer = setInterval(() => {
      const next = secondsLeft();
      setCountdown((previous) =>
        previous.remaining === next ? previous : { deadline, visible, remaining: next },
      );
      if (next === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline, visible]);

  return (
    <UniversalButtonContent
      variant="link"
      testID={testID}
      label={remaining > 0 ? t('otp.resendIn', { seconds: remaining }) : t('otp.resend')}
      disabled={!isPresented || remaining > 0 || busy}
      onPress={onPress}
    />
  );
}
