import {
  OtpBottomSheet,
  UniversalButton,
  UniversalText,
  type OtpBottomSheetProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { NativeStoryFrame } from '../../components/native-story-frame';

// Isolate fixture copy without changing the user's saved/app language.
const previewI18n = i18n.cloneInstance({ lng: 'en', initAsync: false });

type DemoProps = Pick<OtpBottomSheetProps, 'colorScheme' | 'resendCooldownSeconds'> & {
  recipient?: string;
  requestFailure?: boolean;
  resendFailure?: boolean;
  changeCooldownOnVerify?: boolean;
};

function OtpDemo({
  colorScheme = 'light',
  resendCooldownSeconds = 0,
  requestFailure,
  resendFailure,
  changeCooldownOnVerify,
  recipient = 'hello@example.com',
}: Readonly<DemoProps>) {
  const [open, setOpen] = useState(false);
  const [resends, setResends] = useState(0);
  const [cooldownOverride, setCooldownOverride] = useState<number>();
  return (
    <View style={{ gap: 16 }}>
      <UniversalButton
        variant="primary"
        label="Open OTP sheet"
        testID="otp-demo-open"
        colorScheme={colorScheme}
        onPress={() => setOpen(true)}
      />
      <UniversalText
        testID="otp-demo-state"
        colorScheme={colorScheme}
      >{`Sheet: ${open ? 'Open' : 'Closed'} · Resends: ${resends}`}</UniversalText>
      <OtpBottomSheet
        isPresented={open}
        onDismiss={() => setOpen(false)}
        colorScheme={colorScheme}
        recipient={recipient}
        hint="Preview code: 123456"
        resendCooldownSeconds={cooldownOverride ?? resendCooldownSeconds}
        onVerify={async (code) => {
          if (changeCooldownOnVerify) {
            setCooldownOverride((seconds) => (seconds ?? resendCooldownSeconds) + 1);
          }
          await new Promise((resolve) => setTimeout(resolve, 650));
          if (requestFailure) throw new Error('Preview request failure');
          return code === '123456';
        }}
        onResend={async () => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          if (resendFailure) throw new Error('Preview resend failure');
          setResends((count) => count + 1);
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Forms/OTP',
  component: OtpDemo,
  parameters: {
    docs: {
      description: {
        component:
          'Six-slot native OTP entry with the shared animated verification face. Verify 123456 for a smile; any other complete code gives error feedback and a frown. Successful resend confirms once; failed requests give error feedback. Incomplete input, pending/duplicate submissions and cooldown taps stay silent. Dismiss during a request to check late completion stays silent. Reopening and typing digits must not request haptics.',
      },
    },
  },
  args: {
    colorScheme: 'light',
    resendCooldownSeconds: 0,
    requestFailure: false,
    resendFailure: false,
    changeCooldownOnVerify: false,
    recipient: 'hello@example.com',
  },
  argTypes: {
    resendCooldownSeconds: { control: 'number' },
    requestFailure: { control: 'boolean' },
    resendFailure: { control: 'boolean' },
    recipient: { control: 'text' },
    changeCooldownOnVerify: { control: 'boolean' },
  },
  decorators: [
    (Story, { args }) => (
      <I18nextProvider i18n={previewI18n}>
        <NativeStoryFrame colorScheme={args.colorScheme}>
          <Story />
        </NativeStoryFrame>
      </I18nextProvider>
    ),
  ],
  render: (args) => (
    <OtpDemo
      key={`${args.recipient}-${args.resendCooldownSeconds}-${args.changeCooldownOnVerify}`}
      {...args}
    />
  ),
} satisfies Meta<typeof OtpDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
