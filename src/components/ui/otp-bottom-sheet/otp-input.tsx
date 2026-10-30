import { useLayoutEffect, useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import { Column, RNHostView, Spacer, useNativeState, type TextInputProps } from '@expo/ui';
import { onSizeChanged } from '@expo/ui/jetpack-compose/modifiers';
import { onGeometryChange } from '@expo/ui/swift-ui/modifiers';
import { radii, spacing } from '@/constants/layout';
import { useMeasuredWidth } from '@/hooks/use-measured-width';
import { useThemeColors } from '@/hooks/use-theme';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { nativeFillWidth } from '../native/native-fill-width';
import { UniversalTextContent } from '../text/universal-text';
import { OtpInputLayout } from './otp-input-layout';

export const OTP_LENGTH = 6;

/** Accept pasted separators and the numeric scripts used by our supported locales. */
export function normalizeOtpCode(value: string) {
  return value
    .replace(/[\u0660-\u0669\u06f0-\u06f9\uff10-\uff19]/g, (digit) => {
      const point = digit.charCodeAt(0);
      const zero = point >= 0xff10 ? 0xff10 : point >= 0x06f0 ? 0x06f0 : 0x0660;
      return String(point - zero);
    })
    .replace(/[^0-9]/g, '')
    .slice(0, OTP_LENGTH);
}

type OtpInputProps = {
  ref?: TextInputProps['ref'];
  value: string;
  onChangeText: (code: string) => void;
  label: string;
  disabled?: boolean;
  error?: boolean;
  onSubmitEditing?: () => void;
  testID: string;
};

/** One native field and six decorative slots, shared by the face and sheet. */
export function OtpInput({
  ref,
  value,
  onChangeText,
  label,
  disabled = false,
  error = false,
  onSubmitEditing,
  testID,
}: Readonly<OtpInputProps>) {
  const scheme = useHostColorScheme();
  const colors = useThemeColors(scheme);
  const { fontScale } = useWindowDimensions();
  const code = normalizeOtpCode(value);
  const nativeValue = useNativeState(code);
  const [editRevision, setEditRevision] = useState(0);
  const [focused, setFocused] = useState(false);
  const [width, setWidth] = useMeasuredWidth();
  const measureWidth = ({ width: nextWidth }: { width: number }) => {
    if (nextWidth > 0) setWidth(nextWidth);
  };
  const inputSizing =
    Platform.OS === 'ios' ? onGeometryChange(measureWidth) : onSizeChanged(measureWidth);
  const inputHeight = Math.max(64, Math.ceil(35 * fontScale + 24));
  const slotWidth = Math.max(5, (width - spacing.sm * (OTP_LENGTH - 1)) / OTP_LENGTH);

  useLayoutEffect(() => {
    // Reconcile resets and rejected edits without rewriting unchanged native text.
    if (nativeValue.get() !== code) nativeValue.set(code);
  }, [code, nativeValue, editRevision]);

  return (
    <Column modifiers={[...nativeFillWidth, inputSizing]}>
      {/* An explicit-width direction bridge keeps digits LTR inside Arabic content. */}
      {width > 0 && (
        <RNHostView matchContents>
          <UniversalHost
            colorScheme={scheme}
            layoutDirection="leftToRight"
            ignoreSafeArea="all"
            style={{ width }}
          >
            <OtpInputLayout
              accessibilityLabel={label}
              height={inputHeight}
              input={{
                ref,
                value: nativeValue,
                onChangeText: (text) => {
                  setEditRevision((revision) => revision + 1);
                  if (disabled) return;
                  const next = normalizeOtpCode(text);
                  if (next !== text) nativeValue.set(next);
                  if (next !== code) onChangeText(next);
                },
                onFocus: () => setFocused(true),
                onBlur: () => setFocused(false),
                keyboardType: 'number-pad',
                autoComplete: 'one-time-code',
                autoCorrect: false,
                autoCapitalize: 'none',
                caretHidden: true,
                maxLength: 32,
                editable: !disabled,
                onSubmitEditing,
                testID: `${testID}-input`,
              }}
              slots={Array.from({ length: OTP_LENGTH }, (_, index) => {
                const active =
                  focused && !disabled && index === Math.min(code.length, OTP_LENGTH - 1);
                const filled = index < code.length;
                const borderWidth = active ? 3 : error ? 2 : 1;
                const borderColor = error ? colors.error : active ? colors.text : colors.border;
                const backgroundColor = error ? colors.errorContainer : colors.surfaceVariant;
                return (
                  <Column
                    key={index}
                    testID={`${testID}-slot-${index}`}
                    alignment="center"
                    spacing={spacing.none}
                    style={{
                      width: slotWidth,
                      height: inputHeight,
                      padding: borderWidth,
                      borderRadius: radii.control,
                      backgroundColor: borderColor,
                    }}
                  >
                    {/* Inset fills preserve rounded borders on SwiftUI as well as Compose. */}
                    <Column
                      alignment="center"
                      spacing={spacing.none}
                      style={{
                        width: slotWidth - borderWidth * 2,
                        height: inputHeight - borderWidth * 2,
                        borderRadius: radii.control - borderWidth,
                        backgroundColor,
                        opacity: disabled ? 0.5 : 1,
                      }}
                    >
                      <Spacer flexible size={0} />
                      <UniversalTextContent
                        fontSize={28}
                        fontWeight="400"
                        textStyle={{
                          textAlign: 'center',
                          color: error
                            ? colors.onErrorContainer
                            : filled
                              ? colors.text
                              : colors.muted,
                        }}
                      >
                        {code[index] ?? ''}
                      </UniversalTextContent>
                      <Spacer flexible size={0} />
                    </Column>
                  </Column>
                );
              })}
            />
          </UniversalHost>
        </RNHostView>
      )}
    </Column>
  );
}
