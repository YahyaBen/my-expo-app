import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import {
  Column,
  UniversalTextContent,
  VerificationCodeFace,
  type VerificationCodeFaceStatus,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';

type DemoProps = AnimatedComponentPreviewProps & {
  faceSize?: number;
  disabled?: boolean;
  initialValue?: string;
  initialStatus?: VerificationCodeFaceStatus;
};

function VerificationCodeFaceDemo({
  faceSize = 96,
  disabled = false,
  initialValue = '',
  initialStatus = 'default',
  ...preview
}: Readonly<DemoProps>) {
  return (
    <AnimatedComponentPreview {...preview}>
      <CodeEntry
        key={`${initialValue}-${initialStatus}`}
        faceSize={faceSize}
        disabled={disabled}
        initialValue={initialValue}
        initialStatus={initialStatus}
      />
    </AnimatedComponentPreview>
  );
}

function CodeEntry({
  faceSize,
  disabled,
  initialValue,
  initialStatus,
}: Readonly<
  Required<Pick<DemoProps, 'faceSize' | 'disabled' | 'initialValue' | 'initialStatus'>>
>) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState(initialStatus);
  const [completions, setCompletions] = useState(0);

  return (
    <Column spacing={spacing.md}>
      <UniversalTextContent>Enter 123456 for success.</UniversalTextContent>
      <VerificationCodeFace
        value={value}
        onChangeText={(next) => {
          setValue(next);
          setStatus('default');
        }}
        onComplete={(code) => {
          // Only this fixture knows the example code; real consumers can validate remotely.
          setStatus(code === '123456' ? 'success' : 'error');
          setCompletions((count) => count + 1);
        }}
        faceSize={faceSize}
        disabled={disabled}
        status={status}
        label="6-digit code"
        resetLabel="Reset code"
        helperText={
          status === 'success'
            ? 'Code accepted.'
            : status === 'error'
              ? 'Code rejected.'
              : undefined
        }
        testID="verification-face-story"
      />
      <UniversalTextContent testID="verification-face-story-completions">
        {`Completed entries: ${completions}`}
      </UniversalTextContent>
    </Column>
  );
}

const meta = {
  title: 'Components/Verification Code Face',
  component: VerificationCodeFaceDemo,
  args: {
    colorScheme: 'light',
    rtl: false,
    faceSize: 96,
    disabled: false,
    initialValue: '',
    initialStatus: 'default',
  },
  argTypes: {
    rtl: { control: 'boolean' },
    faceSize: { control: { type: 'number', min: 48, max: 144 } },
    disabled: { control: 'boolean' },
    initialValue: { control: 'text' },
    initialStatus: { control: 'select', options: ['default', 'success', 'error'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Uses the same six-slot native OTP input and animated face as the OTP bottom sheet. Enter 123456 for success; completion fires only after a new six-digit edit. Check paste/autofill, Arabic/Persian/full-width digits, Reset, keyboard dismissal, error/disabled states, RTL and Reduce motion.',
      },
    },
  },
} satisfies Meta<typeof VerificationCodeFaceDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Error: Story = {
  args: { initialValue: '654321', initialStatus: 'error' },
};

export const Disabled: Story = {
  args: { initialValue: '123', disabled: true },
};
