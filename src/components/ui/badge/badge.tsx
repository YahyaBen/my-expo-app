import { useThemeColors } from '@/hooks/use-theme';
import { useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent } from '../text/universal-text';
import { NativeBadgeSurface } from './native-badge-surface';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  testID?: string;
}

/** Noninteractive status label, composed inside an existing native Host. */
export function Badge({ label, variant = 'default', testID }: Readonly<BadgeProps>) {
  const colors = useThemeColors(useHostColorScheme());
  const treatments = {
    default: { background: colors.text, foreground: colors.surface },
    secondary: { background: colors.surfaceVariant, foreground: colors.text },
    destructive: { background: colors.errorContainer, foreground: colors.onErrorContainer },
    outline: { background: 'transparent', foreground: colors.text },
  };
  const treatment = treatments[variant];

  return (
    <NativeBadgeSurface
      backgroundColor={treatment.background}
      borderColor={variant === 'outline' ? colors.divider : undefined}
    >
      <UniversalTextContent
        variant="caption"
        fontSize={12}
        fontWeight="500"
        textStyle={{ color: treatment.foreground }}
        style={{ paddingHorizontal: 8, paddingVertical: 2 }}
        testID={testID}
      >
        {label}
      </UniversalTextContent>
    </NativeBadgeSurface>
  );
}
