import {
  Column,
  nativeFillWidth,
  PageFrame,
  type PageHeaderMode,
  PageScreen,
  PageSection,
  ScrollView,
  UniversalHost,
  ButtonContent,
  UniversalTextContent as Text,
  TextInput,
  Switch,
  usePageHeaderInset,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import type { StoryThemeProps } from '../../components/story-theme';
import { useState, type ReactNode } from 'react';
import { router } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaInsetsContext, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';
import { spacing, radii } from '@/constants/layout';

function HeaderContent({
  colorScheme,
  presses,
  onNavigate,
  navigationLabel = 'Open details',
  colorProbe = false,
  controls,
}: Readonly<{
  colorScheme?: 'light' | 'dark';
  presses: number;
  onNavigate?: () => void;
  navigationLabel?: string;
  colorProbe?: boolean;
  controls?: ReactNode;
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
            {controls}
            <TextInput
              label="Retained draft"
              value={draft}
              onChangeText={setDraft}
              testID="page-header-draft"
            />
            {onNavigate ? (
              <ButtonContent
                variant="secondary"
                label={navigationLabel}
                testID="page-header-open-details"
                onPress={onNavigate}
              />
            ) : null}
            <ButtonContent
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
  colorProbe,
  ...props
}: Readonly<
  Parameters<typeof PageFrame>[0] & {
    showBack?: boolean;
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
    headerMode: 'fixed',
    headerBlur: true,
    showBack: true,
    direction: 'ltr',
    colorProbe: false,
    example: 'header',
  },
  argTypes: {
    showBack: { control: 'boolean' },
    title: { control: 'text' },
    headerMode: { control: 'select', options: ['fixed', 'scroll', 'overlay'] },
    headerBlur: { control: 'boolean' },
    colorProbe: { control: 'boolean' },
    direction: { control: 'select', options: ['ltr', 'rtl'] },
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
              <Story />
            </View>
          </SafeAreaInsetsContext.Provider>
        </LayoutDirectionProvider>
      );
    },
  ],
  render: ({ example, direction, ...args }) => {
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
    <PageScreen title="Ordinary page" showBack={false} colorScheme={colorScheme}>
      <PageSection>
        <ButtonContent
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
      headerMode="scroll"
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
      title={'Retained header\nwith a taller title'}
      colorScheme={colorScheme}
      headerMode="scroll"
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
  const [presses, setPresses] = useState(0);
  const [blur, setBlur] = useState(true);
  const [titled, setTitled] = useState(true);
  const [headerMode, setHeaderMode] = useState<PageHeaderMode>('scroll');
  return (
    <PageFrame
      title={titled ? 'Change header style' : undefined}
      colorScheme={colorScheme}
      headerMode={headerMode}
      headerBlur={blur}
      onBack={() => setPresses((value) => value + 1)}
    >
      <HeaderContent
        colorScheme={colorScheme}
        presses={presses}
        controls={
          <>
            <Switch
              label="Header blur"
              value={blur}
              onValueChange={setBlur}
              testID="page-header-toggle-blur"
            />
            <Switch
              label="Show title"
              value={titled}
              onValueChange={setTitled}
              testID="page-header-toggle-title"
            />
            <ButtonContent
              label={`Layout: ${headerMode}`}
              variant="secondary"
              testID="page-header-cycle-layout"
              onPress={() =>
                setHeaderMode((mode) =>
                  mode === 'fixed' ? 'scroll' : mode === 'scroll' ? 'overlay' : 'fixed',
                )
              }
            />
          </>
        }
      />
    </PageFrame>
  );
}

export const Playground: Story = {};
