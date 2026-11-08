import {
  ButtonContent,
  Column,
  nativeFillWidth,
  PageFrame,
  PageScreen,
  PageSection,
  ScrollView,
  UniversalHost,
  UniversalTextContent as Text,
  TextInput,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { spacing, radii } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

type NativeHeaderDemoProps = {
  title: string;
  colorScheme?: 'light' | 'dark';
  colorProbe?: boolean;
  example?: 'header' | 'ordinary-page' | 'native-back-return';
};

/** Exercise the route's native header with real pushes and retained scroll/drafts. */
function NativeHeaderDemo({
  title,
  colorScheme,
  colorProbe = false,
  example = 'header',
}: Readonly<NativeHeaderDemoProps>) {
  const colors = useThemeColors(colorScheme);
  const [draft, setDraft] = useState('');
  const [contentPresses, setContentPresses] = useState(0);
  const controls = (
    <PageSection>
      <Text>
        Use the native Back button after opening another route. Check the draft and scroll position
        on return.
      </Text>
      <TextInput
        label="Retained draft"
        value={draft}
        onChangeText={setDraft}
        testID="page-header-draft"
      />
      <ButtonContent
        variant="secondary"
        label="Open wireframe"
        testID="page-header-open-details"
        onPress={() => router.push({ pathname: '/', params: { preview: 'true' } })}
      />
      <ButtonContent
        variant="secondary"
        label="Open component details"
        testID="ordinary-page-first-action"
        onPress={() => router.push({ pathname: '/components/[id]', params: { id: 'text-input' } })}
      />
      <ButtonContent
        variant="secondary"
        label="Content action"
        testID="page-header-content-action"
        onPress={() => setContentPresses((value) => value + 1)}
      />
      <Text testID="page-header-content-count">{`Content presses: ${contentPresses}`}</Text>
    </PageSection>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: example === 'native-back-return' ? 'Retained header with a longer title' : title,
        }}
      />
      {example === 'ordinary-page' ? (
        <PageScreen title={title} showBack={false} colorScheme={colorScheme}>
          {controls}
        </PageScreen>
      ) : (
        <PageFrame colorScheme={colorScheme}>
          <UniversalHost
            colorScheme={colorScheme}
            matchContents={false}
            ignoreSafeArea="all"
            style={{ flex: 1 }}
          >
            <ScrollView testID="page-header-scroll">
              <Column spacing={0} modifiers={nativeFillWidth}>
                {controls}
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
                    </Column>
                  </PageSection>
                ))}
              </Column>
            </ScrollView>
          </UniversalHost>
        </PageFrame>
      )}
    </>
  );
}

const meta = {
  title: 'Components/Page Header',
  component: NativeHeaderDemo,
  args: {
    title: 'Settings',
    colorScheme: 'light',
    colorProbe: false,
    example: 'header',
  },
  argTypes: {
    title: { control: 'text' },
    colorProbe: { control: 'boolean' },
    example: { control: 'select', options: ['header', 'ordinary-page', 'native-back-return'] },
  },
} satisfies Meta<typeof NativeHeaderDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
