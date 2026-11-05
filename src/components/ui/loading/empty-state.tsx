import { radii, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { Column, Row, Text as NativeText } from '@expo/ui';
import { useWindowDimensions } from 'react-native';
import { ButtonContent, type ButtonContentProps } from '../button/button';
import { useHostColorScheme } from '../host/universal-host';
import { Icon, type IconName } from '../icon/icon';
import { nativeCenteredMinHeight, nativeFillWidthCenter } from '../native/native-fill-width';
import { UniversalTextContent as Text } from '../text/universal-text';

export type EmptyStateAction = Pick<
  ButtonContentProps,
  'disabled' | 'accessibilityLabel' | 'testID'
> & {
  label: string;
  onPress: () => void;
};

export type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: IconName;
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  footerAction?: EmptyStateAction & { external?: boolean };
  testID?: string;
  /** Preserve a caller's existing title selector when adopting this composition. */
  titleTestID?: string;
};

const folderIcon = Icon.select({ ios: 'folder', android: 'folder_open' });
const externalIcon = Icon.select({ ios: 'arrow.up.right', android: 'north_east' });

/** Empty page/list content inside the caller's existing native Host and scroll owner. */
export function EmptyState({
  title,
  description,
  icon = folderIcon,
  primaryAction,
  secondaryAction,
  footerAction,
  testID = 'empty-state',
  titleTestID,
}: Readonly<EmptyStateProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const { width, fontScale } = useWindowDimensions();
  const actionLabelLength =
    (primaryAction?.label.length ?? 0) + (secondaryAction?.label.length ?? 0);
  const Actions = width < 360 || fontScale > 1.2 || actionLabelLength > 32 ? Column : Row;

  return (
    <Column
      alignment="center"
      spacing={spacing.lg}
      modifiers={nativeCenteredMinHeight(240)}
      style={{ paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg }}
      testID={testID}
    >
      <Column
        alignment="center"
        spacing={0}
        style={{
          padding: spacing.sm,
          borderRadius: radii.control,
          backgroundColor: colors.surfaceVariant,
        }}
      >
        <Icon name={icon} size={16} />
      </Column>
      <Column alignment="center" spacing={spacing.sm} modifiers={nativeFillWidthCenter}>
        <Text
          variant="label"
          textStyle={{ textAlign: 'center' }}
          testID={titleTestID ?? `${testID}-title`}
        >
          {title}
        </Text>
        {description ? (
          <Text
            variant="body"
            fontSize={14}
            tone="muted"
            textStyle={{ textAlign: 'center' }}
            testID={`${testID}-description`}
          >
            {description}
          </Text>
        ) : null}
      </Column>
      {primaryAction || secondaryAction ? (
        <Actions alignment="center" spacing={spacing.sm}>
          {primaryAction ? (
            <ButtonContent
              {...primaryAction}
              variant="primary"
              testID={primaryAction.testID ?? `${testID}-primary`}
            />
          ) : null}
          {secondaryAction ? (
            <ButtonContent
              {...secondaryAction}
              variant="secondary"
              testID={secondaryAction.testID ?? `${testID}-secondary`}
            />
          ) : null}
        </Actions>
      ) : null}
      {footerAction ? (
        <ButtonContent
          variant="tertiary"
          label={footerAction.label}
          onPress={footerAction.onPress}
          disabled={footerAction.disabled}
          accessibilityLabel={footerAction.accessibilityLabel ?? footerAction.label}
          testID={footerAction.testID ?? `${testID}-footer`}
        >
          <Row alignment="center" spacing={spacing.xs}>
            <NativeText>{footerAction.label}</NativeText>
            {footerAction.external ? <Icon name={externalIcon} size={12} /> : null}
          </Row>
        </ButtonContent>
      ) : null}
    </Column>
  );
}
