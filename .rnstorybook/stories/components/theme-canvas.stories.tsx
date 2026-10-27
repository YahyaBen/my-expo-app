import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-native';
import { ThemeCanvas, useHostColorScheme } from '@components/ui';
import { useThemeSettings } from '@/context/theme.context';
import {
  AnimatedComponentPreview,
  type AnimatedComponentPreviewProps,
} from '../../components/animated-component-preview';

type ThemeCanvasDemoProps = AnimatedComponentPreviewProps & {
  height?: number;
  disabled?: boolean;
  label?: string;
};

function ThemeCanvasDemo({
  height = 160,
  disabled = false,
  label = 'Dark mode',
  ...preview
}: ThemeCanvasDemoProps) {
  return (
    <AnimatedComponentPreview {...preview}>
      <AppearancePreferenceControl height={height} disabled={disabled} label={label} />
    </AnimatedComponentPreview>
  );
}

function AppearancePreferenceControl({
  height,
  disabled,
  label,
}: Required<Pick<ThemeCanvasDemoProps, 'height' | 'disabled' | 'label'>>) {
  const colorScheme = useHostColorScheme();
  const { setColorScheme, appearanceReady } = useThemeSettings();
  return (
    <ThemeCanvas
      colorScheme={colorScheme}
      onColorSchemeChange={setColorScheme}
      label={label}
      height={height}
      disabled={disabled || !appearanceReady}
    />
  );
}

function LocalAppearanceControl() {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light');
  return (
    <ThemeCanvas
      colorScheme={colorScheme}
      onColorSchemeChange={setColorScheme}
      label="Preview dark artwork"
      height={96}
      testID="local-theme-canvas"
    />
  );
}

const meta = {
  title: 'Components/Theme Canvas',
  component: ThemeCanvasDemo,
  args: { colorScheme: 'light', rtl: false, height: 160, disabled: false, label: 'Dark mode' },
  argTypes: {
    rtl: { control: 'boolean' },
    height: { control: 'number' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'The parent supplies the scheme, callback, label and artwork height. This fixture connects the controlled component to isolated preferences. Check rapid changes, custom sizes, disabled interaction and RTL; the Settings reveal remains in Appearance Canvas/Settings Screen Reveal.',
      },
    },
  },
} satisfies Meta<typeof ThemeCanvasDemo>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RTL: Story = { args: { rtl: true } };
export const Compact: Story = { args: { height: 80 } };
export const Disabled: Story = { args: { disabled: true } };
export const LocalState: Story = {
  render: (args) => (
    <AnimatedComponentPreview {...args}>
      <LocalAppearanceControl />
    </AnimatedComponentPreview>
  ),
};
