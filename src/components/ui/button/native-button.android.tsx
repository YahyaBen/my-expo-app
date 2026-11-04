import { Button, OutlinedButton, Shape, Text, TextButton } from '@expo/ui/jetpack-compose';
import {
  fillMaxWidth,
  semantics,
  testID as nativeTestID,
} from '@expo/ui/jetpack-compose/modifiers';
import { IconColorContext } from '../icon/icon-color-context';
import type { ButtonContentProps } from './button';

export function NativeButton({
  variant,
  label,
  accessibilityLabel,
  children,
  onPress,
  disabled,
  testID,
  fullWidth,
  borderRadius,
  contentPadding,
  color,
  contentColor,
}: Readonly<ButtonContentProps>) {
  let NativeControl = Button;
  if (variant === 'secondary' || variant === 'glass') NativeControl = OutlinedButton;
  if (variant === 'tertiary' || variant === 'link') NativeControl = TextButton;
  const filled = NativeControl === Button;
  return (
    <NativeControl
      onClick={disabled ? undefined : onPress}
      enabled={!disabled}
      shape={
        borderRadius === undefined
          ? undefined
          : Shape.RoundedCorner({
              cornerRadii: {
                topStart: borderRadius,
                topEnd: borderRadius,
                bottomStart: borderRadius,
                bottomEnd: borderRadius,
              },
            })
      }
      contentPadding={
        contentPadding === undefined
          ? undefined
          : {
              start: contentPadding,
              end: contentPadding,
              top: contentPadding,
              bottom: contentPadding,
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
        ...(fullWidth ? [fillMaxWidth()] : []),
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
