import {
  Column,
  UniversalButton,
  UniversalButtonContent,
  type UniversalButtonProps,
  UniversalTextContent,
  UniversalText,
  UniversalHost,
  PageScreen,
  PageSection,
  Switch,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { NativeStoryFrame } from '../../components/native-story-frame';
import type { StoryThemeProps } from '../../components/story-theme';
import { StandaloneButtonPreview } from '../../components/catalog/buttons-preview';
import {
  LayoutDirectionProvider,
  useLayoutDirectionSettings,
} from '@/context/layout-direction.context';

function ButtonDemo(args: Readonly<UniversalButtonProps>) {
  const [presses, setPresses] = useState(0);
  return (
    <NativeStoryFrame colorScheme={args.colorScheme}>
      <UniversalButton
        {...args}
        onPress={() => {
          setPresses((value) => value + 1);
          args.onPress?.();
        }}
      />
      <UniversalText colorScheme={args.colorScheme} testID="expo-ui-button-presses">
        {`Presses: ${presses}`}
      </UniversalText>
    </NativeStoryFrame>
  );
}

const meta = {
  title: 'Components/Button',
  component: UniversalButton,
  args: {
    testID: 'expo-ui-button',
    label: 'Continue',
    variant: 'primary',
    colorScheme: 'dark',
    disabled: false,
    onPress: action('button pressed'),
    example: 'button',
  },
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'link',
        'success',
        'warning',
        'destructive',
        'info',
        'glass',
      ],
    },
    fullWidth: { control: 'boolean' },
    borderRadius: { control: { type: 'number', min: 0 } },
    contentPadding: { control: { type: 'number', min: 0 } },
    cornerRadii: { control: 'object' },
    color: { control: 'color' },
    contentColor: { control: 'color' },
    disabled: { control: 'boolean' },
    onPress: { action: 'pressed', control: false },
    example: {
      control: 'select',
      options: ['button', 'interaction', 'semantic-variants', 'standalone-host'],
    },
  },
  render: ({ example, ...args }) => {
    switch (example) {
      case 'interaction':
        return <InteractionDemo {...args} />;
      case 'semantic-variants':
        return <SemanticVariantsDemo colorScheme={args.colorScheme} />;
      case 'standalone-host':
        return <StandaloneHostDemo colorScheme={args.colorScheme} />;
      default:
        return <ButtonDemo {...args} />;
    }
  },
  parameters: {
    controls: {
      include: [
        'example',
        'label',
        'variant',
        'disabled',
        'fullWidth',
        'borderRadius',
        'contentPadding',
        'cornerRadii',
        'color',
        'contentColor',
        'colorScheme',
        'themeId',
      ],
    },
  },
} satisfies Meta<
  UniversalButtonProps &
    StoryThemeProps & {
      example: 'button' | 'interaction' | 'semantic-variants' | 'standalone-host';
    }
>;

export default meta;

type Story = StoryObj<typeof meta>;

function InteractionDemo(args: Readonly<UniversalButtonProps>) {
  const [presses, setPresses] = useState(0);
  return (
    <NativeStoryFrame colorScheme={args.colorScheme}>
      <UniversalHost colorScheme={args.colorScheme}>
        <Column spacing={16}>
          <UniversalButtonContent
            variant={args.variant}
            label="Count press"
            testID="button-count"
            borderRadius={12}
            contentPadding={12}
            onPress={() => setPresses((value) => value + 1)}
          />
          <UniversalButtonContent
            variant="secondary"
            label="Disabled press"
            testID="button-disabled"
            borderRadius={0}
            disabled
            onPress={() => setPresses((value) => value + 1)}
          />
          <UniversalTextContent testID="button-press-count">{`Presses: ${presses}`}</UniversalTextContent>
          <UniversalButtonContent
            variant="link"
            label="Reset count"
            testID="button-reset"
            onPress={() => setPresses(0)}
          />
        </Column>
      </UniversalHost>
    </NativeStoryFrame>
  );
}

/** Use component defaults so a preview cannot hide a missing semantic color mapping. */
function SemanticVariantsDemo({
  colorScheme,
}: Readonly<Pick<UniversalButtonProps, 'colorScheme'>>) {
  const [presses, setPresses] = useState(0);
  return (
    <NativeStoryFrame colorScheme={colorScheme}>
      <UniversalHost colorScheme={colorScheme}>
        <Column spacing={16}>
          {(
            [
              'primary',
              'secondary',
              'tertiary',
              'link',
              'success',
              'warning',
              'info',
              'destructive',
              'glass',
            ] as const
          ).map((variant) => (
            <UniversalButtonContent
              key={variant}
              variant={variant}
              label={variant}
              fullWidth
              testID={`button-semantic-${variant}`}
              onPress={() => setPresses((value) => value + 1)}
            />
          ))}
          <UniversalButtonContent
            variant="warning"
            label="Disabled warning"
            disabled
            fullWidth
            testID="button-semantic-disabled"
            onPress={() => setPresses((value) => value + 1)}
          />
          <UniversalTextContent testID="button-semantic-presses">
            {`Presses: ${presses}`}
          </UniversalTextContent>
          <UniversalButtonContent
            variant="link"
            label="Reset count"
            testID="button-semantic-reset"
            onPress={() => setPresses(0)}
          />
        </Column>
      </UniversalHost>
    </NativeStoryFrame>
  );
}

function StandaloneHostDemo({ colorScheme }: Readonly<Pick<UniversalButtonProps, 'colorScheme'>>) {
  return (
    <LayoutDirectionProvider initialDirection="ltr">
      <StandaloneHostContent colorScheme={colorScheme} />
    </LayoutDirectionProvider>
  );
}

function StandaloneHostContent({
  colorScheme,
}: Readonly<Pick<UniversalButtonProps, 'colorScheme'>>) {
  const [presses, setPresses] = useState(0);
  const { direction, setDirection } = useLayoutDirectionSettings();
  return (
    <PageScreen
      title="Standalone button Hosts"
      description="Change direction without resetting the count. Compare each label's scheme with its forced or inherited Host; press button edges and the disabled action."
      colorScheme={colorScheme}
      showBack={false}
    >
      <PageSection>
        <Switch
          label="Right-to-left preview"
          value={direction === 'rtl'}
          onValueChange={(rtl) => setDirection(rtl ? 'rtl' : 'ltr')}
          testID="button-host-rtl"
        />
        <UniversalTextContent testID="button-host-presses">{`Presses: ${presses}`}</UniversalTextContent>
        <UniversalButtonContent
          variant="link"
          label="Reset count"
          testID="button-host-reset"
          onPress={() => setPresses(0)}
        />
      </PageSection>
      <StandaloneButtonPreview onPress={() => setPresses((value) => value + 1)} />
    </PageScreen>
  );
}

export const Playground: Story = {};
