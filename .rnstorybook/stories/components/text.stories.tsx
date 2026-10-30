import { UniversalText } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { NativeStoryFrame } from '../../components/native-story-frame';
import TextScreen from '../../components/catalog/text-preview';

const meta = {
  title: 'Components/Text',
  component: UniversalText,
  args: {
    testID: 'expo-ui-text',
    children: 'Make every word count',
    variant: 'heading',
    colorScheme: 'dark',
    tone: 'default',
    example: 'text',
  },
  argTypes: {
    children: { control: 'text' },
    variant: {
      control: 'select',
      options: [undefined, 'heading', 'title', 'subtitle', 'body', 'label', 'caption'],
    },
    tone: {
      control: 'select',
      options: ['default', 'muted', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
    fontWeight: {
      control: 'select',
      options: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900'],
    },
    fontSize: { control: { type: 'number', min: 10, max: 72, step: 1 } },
    lightColor: { control: 'color' },
    darkColor: { control: 'color' },
    example: { control: 'select', options: ['text', 'theme-comparison'] },
  },
  render: ({ example, ...args }) =>
    example === 'theme-comparison' ? (
      <TextScreen />
    ) : (
      <NativeStoryFrame colorScheme={args.colorScheme} testID={args.testID}>
        <UniversalText {...args} />
      </NativeStoryFrame>
    ),

  parameters: { controls: { exclude: /^(testID|modifiers|ref|on[A-Z].*)$/ } },
} satisfies Meta<
  React.ComponentProps<typeof UniversalText> & { example: 'text' | 'theme-comparison' }
>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
