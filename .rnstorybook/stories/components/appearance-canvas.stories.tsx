import type { Meta, StoryObj } from '@storybook/react-native';
import {
  ColorSchemeCanvas,
  ColorSchemeControl,
  Column,
  Switch,
  UniversalHost,
  nativeFillWidth,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import { useThemeSettings } from '@/context/theme.context';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { StoryTheme, type StoryThemeProps } from '../../components/story-theme';
import { SettingsPage } from '@/features/settings/settings-screen';

function AppearanceCanvasContent() {
  const { setReducedMotion } = useThemeSettings();
  const reducedMotion = useAppReducedMotion();
  return (
    <UniversalHost>
      <Column spacing={spacing.lg} modifiers={nativeFillWidth} style={{ padding: spacing.lg }}>
        <ColorSchemeControl testID="appearance-canvas-picker" />
        <ColorSchemeCanvas testID="appearance-canvas-artwork" />
        <Switch
          label="Reduce motion"
          value={reducedMotion}
          onValueChange={setReducedMotion}
          testID="appearance-canvas-reduce-motion"
        />
      </Column>
    </UniversalHost>
  );
}

function AppearanceCanvasDemo(props: StoryThemeProps) {
  return (
    <StoryTheme {...props}>
      <AppearanceCanvasContent />
    </StoryTheme>
  );
}

const meta = {
  title: 'Components/Appearance Canvas',
  component: AppearanceCanvasDemo,
  args: { colorScheme: 'light' },
  parameters: {
    docs: {
      description: {
        component:
          'Change System/Light/Dark, toggle Reduce motion, and switch rapidly. The preview uses isolated preferences; check resizing, RTL and native Settings separately.',
      },
    },
  },
} satisfies Meta<typeof AppearanceCanvasDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };

export const SettingsScreenReveal: Story = {
  render: (args) => (
    <StoryTheme {...args}>
      <SettingsPage language="en" />
    </StoryTheme>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use the real Settings appearance picker. Check that header and form content remain visible in the captured layer, that the new appearance is revealed across the page, and that Reduce Motion skips the reveal. This fixture does not persist app preferences.',
      },
    },
  },
};
