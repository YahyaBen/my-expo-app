import {
  PageScreen,
  PageSection,
  TabNavigationBar,
  UniversalButtonContent,
  UniversalText,
  UniversalTextContent,
  type TabNavigationItemId,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { LayoutDirectionProvider } from '@/context/layout-direction.context';
import { useThemeColors } from '@/hooks/use-theme';

function NavigationDemo({
  colorScheme = 'light',
  direction = 'ltr',
  bottomInset = 24,
  disabled = false,
  longContent = false,
}: Readonly<{
  colorScheme?: 'light' | 'dark';
  direction?: 'ltr' | 'rtl';
  bottomInset?: number;
  disabled?: boolean;
  longContent?: boolean;
}>) {
  const [activeId, setActiveId] = useState<TabNavigationItemId>('home');
  const [presses, setPresses] = useState(0);
  const [contentPresses, setContentPresses] = useState(0);
  const colors = useThemeColors(colorScheme);
  const rtl = direction === 'rtl';

  return (
    <LayoutDirectionProvider key={direction} initialDirection={direction}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {longContent ? (
          <PageScreen
            tab
            colorScheme={colorScheme}
            title="Content clearance"
            description="Scroll the striped rows beside the raised button, then reach the final action."
          >
            {Array.from({ length: 24 }, (_, index) => (
              <PageSection
                key={index}
                style={{ backgroundColor: index % 2 ? colors.surfaceRaised : colors.surface }}
              >
                <UniversalTextContent>{`Content row ${index + 1}`}</UniversalTextContent>
              </PageSection>
            ))}
            <PageSection>
              <UniversalTextContent testID="navigation-final-action-count">
                {`Final actions: ${contentPresses}`}
              </UniversalTextContent>
              <UniversalButtonContent
                variant="primary"
                label="Count final content action"
                fullWidth
                testID="navigation-final-content-action"
                onPress={() => setContentPresses((value) => value + 1)}
              />
            </PageSection>
          </PageScreen>
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16 }}>
            <UniversalText colorScheme={colorScheme} testID="navigation-active-tab">
              {`Selected: ${activeId}`}
            </UniversalText>
            <UniversalText colorScheme={colorScheme} testID="navigation-action-count">
              {`Center actions: ${presses}`}
            </UniversalText>
          </View>
        )}
        <TabNavigationBar
          colorScheme={colorScheme}
          activeId={activeId}
          onSelect={setActiveId}
          bottomInset={bottomInset}
          items={[
            { id: 'home', label: rtl ? 'الرئيسية' : 'Home' },
            { id: 'search', label: rtl ? 'البحث' : 'Search' },
            { id: 'recipes', label: rtl ? 'وصفاتي' : 'My Recipes' },
            { id: 'more', label: rtl ? 'المزيد' : 'More' },
          ]}
          action={{
            kind: 'continue',
            label: rtl ? 'إنشاء عنصر' : 'Create item',
            disabled,
            testID: 'navigation-center-action',
            onPress: () => setPresses((value) => value + 1),
          }}
        />
      </View>
    </LayoutDirectionProvider>
  );
}

const meta = {
  title: 'Components/Navigation',
  component: NavigationDemo,
  parameters: {
    docs: {
      description: {
        component:
          'The selected tab has a rounded highlight behind its icon. Tap each of the four destinations: the highlight must move to the selected icon and clear the previous one. Check Light, Dark and RightToLeft; the label stays outside the highlight.',
      },
    },
  },
  args: {
    colorScheme: 'light',
    direction: 'ltr',
    bottomInset: 24,
    disabled: false,
    longContent: false,
  },
  argTypes: {
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    direction: { control: 'select', options: ['ltr', 'rtl'] },
    bottomInset: { control: { type: 'number', min: 0, max: 48 } },
    disabled: { control: 'boolean' },
    longContent: { control: 'boolean' },
  },
} satisfies Meta<typeof NavigationDemo>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Light: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };
export const RightToLeft: Story = { args: { direction: 'rtl' } };
export const DisabledAction: Story = { args: { disabled: true } };
export const LongContent: Story = {
  args: { longContent: true },
  parameters: {
    docs: {
      description: {
        story:
          'Scroll the striped rows: content must remain visible on both sides of the raised circle, without an opaque strip. At the end, the final content button must clear the circle and remain tappable, including its lower edge. Each press increments Final actions. Repeat with zero and nonzero bottom insets, dark appearance and RTL.',
      },
    },
  },
};
