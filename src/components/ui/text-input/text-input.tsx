import { spacing } from '@/constants/layout';
import { useAppTheme } from '@/hooks/use-theme';
import {
  Column,
  Row,
  TextInput as ExpoTextInput,
  useNativeState,
  type TextInputProps as ExpoTextInputProps,
} from '@expo/ui';
import { useEffect, useRef, useState } from 'react';
import { useHostColorScheme } from '../host/universal-host';
import { Icon, type IconProps } from '../icon/icon';
import { nativeFillWidth, nativeRowWeight } from '../native/native-fill-width';
import { UniversalTextContent as Text } from '../text/universal-text';
import {
  inputAccessibilityModifiers,
  inputFieldAppearance,
  inputRowFlex,
  TextInputIconButton,
} from './text-input-native';

export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface TextInputProps extends Omit<ExpoTextInputProps, 'value'> {
  /** Controlled text. Native observable state is managed by this component. */
  value?: string;
  label?: string;
  helperText?: string;
  status?: InputStatus;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark';
  /** Leading icon (mirrors in RTL). Use Icon.select({ ios, android }). */
  leftIcon?: IconProps['name'];
  /** Trailing icon/action (mirrors in RTL). */
  rightIcon?: IconProps['name'];
  onRightIconPress?: () => void;
  /** Supply a screen-reader action label whenever onRightIconPress is set. */
  rightIconAccessibilityLabel?: string;
  palette?: {
    text: string;
    muted: string;
    tint: string;
    surface: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    selection?: string;
  };
}

/** Shared native input; compose inside an existing UniversalHost. */
export function TextInput({
  value,
  defaultValue,
  label,
  helperText,
  status = 'default',
  disabled = false,
  colorScheme,
  palette,
  editable,
  readOnly,
  onFocus,
  onBlur,
  onChangeText,
  style,
  textStyle,
  leftIcon,
  rightIcon,
  onRightIconPress,
  rightIconAccessibilityLabel,
  ...inputProps
}: Readonly<TextInputProps>) {
  const nativeValue = useNativeState(value ?? defaultValue ?? '');
  const [editRevision, setEditRevision] = useState(0);
  useEffect(() => {
    // Reconcile every controlled edit, including characters the parent rejects
    // without changing its value. Uncontrolled edits remain entirely native.
    if (value !== undefined && nativeValue.get() !== value) nativeValue.set(value);
  }, [nativeValue, value, editRevision]);
  const scheme = useHostColorScheme(colorScheme);
  const focusedRef = useRef(false);
  const [focused, setFocused] = useState(false);
  const { colors: themeColors, design } = useAppTheme(scheme);
  const colors = palette ?? themeColors;
  const semanticColor = status === 'default' ? undefined : colors[status];
  const contentStyle = { opacity: disabled ? 0.5 : 1 };
  const iconStyle = { width: 20, height: 20, ...contentStyle };
  const fieldAppearance = inputFieldAppearance({
    paddingHorizontal: style?.paddingHorizontal ?? style?.padding ?? spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: design.shape.inputRadius,
    borderWidth: 1,
    borderColor: semanticColor ?? (focused && !disabled ? colors.tint : colors.border),
    ...style,
  });
  const input = (
    <ExpoTextInput
      {...inputProps}
      value={nativeValue}
      onChangeText={(text) => {
        if (value !== undefined) setEditRevision((revision) => revision + 1);
        onChangeText?.(text);
      }}
      modifiers={[
        ...inputRowFlex,
        ...inputAccessibilityModifiers(label),
        ...(inputProps.modifiers ?? []),
      ]}
      readOnly={readOnly}
      editable={disabled ? false : editable}
      placeholderTextColor={inputProps.placeholderTextColor ?? colors.muted}
      cursorColor={inputProps.cursorColor ?? palette?.tint}
      selectionColor={inputProps.selectionColor ?? palette?.selection}
      selectionHandleColor={inputProps.selectionHandleColor ?? palette?.tint}
      onFocus={() => {
        if (focusedRef.current) return;
        focusedRef.current = true;
        setFocused(true);
        onFocus?.();
      }}
      onBlur={() => {
        // Compose reports its initial unfocused state when the input mounts.
        if (!focusedRef.current) return;
        focusedRef.current = false;
        setFocused(false);
        onBlur?.();
      }}
      style={contentStyle}
      textStyle={{ color: colors.text, ...textStyle }}
    />
  );

  return (
    <Column
      spacing={spacing.sm}
      modifiers={style?.width === undefined ? nativeFillWidth : undefined}
      style={{ width: style?.width }}
    >
      {label ? (
        <Text
          variant="label"
          testID={inputProps.testID ? `${inputProps.testID}-label` : undefined}
          textStyle={{ color: colors.text }}
        >
          {label}
        </Text>
      ) : null}
      {/* Keep the field surface and border outside the disabled content opacity. */}
      <Row
        alignment="center"
        spacing={spacing.sm}
        style={fieldAppearance.style}
        modifiers={fieldAppearance.modifiers}
      >
        {leftIcon != null ? (
          <Icon
            name={leftIcon}
            size={20}
            color={colors.muted}
            style={iconStyle}
            testID={inputProps.testID ? `${inputProps.testID}-left-icon` : undefined}
          />
        ) : null}
        {input}
        {rightIcon != null ? (
          onRightIconPress ? (
            <TextInputIconButton
              disabled={disabled}
              onPress={disabled ? undefined : onRightIconPress}
              accessibilityLabel={rightIconAccessibilityLabel}
              testID={inputProps.testID ? `${inputProps.testID}-right-icon` : undefined}
            >
              <Icon name={rightIcon} size={20} color={colors.tint} style={iconStyle} />
            </TextInputIconButton>
          ) : (
            <Icon
              name={rightIcon}
              size={20}
              color={colors.muted}
              style={iconStyle}
              testID={inputProps.testID ? `${inputProps.testID}-right-icon` : undefined}
            />
          )
        ) : null}
      </Row>
      {helperText ? (
        <Row spacing={spacing.sm} modifiers={nativeFillWidth}>
          {status === 'error' ? (
            <Icon
              name={Icon.select({ ios: 'exclamationmark.circle', android: 'error_outline' })}
              size={18}
              color={colors.error}
            />
          ) : null}
          <Text
            variant="caption"
            modifiers={nativeRowWeight}
            testID={inputProps.testID ? `${inputProps.testID}-helper` : undefined}
            textStyle={{ color: semanticColor ?? colors.muted }}
          >
            {helperText}
          </Text>
        </Row>
      ) : null}
    </Column>
  );
}
