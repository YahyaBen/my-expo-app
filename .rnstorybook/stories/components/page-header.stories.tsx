import {
  Column,
  nativeFillWidth,
  PageFrame,
  PageSection,
  PageMotionOverlay,
  ScrollView,
  UniversalHost,
  UniversalButtonContent,
  UniversalTextContent as Text,
  TextInput,
  usePageHeaderInset,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import type { StoryThemeProps } from '../../components/story-theme';
import { useState } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';
import { spacing, radii } from '@/constants/layout';
import { DEFAULT_HEADER_SHAPE, HEADER_STYLES } from '@/constants/header-motion';

function HeaderContent({
  colorScheme,
  presses,
  onNavigate,
  navigationLabel = 'Open details',
  colorProbe = false,
}: {
  colorScheme?: 'light' | 'dark';
  presses: number;
  onNavigate?: () => void;
  navigationLabel?: string;
  colorProbe?: boolean;
}) {
  const colors = useThemeColors(colorScheme);
  const headerInset = usePageHeaderInset();
  const insets = useSafeAreaInsets();
  const [contentPresses, setContentPresses] = useState(0);
  const [draft, setDraft] = useState('');
  return (
    <UniversalHost
      colorScheme={colorScheme}
      matchContents={false}
      ignoreSafeArea="all"
      style={{ flex: 1 }}
    >
      <ScrollView testID="page-header-scroll">
        <Column
          spacing={0}
          modifiers={nativeFillWidth}
          style={{ padding: 0, paddingTop: headerInset + insets.top }}
        >
          <PageSection>
            <TextInput
              label="Retained draft"
              value={draft}
              onChangeText={setDraft}
              testID="page-header-draft"
            />
            {onNavigate ? (
              <UniversalButtonContent
                variant="secondary"
                label={navigationLabel}
                testID="page-header-open-details"
                onPress={onNavigate}
              />
            ) : null}
            <UniversalButtonContent
              variant="secondary"
              label="Content action"
              testID="page-header-content-action"
              onPress={() => setContentPresses((value) => value + 1)}
            />
            <Text testID="page-header-content-count">{`Content presses: ${contentPresses}`}</Text>
            <Text testID="page-header-back-count">{`Back presses: ${presses}`}</Text>
          </PageSection>
          {Array.from({ length: 20 }, (_, index) => (
            <PageSection key={index}>
              <Column
                spacing={spacing.sm}
                modifiers={nativeFillWidth}
                style={{
                  padding: spacing.lg,
                  borderRadius: radii.card,
                  backgroundColor: colorProbe
                    ? index % 2
                      ? colors.secondary
                      : colors.primary
                    : index % 2
                      ? colors.surface
                      : colors.selection,
                }}
              >
                <Text
                  variant="title"
                  textStyle={
                    colorProbe
                      ? { color: index % 2 ? colors.onSecondary : colors.onPrimary }
                      : undefined
                  }
                >{`Recipe ${index + 1}`}</Text>
                <Text
                  textStyle={
                    colorProbe
                      ? { color: index % 2 ? colors.onSecondary : colors.onPrimary }
                      : undefined
                  }
                >
                  {colorProbe
                    ? 'Scroll: these colors should remain visible through the blur.'
                    : 'Scroll to inspect the shared header blur.'}
                </Text>
              </Column>
            </PageSection>
          ))}
        </Column>
      </ScrollView>
    </UniversalHost>
  );
}

function HeaderDemo({
  showBack = true,
  shape: _shape,
  colorProbe,
  ...props
}: Parameters<typeof PageFrame>[0] & {
  showBack?: boolean;
  shape?: Parameters<typeof PageMotionOverlay>[0]['shape'];
  colorProbe?: boolean;
}) {
  const [presses, setPresses] = useState(0);
  return (
    <PageFrame {...props} onBack={showBack ? () => setPresses((value) => value + 1) : undefined}>
      <HeaderContent colorScheme={props.colorScheme} presses={presses} colorProbe={colorProbe} />
    </PageFrame>
  );
}

const meta = {
  title: 'Components/Page Header',
  component: HeaderDemo,
  args: {
    title: 'Settings',
    colorScheme: 'light',
    scrollsBehindHeader: false,
    showBack: true,
    shape: DEFAULT_HEADER_SHAPE,
  },
  argTypes: {
    showBack: { control: 'boolean' },
    shape: {
      control: 'select',
      options: HEADER_STYLES,
      description: 'Default uses a rectangular header; waves retain the shared artwork and mask.',
    },
  },
  decorators: [
    (Story, { args, parameters }) => {
      const colors = useThemeColors(args.colorScheme);
      return (
        <LayoutDirectionProvider initialDirection={parameters.waveDirection ?? 'ltr'}>
          <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
              <PageMotionOverlay
                colorScheme={args.colorScheme}
                shape={args.shape}
                animate={parameters.animateWaves !== false}
                visible={!parameters.withoutWaves}
                expanded={Boolean(parameters.expandedWaves)}
              >
                <Story />
              </PageMotionOverlay>
            </View>
          </SafeAreaInsetsContext.Provider>
        </LayoutDirectionProvider>
      );
    },
  ],
  render: (args) => <HeaderDemo {...args} />,
} satisfies Meta<Parameters<typeof HeaderDemo>[0] & StoryThemeProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const PlainHeader: Story = { args: { shape: 'default', scrollsBehindHeader: true } };
export const AltareaBlurLight: Story = {
  args: {
    themeId: 'altarea',
    colorScheme: 'light',
    shape: 'dunes',
    scrollsBehindHeader: true,
    colorProbe: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Scroll purple and magenta cards beneath the title: they must blur without a gray wash while the title and Back stay sharp. Exact untinted Android blur requires a development build with the native patch; older builds use the minimum supported tint at the same blur radius. Altarea adds no wave even with a retained Dunes preference. Check the retained draft and Back/content press counts.',
      },
    },
  },
};
export const AltareaBlurDark: Story = {
  ...AltareaBlurLight,
  args: { ...AltareaBlurLight.args, colorScheme: 'dark' },
};
export const AltareaBlurOverlay: Story = {
  args: {
    themeId: 'altarea',
    colorScheme: 'light',
    shape: 'dunes',
    headerOverlay: true,
    colorProbe: true,
  },
};
export const Home: Story = {
  args: { title: 'Accueil', showBack: false, scrollsBehindHeader: true },
};

