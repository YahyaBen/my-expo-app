import {
  Column,
  nativeFillWidth,
  PageFrame,
  PageScreen,
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
}: Readonly<{
  colorScheme?: 'light' | 'dark';
  presses: number;
  onNavigate?: () => void;
  navigationLabel?: string;
  colorProbe?: boolean;
}>) {
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
}: Readonly<
  Parameters<typeof PageFrame>[0] & {
    showBack?: boolean;
    shape?: Parameters<typeof PageMotionOverlay>[0]['shape'];
    colorProbe?: boolean;
  }
>) {
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
    direction: 'ltr',
    animateWaves: true,
    withoutWaves: false,
    expandedWaves: false,
    colorProbe: false,
    headerOverlay: false,
    example: 'header',
  },
  argTypes: {
    showBack: { control: 'boolean' },
    shape: {
      control: 'select',
      options: HEADER_STYLES,
      description: 'Default uses a rectangular header; waves retain the shared artwork and mask.',
    },
    title: { control: 'text' },
    scrollsBehindHeader: { control: 'boolean' },
    headerOverlay: { control: 'boolean' },
    colorProbe: { control: 'boolean' },
    direction: { control: 'select', options: ['ltr', 'rtl'] },
    animateWaves: { control: 'boolean' },
    withoutWaves: { control: 'boolean' },
    expandedWaves: { control: 'boolean' },
    example: {
      control: 'select',
      options: [
        'header',
        'ordinary-page',
        'navigation',
        'native-back-return',
        'change-header-style',
      ],
    },
  },
  decorators: [
    (Story, { args }) => {
      const colors = useThemeColors(args.colorScheme);
      return (
        <LayoutDirectionProvider key={args.direction} initialDirection={args.direction}>
          <SafeAreaInsetsContext.Provider value={{ top: 59, bottom: 34, left: 0, right: 0 }}>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
              <PageMotionOverlay
                colorScheme={args.colorScheme}
                shape={args.shape}
                animate={args.animateWaves}
                visible={!args.withoutWaves}
                expanded={args.expandedWaves}
              >
                <Story />
              </PageMotionOverlay>
            </View>
          </SafeAreaInsetsContext.Provider>
        </LayoutDirectionProvider>
      );
    },
  ],
  render: ({ example, direction, animateWaves, withoutWaves, expandedWaves, ...args }) => {
    switch (example) {
      case 'ordinary-page':
        return <OrdinaryPageDemo colorScheme={args.colorScheme} />;
      case 'navigation':
        return <NavigationHeaderDemo colorScheme={args.colorScheme} />;
      case 'native-back-return':
        return <NativeBackReturnHeaderDemo colorScheme={args.colorScheme} />;
      case 'change-header-style':
        return <HeaderStyleSwitchDemo colorScheme={args.colorScheme} />;
      default:
        return <HeaderDemo {...args} />;
    }
  },
} satisfies Meta<
  Parameters<typeof HeaderDemo>[0] &
    StoryThemeProps & {
      direction: 'ltr' | 'rtl';
      animateWaves: boolean;
      withoutWaves: boolean;
      expandedWaves: boolean;
    } & {
      example:
        'header' | 'ordinary-page' | 'navigation' | 'native-back-return' | 'change-header-style';
    }
>;

export default meta;
type Story = StoryObj<typeof meta>;

function OrdinaryPageDemo({ colorScheme }: Readonly<{ colorScheme?: 'light' | 'dark' }>) {
  const [presses, setPresses] = useState(0);
  return (
    <PageScreen title="Ordinary page" description="" showBack={false} colorScheme={colorScheme}>
      <PageSection>
        <UniversalButtonContent
          variant="primary"
          label="First content action"
          testID="ordinary-page-first-action"
          onPress={() => setPresses((count) => count + 1)}
        />
        <Text testID="ordinary-page-presses">{`Content presses: ${presses}`}</Text>
      </PageSection>
    </PageScreen>
  );
}

function NavigationHeaderDemo({ colorScheme }: Readonly<{ colorScheme?: 'light' | 'dark' }>) {
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

function NativeBackReturnHeaderDemo({ colorScheme }: Readonly<{ colorScheme?: 'light' | 'dark' }>) {
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
        navigationLabel="Open wireframe"
        onNavigate={() => router.push({ pathname: '/', params: { preview: 'true' } })}
      />
    </PageFrame>
  );
}

function HeaderStyleSwitchDemo({ colorScheme }: Readonly<{ colorScheme?: 'light' | 'dark' }>) {
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

export const Playground: Story = {};
