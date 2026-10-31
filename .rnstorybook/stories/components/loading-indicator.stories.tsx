import { Column, LoadingIndicator, Text, UniversalHost } from '@components/ui';
import type { LoadingIndicatorProps, UniversalThemeProps } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';

type Props = LoadingIndicatorProps & UniversalThemeProps;

function LoadingIndicatorDemo({ colorScheme, seedColor, ...props }: Readonly<Props>) {
  return (
    <UniversalHost colorScheme={colorScheme} seedColor={seedColor}>
      <Column spacing={16} alignment="center" style={{ padding: 24 }}>
        <LoadingIndicator {...props} />
        <Text>Expressive uses morphing shapes on Android and a native spinner on iOS.</Text>
      </Column>
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Loading Indicator',
  component: LoadingIndicatorDemo,
  args: {
    variant: 'expressive',
    colorScheme: 'dark',
    accessibilityLabel: 'Loading preview',
    testID: 'loading-indicator-demo',
  },
  argTypes: {
    variant: { control: 'select', options: ['circular', 'expressive'] },
    color: { control: 'color' },
    seedColor: { control: 'color' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
  },
} satisfies Meta<typeof LoadingIndicatorDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
