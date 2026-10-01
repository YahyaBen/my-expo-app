import { Column, Host, Text, TextInput, type TextInputProps } from '@expo/ui';
import { useState } from 'react';
import { useColorScheme, View } from 'react-native';

export type InputStatus = 'default' | 'error' | 'success' | 'warning';

export interface UniversalTextInputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  status?: InputStatus;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark';
  /** Observes touches on the input container without intercepting native focus. */
  onPress?: () => void;
}

const statusColors = { error: '#E26772', success: '#39B58D', warning: '#E5AD49' };

/** Native Expo UI field; value and selection retain the observable-state API. */
export function UniversalTextInput({
  label,
  helperText,
  status = 'default',
  disabled = false,
  colorScheme,
  editable,
  readOnly,
  onFocus,
  onBlur,
  onPress,
  style,
  textStyle,
  ...inputProps
}: UniversalTextInputProps) {
  const systemScheme = useColorScheme();
  const scheme = colorScheme ?? systemScheme ?? 'light';
  const [focused, setFocused] = useState(false);
  const [containerWidth, setContainerWidth] = useState(0);
  const dark = scheme === 'dark';
  const foreground = dark ? '#DBEDF4' : '#173C65';
  const muted = dark ? '#98AEC2' : '#526C82';
  const accent = dark ? '#5AB9E8' : '#1674A3';
  const semanticColor = status === 'default' ? undefined : statusColors[status];

  return (
    <View
      pointerEvents={disabled ? 'none' : 'auto'}
      onTouchStart={disabled ? undefined : onPress}
      onLayout={({ nativeEvent }) => setContainerWidth(Math.round(nativeEvent.layout.width))}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {containerWidth > 0 ? (
      <Host matchContents={{ vertical: true }} colorScheme={scheme} style={{ width: '100%' }}>
        <Column spacing={8} style={{ width: containerWidth }}>
          {label ? <Text textStyle={{ fontSize: 14, fontWeight: '600', color: foreground }}>{label}</Text> : null}
          <TextInput
            {...inputProps}
            readOnly={readOnly}
            editable={disabled ? false : editable}
            placeholderTextColor={inputProps.placeholderTextColor ?? muted}
            cursorColor={inputProps.cursorColor ?? accent}
            onFocus={() => { setFocused(true); onFocus?.(); }}
            onBlur={() => { setFocused(false); onBlur?.(); }}
            style={{
              width: containerWidth,
              paddingHorizontal: 14,
              paddingVertical: 14,
              backgroundColor: dark ? '#101F34' : '#FFFFFF',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: semanticColor ?? (focused ? accent : dark ? '#3E556E' : '#B7C9D9'),
              ...style,
            }}
            textStyle={{ fontSize: 16, color: foreground, ...textStyle }}
          />
          {helperText ? <Text textStyle={{ fontSize: 13, color: semanticColor ?? muted }}>{helperText}</Text> : null}
        </Column>
      </Host>
      ) : null}
    </View>
  );
}
