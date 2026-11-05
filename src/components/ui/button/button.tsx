import { useAppTheme } from '@/hooks/use-theme';
import type { ReactNode } from 'react';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { NativeButton } from './native-button';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'link'
  | 'success'
  | 'warning'
  | 'info'
  | 'destructive'
  | 'glass';

export type ButtonSize = 'sm' | 'md' | 'lg';

const minimumHeights: Record<ButtonSize, number> = { sm: 44, md: 48, lg: 56 };

export type ButtonContentProps = {
  variant: ButtonVariant;
  size?: ButtonSize;
  /** Use a circular button for a single icon with an accessible name. */
  circular?: boolean;
  label?: string;
  /** Native accessible name, including when custom artwork replaces the label. */
  accessibilityLabel?: string;
  children?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  fullWidth?: boolean;
  borderRadius?: number;
  contentPadding?: number;
  color?: string;
  contentColor?: string;
};

export type ButtonProps = ButtonContentProps & {
  colorScheme?: 'light' | 'dark';
  cornerRadii?: {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
};

function useButtonAppearance({
  variant,
  size,
  circular,
  contentPadding,
  color,
  contentColor,
  borderRadius: radiusOverride,
  colorScheme,
}: ButtonProps) {
  const { colors, design } = useAppTheme(useHostColorScheme(colorScheme));
  const borderRadius = radiusOverride ?? design.shape.buttonRadius;
  const minHeight =
    size || circular || contentPadding === undefined ? minimumHeights[size ?? 'md'] : undefined;
  const geometry = { borderRadius, minHeight };
  if (color !== undefined || contentColor !== undefined)
    return { color, contentColor, ...geometry };
  switch (variant) {
    case 'primary':
      return { color: colors.primary, contentColor: colors.onPrimary, ...geometry };
    case 'secondary':
      return { color: colors.secondary, contentColor: colors.onSecondary, ...geometry };
    case 'tertiary':
      return { color: colors.muted, contentColor: colors.muted, ...geometry };
    case 'link':
      return { color: colors.tint, contentColor: colors.tint, ...geometry };
    case 'success':
      return { color: colors.success, contentColor: colors.onSuccess, ...geometry };
    case 'warning':
      return { color: colors.warning, contentColor: colors.onWarning, ...geometry };
    case 'info':
      return { color: colors.info, contentColor: colors.onInfo, ...geometry };
    case 'destructive':
      return { color: colors.error, contentColor: colors.onError, ...geometry };
    case 'glass':
      return { color: colors.surfaceVariant, contentColor: colors.text, ...geometry };
  }
}

/** Native content. Compose inside an existing Host. */
export function ButtonContent(props: Readonly<ButtonContentProps>) {
  const appearance = useButtonAppearance(props);
  return <NativeButton {...props} {...appearance} />;
}

export function Button({ colorScheme, cornerRadii, ...props }: Readonly<ButtonProps>) {
  const circular = props.circular && !cornerRadii;
  const fullWidth = props.fullWidth && !circular;
  const appearance = useButtonAppearance({ ...props, circular, colorScheme });
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      inline={!fullWidth}
      matchContents={fullWidth ? { vertical: true } : true}
      style={[
        fullWidth ? { width: '100%' } : undefined,
        cornerRadii && {
          overflow: 'hidden',
          borderTopLeftRadius: cornerRadii.topLeft ?? 0,
          borderTopRightRadius: cornerRadii.topRight ?? 0,
          borderBottomLeftRadius: cornerRadii.bottomLeft ?? 0,
          borderBottomRightRadius: cornerRadii.bottomRight ?? 0,
        },
      ]}
      colorScheme={colorScheme}
    >
      <NativeButton
        {...props}
        {...appearance}
        fullWidth={fullWidth}
        circular={circular}
        borderRadius={cornerRadii ? 0 : appearance.borderRadius}
      />
    </UniversalHost>
  );
}
