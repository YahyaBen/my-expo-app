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
  length?: number;
  faceSize?: number;
  disabled?: boolean;
  initialValue?: string;
  initialStatus?: VerificationCodeFaceStatus;
};

function VerificationCodeFaceDemo({
  length = 4,
  faceSize = 96,
  disabled = false,
  initialValue = '',
  initialStatus = 'default',
  ...preview
}: Readonly<DemoProps>) {
  return (
    <AnimatedComponentPreview {...preview}>
      <CodeEntry
        key={`${length}-${initialValue}-${initialStatus}`}
        length={length}
        faceSize={faceSize}
        disabled={disabled}
        initialValue={initialValue}
        initialStatus={initialStatus}
      />
    </AnimatedComponentPreview>
  );
}

function CodeEntry({
  length,
  faceSize,
  disabled,
  initialValue,
  initialStatus,
}: Readonly<
  Required<Pick<DemoProps, 'length' | 'faceSize' | 'disabled' | 'initialValue' | 'initialStatus'>>
>) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState(initialStatus);
  const [completions, setCompletions] = useState(0);

  return (
    <Column spacing={spacing.md}>
      <UniversalTextContent>{`Enter ${'1'.repeat(length)} for success.`}</UniversalTextContent>
      <VerificationCodeFace
        value={value}
        onChangeText={(next) => {
          setValue(next);
          setStatus('default');
        }}
        onComplete={(code) => {
          // Only this fixture knows the example code; real consumers can validate remotely.
          setStatus(code === '1'.repeat(length) ? 'success' : 'error');
          setCompletions((count) => count + 1);
        }}
        length={length}
        faceSize={faceSize}
        disabled={disabled}
        status={status}
        label={`${length}-digit code`}
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
  args: { colorScheme: 'light', rtl: false, length: 4, faceSize: 96, disabled: false },
  argTypes: {
    rtl: { control: 'boolean' },
    length: { control: { type: 'number', min: 1, max: 8 } },
    faceSize: { control: { type: 'number', min: 48, max: 144 } },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A controlled value, caller-owned validation and event-only completion callback. Enter the displayed code; compare six digits, externally supplied error and disabled state. Check Arabic/Persian/full-width digits, Reset, keyboard dismissal, RTL and Reduce motion.',
      },
    },
  },
} satisfies Meta<typeof VerificationCodeFaceDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
export const SixDigits: Story = { args: { length: 6, faceSize: 120 } };
export const Rejected: Story = { args: { initialValue: '2468', initialStatus: 'error' } };
export const Disabled: Story = { args: { initialValue: '1234', disabled: true } };
