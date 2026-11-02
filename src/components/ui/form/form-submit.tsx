import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, Row } from '@expo/ui';
import { useTranslation } from 'react-i18next';
import { ButtonContent } from '../button/button';
import { useHostColorScheme } from '../host/universal-host';
import { Icon } from '../icon/icon';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalTextContent as Text } from '../text/universal-text';

export function FormSubmit({
  testID,
  label,
  pending,
  onPress,
  error,
  notice,
}: Readonly<{
  testID: string;
  label: string;
  pending: boolean;
  onPress: () => void;
  error?: string;
  notice?: string;
}>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());
  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <ButtonContent
        variant="primary"
        testID={testID}
        label={pending ? t('common.wait') : label}
        disabled={pending}
        fullWidth
        onPress={onPress}
      />
      {error ? (
        <Row
          spacing={spacing.sm}
          modifiers={nativeFillWidth}
          style={{
            backgroundColor: colors.errorContainer,
            padding: spacing.lg,
          }}
        >
          <Icon
            name={Icon.select({ ios: 'exclamationmark.circle', android: 'error_outline' })}
            size={20}
            color={colors.onErrorContainer}
          />
          <Text
            variant="body"
            modifiers={nativeRowWeight}
            testID={`${testID}-error`}
            textStyle={{ color: colors.onErrorContainer }}
          >
            {error}
          </Text>
        </Row>
      ) : null}
      {notice ? (
        <Text variant="body" testID={`${testID}-status`} textStyle={{ color: colors.success }}>
          {notice}
        </Text>
      ) : null}
    </Column>
  );
}
