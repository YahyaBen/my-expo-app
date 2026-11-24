import { Row } from '@expo/ui';
import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { Icon, type IconName } from '../icon/icon';
import { UniversalTextContent } from '../text/universal-text';
import { NativeBadgeSurface } from './native-badge-surface';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'verified';

const badgePadding = { paddingHorizontal: 8, paddingVertical: 2 };
const verifiedIcon = Icon.select({ ios: 'checkmark.seal', android: 'verified' });

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  /** Decorative leading symbol. Takes precedence over the verified variant's default. */
  icon?: IconName;
  testID?: string;
}

/** Noninteractive status label, composed inside an existing native Host. */
export function Badge({ label, variant = 'default', icon, testID }: Readonly<BadgeProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const treatments = {
    default: { background: colors.text, foreground: colors.surface },
    secondary: { background: colors.surfaceVariant, foreground: colors.text },
    destructive: { background: colors.error, foreground: colors.onError },
    outline: { background: 'transparent', foreground: colors.text },
    verified: { background: colors.info, foreground: colors.onInfo },
  };
  const { background, foreground } = treatments[variant];
  const leadingIcon = icon ?? (variant === 'verified' ? verifiedIcon : undefined);
  const text = (
    <UniversalTextContent
      variant="caption"
      fontSize={12}
      fontWeight="500"
      textStyle={{ color: foreground }}
      style={leadingIcon ? undefined : badgePadding}
      testID={testID}
    >
      {label}
    </UniversalTextContent>
  );

  return (
    <NativeBadgeSurface
      backgroundColor={background}
      borderColor={variant === 'outline' ? colors.divider : undefined}
    >
      {leadingIcon ? (
        <Row alignment="center" spacing={4} style={badgePadding}>
          <Icon name={leadingIcon} size={12} color={foreground} />
          {text}
        </Row>
      ) : (
        text
      )}
    </NativeBadgeSurface>
  );
}
