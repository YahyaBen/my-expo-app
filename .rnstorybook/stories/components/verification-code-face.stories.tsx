import type { Meta, StoryObj } from '@storybook/react-native';
import { VerificationCodeFace } from '@components/ui';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';

function VerificationCodeFaceDemo(args: AnimatedComponentPreviewProps) {
  return (
    <AnimatedComponentPreview {...args}>
      <VerificationCodeFace />
    </AnimatedComponentPreview>
  );
}

const meta = {
  title: 'Components/Verification Code Face',
  component: VerificationCodeFaceDemo,
  args: { colorScheme: 'light', rtl: false },
  argTypes: { rtl: { control: 'boolean' } },
  parameters: {
    docs: {
      description: {
        component:
          'Enter 1111 for success and another four-digit code for error; reset and enter again. Check native keyboard dismissal, Arabic/Persian digits, RTL and Reduce motion. This demo has no backend.',
      },
    },
  },
} satisfies Meta<typeof VerificationCodeFaceDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
