import {
  Column,
  Icon,
  Row,
  UniversalButtonContent,
  UniversalHost,
  Text,
  type IconProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';

const star = Icon.select({ ios: 'star.fill', android: 'star' });

function IconPreview({
  colorScheme = 'light',
  ...props
}: Readonly<IconProps & { colorScheme?: 'light' | 'dark' }>) {
  return (
    <UniversalHost inline colorScheme={colorScheme}>
      <Icon {...props} />
    </UniversalHost>
  );
}

const meta = {
  title: 'Components/Icon',
  component: IconPreview,
  args: { name: star, size: 24, colorScheme: 'light', testID: 'expo-symbol-icon' },
  argTypes: {
    name: { control: false },
    size: { control: { type: 'range', min: 16, max: 64, step: 2 } },
    color: { control: 'color' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    modifiers: { control: false },
  },
} satisfies Meta<typeof IconPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const Tinted: Story = { args: { color: '#B45309', size: 40 } };
export const Disabled: Story = { args: { disabled: true, style: { opacity: 0.5 } } };

function ChangingSymbol({ colorScheme }: Readonly<{ colorScheme?: 'light' | 'dark' }>) {
  const [visible, setVisible] = useState(false);
  return (
    <UniversalHost colorScheme={colorScheme}>
      <Column spacing={16}>
        <Row alignment="center" spacing={12}>
          <Icon
            name={Icon.select({
              ios: visible ? 'eye' : 'eye.slash',
              android: visible ? 'visibility' : 'visibility_off',
            })}
            testID="changing-symbol"
            size={24}
          />
          <Text testID="changing-symbol-state">{visible ? 'Visible' : 'Hidden'}</Text>
        </Row>
        <UniversalButtonContent
          variant="secondary"
          label="Toggle visibility"
          testID="change-symbol"
          onPress={() => setVisible((value) => !value)}
        />
      </Column>
    </UniversalHost>
  );
}

export const DynamicName: Story = { render: (args) => <ChangingSymbol {...args} /> };

export const ButtonForegrounds: Story = {
  render: (args) => (
    <UniversalHost colorScheme={args.colorScheme}>
      <Column spacing={16}>
        {(['primary', 'secondary', 'destructive'] as const).map((variant) => (
          <UniversalButtonContent key={variant} variant={variant} testID={`symbol-${variant}`}>
            <Row alignment="center" spacing={8}>
              <Icon name={star} />
              <Text>{variant}</Text>
            </Row>
          </UniversalButtonContent>
        ))}
        <UniversalButtonContent
          variant="primary"
          contentColor="#00FFFF"
          testID="symbol-custom-foreground"
        >
          <Row alignment="center" spacing={8}>
            <Icon name={star} />
            <Icon name={star} color="#FFFF00" />
            <Text>Inherited and explicit colors</Text>
          </Row>
        </UniversalButtonContent>
      </Column>
    </UniversalHost>
  ),
};
