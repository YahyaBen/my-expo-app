import { LaunchScreen, UniversalButton, UniversalText } from '@components/ui';
import { LaunchWave } from '@/components/ui/launch-screen/launch-wave';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import {
  ThemePreferencesProvider,
  useAppearancePreferences,
  useThemePalette,
} from '@/context/theme.context';
import { getAppBrand } from '@/config/brand';
import { useThemeColors } from '@/hooks/use-theme';

function LaunchEdgeDemo({
  colorScheme,
  animate,
}: Readonly<{ colorScheme: 'light' | 'dark'; animate: boolean }>) {
  const colors = useThemeColors(colorScheme);
  return (
    <View testID="launch-edge-preview" style={{ flex: 1, backgroundColor: colors.surfaceVariant }}>
      <View
        testID="launch-edge-preview-body"
        style={{ height: 160, backgroundColor: colors.launchWaveBody }}
      />
      <LaunchWave colorScheme={colorScheme} animate={animate} />
      <UniversalText colorScheme={colorScheme}>
        Taller solid waves fill the screen width in portrait and landscape. Enable animation to
        watch their crests roll independently; pause to inspect the launchWave theme colors in light
        and dark appearances. The body and waves should stay joined without a gap.
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
  const palette = useThemePalette();
  const appearance = useAppearancePreferences();
  const finish = useCallback(() => setPresented(false), []);
  return (
    <ThemePreferencesProvider
      key={String(reducedMotion)}
      initialTheme={palette?.themeId}
      initialColorScheme={appearance?.colorScheme ?? 'light'}
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
    animate: false,
  },
  argTypes: {
    mode: { control: 'select', options: ['minimal', 'branded'] },
    waiting: { control: 'boolean' },
    reducedMotion: { control: 'boolean' },
    animate: { control: 'boolean' },
    example: { control: 'select', options: ['launch', 'bottom-edge'] },
  },

  render: ({ example, colorScheme, animate, ...args }) =>
    example === 'bottom-edge' ? (
      <LaunchEdgeDemo colorScheme={colorScheme} animate={animate && !args.reducedMotion} />
    ) : (
      <LaunchDemo key={`${args.mode}-${args.reducedMotion}`} {...args} />
    ),
} satisfies Meta<
  React.ComponentProps<typeof LaunchDemo> & { colorScheme: 'light' | 'dark' } & {
    example: 'launch' | 'bottom-edge';
    animate: boolean;
  }
>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
