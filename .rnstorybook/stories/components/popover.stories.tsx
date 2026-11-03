import type { NativeStoryTheme } from '../../components/native-story-frame';
import { Column, Popover, Text, ButtonContent, UniversalHost } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { action } from 'storybook/actions';

type Props = NativeStoryTheme & {
  label: string;
  disabled: boolean;
  layoutDirection: 'leftToRight' | 'rightToLeft';
};

function PopoverDemo({
  colorScheme,
  seedColor,
  label,
  disabled,
  layoutDirection,
}: Readonly<Props>) {
  const [isPresented, setIsPresented] = useState(false);
  const [count, setCount] = useState(0);
  return (
    <UniversalHost
      colorScheme={colorScheme}
      seedColor={seedColor}
      layoutDirection={layoutDirection}
    >
      <Column spacing={16} alignment="center" style={{ padding: 24 }}>
        <Popover
          testID="popover-demo"
          isPresented={isPresented}
          onIsPresentedChange={(next) => {
            setIsPresented(next);
            action('popover changed')(next);
          }}
          trigger={
            <ButtonContent
              variant="primary"
              label={label}
              disabled={disabled}
              testID="popover-demo-trigger"
              onPress={() => setIsPresented(true)}
            />
          }
        >
          <Column spacing={16} style={{ padding: 16, width: 240 }}>
            <Text>Anchored native content</Text>
            <Text testID="popover-demo-count">{`Actions: ${count}`}</Text>
            <ButtonContent
              variant="primary"
              label="Add one"
              testID="popover-demo-increment"
              onPress={() => setCount((previous) => previous + 1)}
            />
            <ButtonContent
              label="Close"
              variant="secondary"
              testID="popover-demo-close"
              onPress={() => setIsPresented(false)}
            />
          </Column>
        </Popover>
        <Text testID="popover-demo-state">{isPresented ? 'Open' : 'Closed'}</Text>
      </Column>
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Popover',
  component: PopoverDemo,
  args: {
    label: 'Show details',
    disabled: false,
    colorScheme: 'dark',
    layoutDirection: 'leftToRight',
  },
  argTypes: {
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    layoutDirection: { control: 'select', options: ['leftToRight', 'rightToLeft'] },
    seedColor: { control: 'color' },
  },
} satisfies Meta<typeof PopoverDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
