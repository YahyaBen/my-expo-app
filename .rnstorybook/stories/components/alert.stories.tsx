import { Alert, type AlertProps, Button, UniversalText } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { NativeStoryFrame } from '../../components/native-story-frame';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';

function AlertDemo({
  variant,
  message,
  title,
  colorScheme,
  direction = 'ltr',
}: Readonly<Omit<AlertProps, 'onDismiss'> & { direction?: 'ltr' | 'rtl' }>) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState(0);
  const [dismissals, setDismissals] = useState(0);
  const dismiss = useCallback(() => {
    setVisible(false);
    setDismissals((count) => count + 1);
  }, []);
  return (
    <LayoutDirectionProvider initialDirection={direction}>
      <NativeStoryFrame colorScheme={colorScheme}>
        <View style={{ gap: 16 }}>
          <Button
            variant="secondary"
            testID="alert-story-show"
            label="Show alert"
            colorScheme={colorScheme}
            disabled={visible}
            onPress={() => {
              setShown((count) => count + 1);
              setVisible(true);
            }}
          />
          <UniversalText testID="alert-story-state" colorScheme={colorScheme}>
            {`State: ${visible ? 'Visible' : 'Hidden'}. Dismissals: ${dismissals}`}
          </UniversalText>
          {visible && (
            <Alert
              key={shown}
              variant={variant}
              title={title}
              message={message}
              onDismiss={dismiss}
              colorScheme={colorScheme}
            />
          )}
        </View>
      </NativeStoryFrame>
    </LayoutDirectionProvider>
  );
}

const meta = {
  title: 'Components/Alert',
  component: AlertDemo,
  parameters: {
    docs: {
      description: {
        component:
          'Variants use semantic theme accents: error red, success green, warning amber and info blue. The Host supplies native tint; Android also colors the title and OK action explicitly. iOS keeps its system alert surface and text styling. Success, warning and error request matching haptics once; info and acknowledgment stay silent.',
      },
    },
  },
  args: {
    variant: 'error',
    message: 'The email, username, or password is incorrect.',
    colorScheme: 'dark',
  },
  argTypes: {
    message: { control: 'text' },
    title: { control: 'text' },
    variant: { control: 'select', options: ['error', 'success', 'warning', 'info'] },
    direction: { control: 'select', options: ['ltr', 'rtl'] },
  },
  render: (args) => (
    <AlertDemo
      key={`${args.variant}-${args.title}-${args.message}-${args.colorScheme}-${args.direction}`}
      {...args}
    />
  ),
} satisfies Meta<typeof AlertDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
