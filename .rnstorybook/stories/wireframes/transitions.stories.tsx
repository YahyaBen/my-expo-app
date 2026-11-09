import {
  PageScreen,
  PageSection,
  RNHostView,
  Skeleton,
  Switch,
  TextInput,
  ButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { useMotionSettings } from '@/context/theme.context';
import { PerformanceReadyContext } from '@/context/performance-ready.context';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import type { StoryThemeProps } from '../../components/story-theme';

function Transitions() {
  const [draft, setDraft] = useState('Retain this draft');
  const [presses, setPresses] = useState(0);
  const { setReducedMotion } = useMotionSettings();
  const reducedMotion = useAppReducedMotion();
  return (
    <PageScreen title="Transitions" showBack={false}>
      <PageSection testID="motion-transitions">
        <Text>
          Open the wireframe, then use its Back button or Android system Back. Your draft and action
          count stay here.
        </Text>
        <Text>
          In Settings, choose English for LTR or Arabic for RTL. Open Components, then a category:
          entry moves right to left in LTR and left to right in RTL. In Controls, open Checkbox to
          see a second-level page rise from the bottom. Settings stays in the dock. Button opens as
          a full-screen modal page on Android and a page sheet on iOS. Scroll to the Glass buttons
          at the end, then use Back to return. On iOS, Button also supports swipe-down dismissal.
        </Text>
        <TextInput
          label="Retained draft"
          value={draft}
          onChangeText={setDraft}
          testID="motion-transition-draft"
        />
        <ButtonContent
          variant="primary"
          label="Open wireframe"
          testID="motion-transition-open"
          onPress={() => router.push({ pathname: '/', params: { preview: 'true' } })}
        />
        <ButtonContent
          variant="secondary"
          label="Count action"
          testID="motion-transition-count"
          onPress={() => setPresses((count) => count + 1)}
        />
        <Text testID="motion-transition-value">{`Actions: ${presses}`}</Text>
        <Switch
          label="Reduce motion"
          value={reducedMotion}
          onValueChange={setReducedMotion}
          testID="motion-transition-reduce"
        />
        <Text tone="muted">
          Native stack transitions follow the app/device reduced-motion setting. The switch here
          previews this story only; use Settings in the wireframe to change navigator motion.
        </Text>
      </PageSection>
    </PageScreen>
  );
}

const meta = {
  title: 'Motion/Transitions',
  component: Transitions,
  args: { themeId: 'ux', colorScheme: 'light' },
  render: () => <Transitions />,
} satisfies Meta<StoryThemeProps>;
export default meta;
type Story = StoryObj<typeof meta>;
export const NativeStack: Story = {};
export const Dark: Story = { args: { colorScheme: 'dark' } };

function PausedContentDemo() {
  const [paused, setPaused] = useState(false);
  const [draft, setDraft] = useState('Keep this draft while pausing');
  const ready = useContext(PerformanceReadyContext);
  return (
    <PerformanceReadyContext.Provider value={ready !== false && !paused}>
      <PageScreen title="Motion visibility" showBack={false}>
        <PageSection>
          <Text>Pause the placeholder without unmounting the content.</Text>
          <Switch
            label="Pause content motion"
            value={paused}
            onValueChange={setPaused}
            testID="motion-visibility-pause"
          />
          <TextInput
            label="Retained draft"
            value={draft}
            onChangeText={setDraft}
            testID="motion-visibility-draft"
          />
          <RNHostView matchContents>
            <Skeleton style={{ width: 240, height: 96 }} testID="motion-visibility-skeleton" />
          </RNHostView>
        </PageSection>
      </PageScreen>
    </PerformanceReadyContext.Provider>
  );
}

export const PausedContent: Story = {
  render: () => <PausedContentDemo />,
};
