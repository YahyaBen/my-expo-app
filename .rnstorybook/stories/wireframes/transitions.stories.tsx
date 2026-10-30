import {
  PageMotionOverlay,
  PageScreen,
  PageSection,
  Picker,
  RNHostView,
  Skeleton,
  Switch,
  TextInput,
  UniversalButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { router } from 'expo-router';
import { useContext, useState } from 'react';
import { HEADER_STYLES, type PageHeaderStyle } from '@/constants/header-motion';
import { useThemeSettings } from '@/context/theme.context';
import { PerformanceReadyContext } from '@/context/performance-ready.context';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import type { StoryThemeProps } from '../../components/story-theme';

function Transitions() {
  const [draft, setDraft] = useState('Retain this draft');
  const [presses, setPresses] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [shape, setShape] = useState<PageHeaderStyle>('dunes');
  const { setReducedMotion } = useThemeSettings();
  const reducedMotion = useAppReducedMotion();
  return (
    <PageMotionOverlay shape={shape} expanded={expanded}>
      <PageScreen title="Transitions" description="" showBack={false}>
        <PageSection testID="motion-transitions">
          <Text>
            Open the wireframe, then use its Back button or Android system Back. Your draft and
            action count stay here.
          </Text>
          <TextInput
            label="Retained draft"
            value={draft}
            onChangeText={setDraft}
            testID="motion-transition-draft"
          />
          <UniversalButtonContent
            variant="primary"
            label="Open wireframe"
            testID="motion-transition-open"
            onPress={() => router.push({ pathname: '/', params: { preview: 'true' } })}
          />
          <UniversalButtonContent
            variant="secondary"
            label="Count action"
            testID="motion-transition-count"
            onPress={() => setPresses((count) => count + 1)}
          />
          <Text testID="motion-transition-value">{`Actions: ${presses}`}</Text>
          <Text variant="label">Header style</Text>
          <Picker<PageHeaderStyle>
            selectedValue={shape}
            onValueChange={setShape}
            testID="motion-transition-header"
          >
            {HEADER_STYLES.map((value) => (
              <Picker.Item key={value} value={value} label={value} />
            ))}
          </Picker>
          <Switch
            label="Expand header"
            value={expanded}
            onValueChange={setExpanded}
            testID="motion-transition-expand"
          />
          <Switch
            label="Reduce header motion"
            value={reducedMotion}
            onValueChange={setReducedMotion}
            testID="motion-transition-reduce"
          />
          <Text tone="muted">
            Native stack transitions follow the app/device reduced-motion setting.
          </Text>
        </PageSection>
      </PageScreen>
    </PageMotionOverlay>
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
      <PageMotionOverlay shape="rain">
        <PageScreen title="Motion visibility" description="" showBack={false}>
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
      </PageMotionOverlay>
    </PerformanceReadyContext.Provider>
  );
}

export const PausedContent: Story = {
  render: () => <PausedContentDemo />,
};
