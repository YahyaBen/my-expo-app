import { spacing } from '@/constants/layout';
import { Row, TextInput } from '@expo/ui';
import { ZStack } from '@expo/ui/swift-ui';
import {
  accessibilityHidden,
  accessibilityLabel,
  contentShape,
  frame,
  shapes,
  textFieldStyle,
} from '@expo/ui/swift-ui/modifiers';
import type { OtpInputLayoutProps } from './otp-input-layout';

/** The native field stays above the decorative slots and owns the whole tap target. */
export function OtpInputLayout({
  slots,
  input,
  accessibilityLabel: label,
  height,
}: Readonly<OtpInputLayoutProps>) {
  return (
    <ZStack modifiers={[frame({ height }), frame({ maxWidth: Infinity })]}>
      <Row
        spacing={spacing.sm}
        modifiers={[frame({ maxWidth: Infinity }), accessibilityHidden(true)]}
      >
        {slots}
      </Row>
      <TextInput
        {...input}
        modifiers={[
          textFieldStyle('plain'),
          frame({ height }),
          frame({ maxWidth: Infinity }),
          contentShape(shapes.rectangle()),
          accessibilityLabel(label),
        ]}
        style={{ backgroundColor: 'transparent' }}
        textStyle={{ fontSize: 28, color: 'transparent' }}
      />
    </ZStack>
  );
}
