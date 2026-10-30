import { LaunchScreen, PageMotionOverlay, UniversalButton, UniversalText } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import { ThemePreferencesProvider, useThemePreferences } from '@/context/theme.context';
import { getAppBrand } from '@/config/brand';
import { useThemeColors } from '@/hooks/use-theme';

function LaunchEdgeDemo({ colorScheme }: Readonly<{ colorScheme: 'light' | 'dark' }>) {
  const colors = useThemeColors(colorScheme);
  return (
    <View testID="launch-edge-preview" style={{ flex: 1, backgroundColor: colors.surfaceVariant }}>
      <View
        testID="launch-edge-preview-body"
        style={{ height: 160, backgroundColor: colors.background }}
      />
      <PageMotionOverlay variant="splash" colorScheme={colorScheme} animate={false} />
      <UniversalText colorScheme={colorScheme}>
        The background should join the front wave without a gap; the lower wave uses theme colors.
      </UniversalText>
    </View>
  );
}

function LaunchDemo({
  reducedMotion = false,
  waiting = false,
  mode = 'branded',
}: Readonly<{
  reducedMotion?: boolean;
  waiting?: boolean;
  mode?: 'minimal' | 'branded';
}>) {
  const [presented, setPresented] = useState(true);
  const brand = getAppBrand();
  const preferences = useThemePreferences();
  const finish = useCallback(() => setPresented(false), []);
  return (
    <ThemePreferencesProvider
      key={String(reducedMotion)}
      initialTheme={preferences?.themeId}
      initialColorScheme={preferences?.colorScheme ?? 'light'}
      initialReducedMotion={reducedMotion}
    >
      <View style={{ flex: 1 }}>
        <UniversalText testID="launch-preview-brand">{brand.name}</UniversalText>
        <UniversalButton
          variant="secondary"
          label="Replay launch"
          testID="launch-preview-replay"
          onPress={() => setPresented(true)}
        />
        {presented ? <LaunchScreen mode={mode} exiting={!waiting} onExitComplete={finish} /> : null}
      </View>
    </ThemePreferencesProvider>
  );
}

const meta = {
  title: 'Components/Launch Screen',
  component: LaunchDemo,
  args: {
    reducedMotion: false,
    waiting: false,
    mode: 'branded',
    colorScheme: 'light',
    example: 'launch',
  },
  argTypes: {
    mode: { control: 'select', options: ['minimal', 'branded'] },
    waiting: { control: 'boolean' },
    reducedMotion: { control: 'boolean' },
    example: { control: 'select', options: ['launch', 'bottom-edge'] },
  },

  render: ({ example, colorScheme, ...args }) =>
    example === 'bottom-edge' ? (
      <LaunchEdgeDemo colorScheme={colorScheme} />
    ) : (
      <LaunchDemo key={`${args.mode}-${args.reducedMotion}`} {...args} />
    ),
} satisfies Meta<
  React.ComponentProps<typeof LaunchDemo> & { colorScheme: 'light' | 'dark' } & {
    example: 'launch' | 'bottom-edge';
  }
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
