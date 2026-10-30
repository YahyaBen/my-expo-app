import { spacing } from '@/constants/layout';
import { useTranslation } from 'react-i18next';
import { Column, Row } from '@expo/ui';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { Icon } from '../icon/icon';
import { UniversalButtonContent } from '../button/universal-button';
import { UniversalTextContent as Text } from '../text/universal-text';
import { useHostColorScheme } from '../host/universal-host';
import { useThemeColors } from '@/hooks/use-theme';

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
      <UniversalButtonContent
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
