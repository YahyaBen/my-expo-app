import type { NativeStoryTheme } from '../../components/native-story-frame';
import { useScreenRefresh } from '@/hooks/use-screen-refresh';
import {
  Column,
  RefreshableScrollView,
  Text,
  ButtonContent,
  UniversalHost,
  nativeFillWidth,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

type Props = NativeStoryTheme & {
  disabled: boolean;
  hidden: boolean;
  outcome: 'success' | 'error';
  itemCount: number;
  layoutDirection: 'leftToRight' | 'rightToLeft';
};

const refreshCountKey = ['storybook', 'refresh-count'] as const;

function RefreshDemo(props: Readonly<Props>) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <RefreshDemoContent {...props} />
    </QueryClientProvider>
  );
}

function RefreshDemoContent({
  colorScheme,
  seedColor,
  disabled,
  hidden,
  outcome,
  itemCount,
  layoutDirection,
}: Readonly<Props>) {
  const completion = useRef<(() => void) | null>(null);
  useEffect(() => () => completion.current?.(), []);

  const {
    data: count,
    isFetching,
    isRefetchError,
  } = useQuery({
    queryKey: refreshCountKey,
    initialData: 0,
    staleTime: Infinity,
    retry: false,
    networkMode: 'always',
    queryFn: async ({ client }) => {
      await new Promise<void>((resolve) => {
        completion.current = resolve;
      });
      completion.current = null;
      if (outcome === 'error') throw new Error('Preview refresh failure');
      return (client.getQueryData<number>(refreshCountKey) ?? 0) + 1;
    },
  });
  const onRefresh = useScreenRefresh([refreshCountKey]);
  let status = 'Pull down to refetch the counter.';
  if (isFetching) {
    status = 'Refreshing. Press Complete refresh to settle the work.';
  } else if (isRefetchError) {
    status = 'Refresh failed. Saved content is retained. Pull again to retry.';
  } else if (count > 0) {
    status = 'Refresh complete. Pull again to repeat.';
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
          <ButtonContent
            variant="primary"
            label="Complete refresh"
            testID="refresh-demo-complete"
            disabled={!isFetching}
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
          onRefresh={onRefresh}
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
