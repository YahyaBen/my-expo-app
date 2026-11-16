import { spacing } from '@/constants/layout';
import { ButtonContent, RNHostView, Row, Text } from '@components/ui';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';

export function GoogleSignInButton({
  pending,
  disabled,
  onPress,
}: Readonly<{ pending: boolean; disabled: boolean; onPress: () => void }>) {
  const { t } = useTranslation();
  return (
    <ButtonContent
      variant="secondary"
      fullWidth
      color="#F2F2F2"
      contentColor="#1F1F1F"
      disabled={disabled}
      accessibilityLabel={t('auth.continueWithGoogle')}
      testID="auth-google"
      onPress={onPress}
    >
      <Row spacing={spacing.md} alignment="center">
        <RNHostView matchContents>
          <Image
            source={require('@assets/images/google-g.png')}
            style={{ width: 20, height: 20 }}
            contentFit="contain"
            accessible={false}
            pointerEvents="none"
          />
        </RNHostView>
        <Text>{t(pending ? 'common.wait' : 'auth.continueWithGoogle')}</Text>
      </Row>
    </ButtonContent>
  );
}
