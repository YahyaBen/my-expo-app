import { useRef } from 'react';
import { Column, type TextInputRef } from '@expo/ui';
import { UniversalButtonContent } from '../button/universal-button';
import { nativeFillWidth } from '../native/native-fill-width';
import { normalizeOtpCode, OTP_LENGTH, OtpInput } from '../otp-bottom-sheet/otp-input';
import { UniversalTextContent } from '../text/universal-text';
import { VerificationFace, type VerificationCodeFaceStatus } from './verification-face';
import { spacing } from '@/constants/layout';

export type { VerificationCodeFaceStatus } from './verification-face';

export type VerificationCodeFaceProps = {
  value: string;
  onChangeText: (value: string) => void;
  label: string;
  /** Validation belongs to the caller; this controls presentation only. */
  status?: VerificationCodeFaceStatus;
  helperText?: string;
  resetLabel?: string;
  faceSize?: number;
  disabled?: boolean;
  /** Called for a new complete six-digit entry, normalized to ASCII. */
  onComplete?: (code: string) => void;
  testID?: string;
};

export function VerificationCodeFace({
  value,
  onChangeText,
  label,
  status = 'default',
  helperText,
  resetLabel,
  faceSize = 96,
  disabled = false,
  onComplete,
  testID = 'verification-code-face',
}: Readonly<VerificationCodeFaceProps>) {
  const inputRef = useRef<TextInputRef>(null);
  const code = normalizeOtpCode(value);

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth} testID={testID}>
      <VerificationFace
        progress={code.length / OTP_LENGTH}
        status={status}
        size={faceSize}
        testID={`${testID}-artwork`}
      />
      <UniversalTextContent variant="label" testID={`${testID}-input-label`}>
        {label}
      </UniversalTextContent>
      <OtpInput
        ref={inputRef}
        value={code}
        onChangeText={(next) => {
          onChangeText(next);
          if (next.length === OTP_LENGTH) {
            inputRef.current?.blur();
            if (next !== code) onComplete?.(next);
          }
        }}
        label={label}
        error={status === 'error'}
        disabled={disabled}
        onSubmitEditing={() => inputRef.current?.blur()}
        testID={testID}
      />
      {helperText ? (
        <UniversalTextContent
          variant="caption"
          tone={status === 'default' ? 'muted' : status}
          testID={`${testID}-input-helper`}
        >
          {helperText}
        </UniversalTextContent>
      ) : null}
      {resetLabel ? (
        <UniversalButtonContent
          variant="secondary"
          label={resetLabel}
          onPress={() => {
            if (disabled) return;
            onChangeText('');
            inputRef.current?.blur();
          }}
          disabled={disabled}
          fullWidth
          testID={`${testID}-reset`}
        />
      ) : null}
    </Column>
  );
}
