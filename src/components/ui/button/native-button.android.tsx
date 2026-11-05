import { Button, OutlinedButton, Shape, Text, TextButton } from '@expo/ui/jetpack-compose';
import {
  defaultMinSize,
  fillMaxWidth,
  semantics,
  size as nativeSize,
  testID as nativeTestID,
} from '@expo/ui/jetpack-compose/modifiers';
import { IconColorContext } from '../icon/icon-color-context';
import type { NativeButtonProps } from './native-button';

export function NativeButton({
  variant,
  label,
  accessibilityLabel,
  children,
  onPress,
  disabled,
  testID,
  fullWidth,
  circular,
  minHeight,
  borderRadius,
  contentPadding,
  color,
  contentColor,
}: Readonly<NativeButtonProps>) {
  let NativeControl = Button;
  if (variant === 'secondary' || variant === 'glass') NativeControl = OutlinedButton;
  if (variant === 'tertiary' || variant === 'link') NativeControl = TextButton;
  const filled = NativeControl === Button;
  const radius = circular && minHeight !== undefined ? minHeight / 2 : borderRadius;
  const padding = circular ? 0 : contentPadding;
  return (
    <NativeControl
      onClick={disabled ? undefined : onPress}
      enabled={!disabled}
      shape={
        radius === undefined
          ? undefined
          : Shape.RoundedCorner({
              cornerRadii: {
                topStart: radius,
                topEnd: radius,
                bottomStart: radius,
                bottomEnd: radius,
              },
            })
      }
      contentPadding={
        padding === undefined
          ? undefined
          : {
              start: padding,
              end: padding,
              top: padding,
              bottom: padding,
            }
      }
      colors={
        color === undefined && contentColor === undefined
          ? undefined
          : {
              containerColor: filled ? color : undefined,
              contentColor: contentColor ?? (filled ? undefined : color),
            }
      }
      modifiers={[
        ...(fullWidth && !circular ? [fillMaxWidth()] : []),
        ...(minHeight === undefined
          ? []
          : [circular ? nativeSize(minHeight, minHeight) : defaultMinSize({ minHeight })]),
        ...(testID ? [nativeTestID(testID)] : []),
        ...(accessibilityLabel ? [semantics({ contentDescription: accessibilityLabel })] : []),
      ]}
    >
      <IconColorContext.Provider value={contentColor ?? (filled ? undefined : color)}>
        {children ?? <Text>{label ?? ''}</Text>}
      </IconColorContext.Provider>
    </NativeControl>
  );
}
