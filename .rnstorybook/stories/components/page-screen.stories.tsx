import {
  PageScreen,
  PageSection,
  UniversalButtonContent,
  UniversalTextContent,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';

function PageDemo({
  showBack = false,
  viewportWidth,
  longContent = false,
}: {
  showBack?: boolean;
  viewportWidth?: number;
  longContent?: boolean;
}) {
  const [actions, setActions] = useState(0);
  const [backs, setBacks] = useState(0);
  return (
    <View style={{ flex: 1, width: '100%', maxWidth: viewportWidth, alignSelf: 'center' }}>
      <PageScreen
        title="Home"
        description="Standalone starter page."
        showBack={showBack}
        onBack={() => setBacks((value) => value + 1)}
      >
        <PageSection>
          <UniversalButtonContent
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
            <UniversalButtonContent
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
  args: { showBack: false, longContent: false },
  argTypes: {
    viewportWidth: { control: 'number' },
    longContent: { control: 'boolean' },
  },
} satisfies Meta<typeof PageDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
export const StandaloneHome: Story = {};
export const BackAction: Story = { args: { showBack: true } };
export const NarrowScreen: Story = { args: { viewportWidth: 360 } };
export const WideScreen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Open on a wide device or window. The available preview width stays real; the shared page bounds the header and content with equal outer margins.',
      },
    },
  },
};
export const WideLongContent: Story = { args: { showBack: true, longContent: true } };
export const WideRTL: Story = {
  args: { showBack: true, longContent: true },
  decorators: [
    (Story) => (
      <LayoutDirectionProvider initialDirection="rtl">
        <Story />
      </LayoutDirectionProvider>
    ),
  ],
};
