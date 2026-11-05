import { Button, Text, VStack } from '@expo/ui/swift-ui';
import {
  buttonBorderShape,
  accessibilityLabel as nativeAccessibilityLabel,
  buttonStyle,
  clipShape,
  contentShape,
  foregroundStyle,
  frame,
  disabled as nativeDisabled,
  padding,
  shapes,
  tint,
} from '@expo/ui/swift-ui/modifiers';
import { IconColorContext } from '../icon/icon-color-context';
import type { NativeButtonProps } from './native-button';

/** Internal renderer; callers resolve theme colors before reaching the native control. */
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
  let style: Parameters<typeof buttonStyle>[0] = 'borderedProminent';
  if (variant === 'secondary') style = 'bordered';
  if (variant === 'tertiary' || variant === 'link') style = 'plain';
  if (variant === 'glass') style = 'glass';
  const labelColor = contentColor ?? (style === 'borderedProminent' ? undefined : color);
  // SwiftUI's bordered and glass styles add their own vertical insets around the label.
  const labelMinHeight = minHeight === undefined || style === 'plain' ? minHeight : minHeight - 12;
  const borderModifiers = circular
    ? [buttonBorderShape('circle')]
    : borderRadius === undefined
      ? []
      : [
          buttonBorderShape('roundedRectangle', borderRadius),
          clipShape('roundedRectangle', borderRadius),
        ];
  return (
    <Button
      testID={testID}
      role={variant === 'destructive' ? 'destructive' : undefined}
      onPress={disabled ? undefined : onPress}
      modifiers={[
        buttonStyle(style),
        ...(accessibilityLabel ? [nativeAccessibilityLabel(accessibilityLabel)] : []),
        ...(color === undefined ? [] : [tint(color)]),
        nativeDisabled(Boolean(disabled)),
        ...borderModifiers,
      ]}
    >
      <VStack
        spacing={0}
        modifiers={[
          ...(labelColor === undefined ? [] : [foregroundStyle(labelColor)]),
          ...(contentPadding === undefined || circular ? [] : [padding({ all: contentPadding })]),
          ...(circular
            ? [frame({ width: labelMinHeight, height: labelMinHeight })]
            : [frame({ maxWidth: fullWidth ? Infinity : undefined, minHeight: labelMinHeight })]),
          // Include empty artwork slots and spacing in the native button's tap area.
          contentShape(circular ? shapes.circle() : shapes.rectangle()),
        ]}
      >
        <IconColorContext.Provider value={labelColor}>
          {children ?? <Text>{label ?? ''}</Text>}
        </IconColorContext.Provider>
      </VStack>
    </Button>
  );
}
