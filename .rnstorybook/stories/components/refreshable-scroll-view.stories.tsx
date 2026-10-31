import {
  Column,
  RefreshableScrollView,
  Text,
  UniversalButtonContent,
  UniversalHost,
  nativeFillWidth,
  type UniversalThemeProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

type Props = UniversalThemeProps & {
  disabled: boolean;
  hidden: boolean;
  outcome: 'success' | 'error';
  itemCount: number;
  layoutDirection: 'leftToRight' | 'rightToLeft';
};

function RefreshDemo({
  colorScheme,
  seedColor,
  disabled,
  hidden,
  outcome,
  itemCount,
  layoutDirection,
}: Readonly<Props>) {
  const completion = useRef<(() => void) | null>(null);
  const active = useRef(true);
  const [refreshing, setRefreshing] = useState(false);
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('Pull down on the list.');
  useEffect(() => {
    active.current = true;
    return () => {
      active.current = false;
      completion.current?.();
    };
  }, []);

  async function refresh() {
    setRefreshing(true);
    setStatus('Refreshing. Press Complete refresh to settle the work.');
    await new Promise<void>((resolve) => {
      completion.current = resolve;
    });
    completion.current = null;
    if (!active.current) return;
    setRefreshing(false);
    if (outcome === 'error') {
      setStatus('Refresh failed. Saved content is retained. Pull again to retry.');
      throw new Error('Preview refresh failure');
    }
    setCount((previous) => previous + 1);
    setStatus('Refresh complete. Pull again to repeat.');
  }

  return (
    <View style={{ gap: 16 }}>
      <UniversalHost
        colorScheme={colorScheme}
        seedColor={seedColor}
        layoutDirection={layoutDirection}
      >
        <Column spacing={16} style={{ padding: 16 }}>
          <Text testID="refresh-demo-status">{status}</Text>
          <UniversalButtonContent
            variant="primary"
            label="Complete refresh"
            testID="refresh-demo-complete"
            disabled={!refreshing}
            onPress={() => completion.current?.()}
          />
        </Column>
      </UniversalHost>
      <UniversalHost
        colorScheme={colorScheme}
        seedColor={seedColor}
        layoutDirection={layoutDirection}
        viewportHeight={320}
      >
        <RefreshableScrollView
          testID="refresh-demo-scroll"
          disabled={disabled}
          hidden={hidden}
          onRefresh={refresh}
        >
          <Column spacing={16} modifiers={nativeFillWidth} style={{ padding: 24 }}>
            <Text testID="refresh-demo-count">{`Successful refreshes: ${count}`}</Text>
            {Array.from({ length: itemCount }, (_, index) => (
              <Text
                key={index}
                testID={`refresh-demo-item-${index}`}
              >{`Saved item ${index + 1}`}</Text>
            ))}
          </Column>
        </RefreshableScrollView>
      </UniversalHost>
    </View>
  );
}

const meta = {
  title: 'Components/Refreshable Scroll View',
  component: RefreshDemo,
  args: {
    disabled: false,
    hidden: false,
    outcome: 'success',
    itemCount: 16,
    colorScheme: 'dark',
    layoutDirection: 'leftToRight',
  },
  argTypes: {
    outcome: { control: 'select', options: ['success', 'error'] },
    itemCount: { control: { type: 'number', min: 0, max: 30 } },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    layoutDirection: { control: 'select', options: ['leftToRight', 'rightToLeft'] },
    seedColor: { control: 'color' },
  },
} satisfies Meta<typeof RefreshDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
