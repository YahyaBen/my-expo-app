import type { ReactNode } from 'react';
import { useAppTheme } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { NativeButtonContent } from './universal-button-content';

export type UniversalButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'link'
  | 'success'
  | 'warning'
  | 'info'
  | 'destructive'
  /** Native glass on iOS 26+; native automatic on older iOS, outlined on Android. */
  | 'glass';

export type UniversalButtonContentProps = {
  variant: UniversalButtonVariant;
  label?: string;
  children?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
  fullWidth?: boolean;
  /** Corner radius in iOS points / Android dp. Omit for theme/native defaults; 0 is square. */
  borderRadius?: number;
  /** Override label padding, for example 0 for a whole recipe card. */
  contentPadding?: number;
  /** Override the variant's accent color. */
  color?: string;
  /** Override the native label color. */
  contentColor?: string;
};

export type UniversalButtonProps = UniversalButtonContentProps & {
  colorScheme?: 'light' | 'dark';
  /** Physical corners of the standalone Host. Overrides borderRadius; omitted corners are square. */
  cornerRadii?: {
    topLeft?: number;
    topRight?: number;
    bottomLeft?: number;
    bottomRight?: number;
  };
};

/** Resolve theme colors and shape once; explicit caller values retain precedence. */
function useButtonTheme({
  variant,
  color,
  contentColor,
  borderRadius: radiusOverride,
  colorScheme,
}: UniversalButtonProps) {
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
export function UniversalButtonContent(props: UniversalButtonContentProps) {
  const theme = useButtonTheme(props);
  return <NativeButtonContent {...props} {...theme} />;
}

/** Standalone control. Inside an existing Host, use UniversalButtonContent. */
export function UniversalButton({ colorScheme, cornerRadii, ...props }: UniversalButtonProps) {
  const theme = useButtonTheme({ ...props, colorScheme });
  return (
    <UniversalHost
      testID={props.testID ? `${props.testID}-container` : undefined}
      inline={!props.fullWidth}
      matchContents={props.fullWidth ? { vertical: true } : true}
      style={[
        props.fullWidth ? { width: '100%' } : undefined,
        // SwiftUI's native button shape only supports a uniform radius. Clip the
        // existing RN boundary, without painting another surface or adding a Host.
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
      <NativeButtonContent
        {...props}
        {...theme}
        borderRadius={cornerRadii ? 0 : theme.borderRadius}
      />
    </UniversalHost>
  );
}