function NavigationHeaderDemo({ colorScheme }: { colorScheme?: 'light' | 'dark' }) {
  const [details, setDetails] = useState(false);
  const [returns, setReturns] = useState(0);
  return (
    <PageFrame
      key={details ? 'details' : 'home'}
      title={details ? 'Details' : 'Accueil'}
      colorScheme={colorScheme}
      scrollsBehindHeader
      onBack={
        details
          ? () => {
              setReturns((value) => value + 1);
              setDetails(false);
            }
          : undefined
      }
    >
      <HeaderContent
        colorScheme={colorScheme}
        presses={returns}
        onNavigate={details ? undefined : () => setDetails(true)}
      />
    </PageFrame>
  );
}

export const NavigationContinuity: Story = {
  render: ({ colorScheme }) => <NavigationHeaderDemo colorScheme={colorScheme} />,
  parameters: {
    animateWaves: false,
    docs: {
      description: {
        story:
          'Open details and use Back repeatedly. Each page remounts beneath the same paused wave; the header band and initial content clearance should stay at the same height.',
      },
    },
  },
};

function NativeBackReturnHeaderDemo({ colorScheme }: { colorScheme?: 'light' | 'dark' }) {
  const [presses, setPresses] = useState(0);
  return (
    <PageFrame
      title="Retained header"
      colorScheme={colorScheme}
      scrollsBehindHeader
      onBack={() => setPresses((value) => value + 1)}
    >
      <HeaderContent
        colorScheme={colorScheme}
        presses={presses}
        colorProbe
        navigationLabel="Open app settings"
        onNavigate={() => router.push('/settings')}
      />
    </PageFrame>
  );
}

export const NativeBackReturn: Story = {
  args: {
    themeId: 'altarea',
    colorScheme: 'light',
    shape: 'default',
    scrollsBehindHeader: true,
    colorProbe: true,
  },
  render: ({ colorScheme }) => <NativeBackReturnHeaderDemo colorScheme={colorScheme} />,
  parameters: {
    docs: {
      description: {
        story:
          'Run inside the app Storybook route. Type a draft, count a content action, and open app settings. Use the actual Settings header Back or Android system Back to pop to this retained Storybook screen; the fixture Back only increments its local count. Repeat and scroll purple/magenta cards under the title before and after returning: blur must update without a gray wash, and the draft, content count and scroll state must survive. This exercises a native route push/pop without remounting the fixture.',
      },
    },
  },
};
export const NativeBackReturnDark: Story = {
  ...NativeBackReturn,
  args: { ...NativeBackReturn.args, colorScheme: 'dark' },
};

export const Dark: Story = { args: { colorScheme: 'dark' } };
export const Scrolling: Story = { args: { title: 'Saved recipes', scrollsBehindHeader: true } };
export const LongTitle: Story = {
  args: { title: 'Toutes les pages et les paramètres de l’application', scrollsBehindHeader: true },
  parameters: { animateWaves: true },
};
export const FullHeightOverlay: Story = { args: { title: 'Overlay', headerOverlay: true } };
export const WithoutWaves: Story = { parameters: { withoutWaves: true } };
export const ExpandedLogin: Story = {
  args: { title: 'Login', showBack: false },
  parameters: { expandedWaves: true },
};

function HeaderStyleSwitchDemo({ colorScheme }: { colorScheme?: 'light' | 'dark' }) {
  const [plain, setPlain] = useState(false);
  const [presses, setPresses] = useState(0);
  return (
    <PageMotionOverlay shape={plain ? 'default' : 'dunes'} colorScheme={colorScheme}>
      <PageFrame
        title="Change header style"
        colorScheme={colorScheme}
        scrollsBehindHeader
        onBack={() => {
          setPlain((value) => !value);
          setPresses((value) => value + 1);
        }}
      >
        <HeaderContent colorScheme={colorScheme} presses={presses} />
      </PageFrame>
    </PageMotionOverlay>
  );
}

export const ChangeHeaderStyle: Story = {
  args: { shape: 'default' },
  render: ({ colorScheme }) => <HeaderStyleSwitchDemo colorScheme={colorScheme} />,
  parameters: {
    docs: {
      description: {
        story:
          'Type a draft and press the back control to switch between Dunes and Default. The draft, content count and scroll position must survive.',
      },
    },
  },
};
