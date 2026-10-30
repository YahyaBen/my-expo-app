import {
  Column,
  SegmentedControl,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { triggerHaptic, type HapticFeedback } from '@/lib/haptics';
import { NativeStoryFrame } from '../../components/native-story-frame';

const feedbackOptions = [
  'action',
  'success',
  'warning',
  'error',
] as const satisfies readonly HapticFeedback[];

function HapticsDemo({ colorScheme = 'light' }: Readonly<{ colorScheme?: 'light' | 'dark' }>) {
  const [selection, setSelection] = useState('first');
  const [lastFeedback, setLastFeedback] = useState('None');
  return (
    <NativeStoryFrame colorScheme={colorScheme}>
      <UniversalHost colorScheme={colorScheme}>
        <Column spacing={16}>
          <UniversalTextContent>
            Change segments for a subtle tick. Reselecting the current segment and resetting below
            stay silent. Try the feedback buttons on a physical device.
          </UniversalTextContent>
          <SegmentedControl
            label="Haptic selection"
            selectedValue={selection}
            onValueChange={setSelection}
            options={[
              { value: 'first', label: 'First', testID: 'haptics-first' },
              { value: 'second', label: 'Second', testID: 'haptics-second' },
              { value: 'third', label: 'Third', testID: 'haptics-third' },
            ]}
          />
          <UniversalTextContent testID="haptics-selection">
            {`Selected: ${selection}`}
          </UniversalTextContent>
          <UniversalButtonContent
            variant="secondary"
            label="Reset selection silently"
            testID="haptics-reset"
            onPress={() => setSelection('first')}
          />
          {feedbackOptions.map((feedback) => (
            <UniversalButtonContent
              key={feedback}
              variant="secondary"
              label={`Preview ${feedback}`}
              testID={`haptics-${feedback}`}
              onPress={() => {
                triggerHaptic(feedback);
                setLastFeedback(feedback);
              }}
            />
          ))}
          <UniversalTextContent testID="haptics-last-feedback">
            {`Last requested feedback: ${lastFeedback}`}
          </UniversalTextContent>
        </Column>
      </UniversalHost>
    </NativeStoryFrame>
  );
}

const meta = {
  title: 'Components/Haptics',
  component: HapticsDemo,
  args: { colorScheme: 'light' },
  parameters: {
    docs: {
      description: {
        component:
          'Compare selection, action and outcome feedback on iOS and Android hardware. Selection uses a broadly supported clock tick, including Android 13; it does not require Android 14 segment effects. Android 10 and earlier use context-click/long-press outcome fallbacks. Rapid interactions are limited; an immediate outcome still plays after an action. Repeated identical outcomes within 250 ms coalesce. Android warning/error share native rejection feedback on Android 11+. System settings and hardware can suppress haptics.',
      },
    },
  },
} satisfies Meta<typeof HapticsDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
