import { PageScreen, PageSection, ButtonContent, UniversalTextContent } from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';

function PageDemo({
  showBack = false,
  viewportWidth,
  longContent = false,
  footer,
}: Readonly<{
  showBack?: boolean;
  viewportWidth?: number;
  longContent?: boolean;
  footer?: string;
}>) {
  const [actions, setActions] = useState(0);
  const [backs, setBacks] = useState(0);
  return (
    <View style={{ flex: 1, width: '100%', maxWidth: viewportWidth, alignSelf: 'center' }}>
      <PageScreen
        title="Home"
        description="Standalone starter page."
        footer={footer}
        showBack={showBack}
        onBack={() => setBacks((value) => value + 1)}
      >
        <PageSection>
          <ButtonContent
            variant="primary"
            label="Count action"
            testID="page-demo-action"
            fullWidth
            onPress={() => setActions((value) => value + 1)}
          />
          <UniversalTextContent testID="page-demo-count">{`Actions: ${actions}; Back: ${backs}`}</UniversalTextContent>
        </PageSection>
        {longContent
          ? Array.from({ length: 18 }, (_, index) => (
              <PageSection key={index}>
                <UniversalTextContent variant="title">{`Section ${index + 1}`}</UniversalTextContent>
                <UniversalTextContent>
                  Content keeps the same centered width while the page scrolls beneath its header.
                </UniversalTextContent>
              </PageSection>
            ))
          : null}
        {longContent ? (
          <PageSection>
            <ButtonContent
              variant="secondary"
              label="Count bottom action"
              fullWidth
              testID="page-demo-bottom-action"
              onPress={() => setActions((value) => value + 1)}
            />
            <UniversalTextContent testID="page-demo-bottom-count">{`Actions: ${actions}`}</UniversalTextContent>
          </PageSection>
        ) : null}
      </PageScreen>
    </View>
  );
}

const meta = {
  title: 'Components/Page Screen',
  component: PageDemo,
  args: {
    showBack: false,
    longContent: false,
    footer: 'Version 1.0.0',
    direction: 'ltr',
  },
  argTypes: {
    viewportWidth: { control: 'number' },
    longContent: { control: 'boolean' },
    footer: { control: 'text' },
    showBack: { control: 'boolean' },
    direction: { control: 'select', options: ['ltr', 'rtl'] },
  },

  decorators: [
    (Story, { args }) => (
      <LayoutDirectionProvider key={args.direction} initialDirection={args.direction}>
        <Story />
      </LayoutDirectionProvider>
    ),
  ],
} satisfies Meta<Parameters<typeof PageDemo>[0] & { direction: 'ltr' | 'rtl' }>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
