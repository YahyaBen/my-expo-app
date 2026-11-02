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

export type ButtonContentProps = {
  variant: ButtonVariant;
  label?: string;
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

function useButtonTheme({
  variant,
  color,
  contentColor,
  borderRadius: radiusOverride,
  colorScheme,
}: ButtonProps) {
  const { colors, design } = useAppTheme(useHostColorScheme(colorScheme));
  const borderRadius = radiusOverride ?? design.shape.buttonRadius;
  if (color !== undefined || contentColor !== undefined)
    return { color, contentColor, borderRadius };
  switch (variant) {
    case 'primary':
      return { color: colors.primary, contentColor: colors.onPrimary, borderRadius };
    case 'secondary':
      return { color: colors.secondary, contentColor: colors.secondary, borderRadius };
    case 'tertiary':
      return { color: colors.muted, contentColor: colors.muted, borderRadius };
    case 'link':
      return { color: colors.tint, contentColor: colors.tint, borderRadius };
    case 'success':
      return { color: colors.success, contentColor: colors.onSuccess, borderRadius };
    case 'warning':
      return { color: colors.warning, contentColor: colors.onWarning, borderRadius };
    case 'info':
      return { color: colors.info, contentColor: colors.onInfo, borderRadius };
    case 'destructive':
      return { color: colors.error, contentColor: colors.onError, borderRadius };
    case 'glass':
      return { color: colors.surfaceVariant, contentColor: colors.text, borderRadius };
  }
}

/** Native content. Compose inside an existing Host. */
export function ButtonContent(props: Readonly<ButtonContentProps>) {
  const theme = useButtonTheme(props);
  return <NativeButton {...props} {...theme} />;
}

export function Button({ colorScheme, cornerRadii, ...props }: Readonly<ButtonProps>) {
  const theme = useButtonTheme({ ...props, colorScheme });
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      inline={!props.fullWidth}
      matchContents={props.fullWidth ? { vertical: true } : true}
      style={[
        props.fullWidth ? { width: '100%' } : undefined,
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
      <NativeButton {...props} {...theme} borderRadius={cornerRadii ? 0 : theme.borderRadius} />
    </UniversalHost>
  );
}
