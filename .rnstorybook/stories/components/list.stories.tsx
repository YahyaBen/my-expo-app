import { useThemeColors } from '@/hooks/use-theme';
import {
  Icon,
  EmptyState,
  ListItem,
  UniversalTextContent as Text,
  UniversalText as RNText,
} from '@components/ui';
import { UniversalList, type UniversalListProps } from '../../components/showcase/universal-list';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame, nativeThemeControls } from '../../components/native-story-frame';

const leadingIcon = Icon.select({
  ios: 'star.fill',
  android: 'star',
});

type DemoProps = UniversalListProps & {
  itemCount: number;
  supportingText: boolean;
  showLeading: boolean;
  showTrailing: boolean;
  disabledRows: boolean;
  onRowPress: (row: number) => void;
};

function ListDemo({
  itemCount,
  supportingText,
  showLeading,
  showTrailing,
  disabledRows,
  onRowPress,
  ...args
}: Readonly<DemoProps>) {
  const colors = useThemeColors(args.colorScheme);
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <View style={{ gap: 16 }}>
      <RNText testID={args.testID ? `${args.testID}-status` : undefined}>
        {`Selected row: ${selected ?? 'None'}`}
      </RNText>
      <UniversalList {...args}>
        {itemCount === 0 ? (
          <ListItem testID={args.testID ? `${args.testID}-empty` : undefined}>
            <EmptyState
              title="No items available"
              description="There’s nothing to show here yet."
              testID={args.testID ? `${args.testID}-empty-content` : undefined}
              titleTestID={args.testID ? `${args.testID}-empty-text` : undefined}
            />
          </ListItem>
        ) : null}
        {Array.from({ length: itemCount }, (_, i) => (
          <ListItem
            key={i}
            testID={args.testID ? `${args.testID}-row-${i + 1}` : undefined}
            supportingText={supportingText ? `Supporting details for item ${i + 1}` : undefined}
            onPress={
              disabledRows
                ? undefined
                : () => {
                    setSelected(i + 1);
                    onRowPress(i + 1);
                  }
            }
          >
            {showLeading ? (
              <ListItem.Leading>
                <Icon
                  name={leadingIcon}
                  size={24}
                  color={colors.text}
                  testID={args.testID ? `${args.testID}-row-${i + 1}-icon` : undefined}
                />
              </ListItem.Leading>
            ) : null}
            <Text
              testID={args.testID ? `${args.testID}-row-${i + 1}-label` : undefined}
            >{`Item ${i + 1}`}</Text>
            {showTrailing ? (
              <ListItem.Trailing>
                <Text testID={args.testID ? `${args.testID}-row-${i + 1}-trailing` : undefined}>
                  {selected === i + 1 ? 'Selected' : 'Open'}
                </Text>
              </ListItem.Trailing>
            ) : null}
          </ListItem>
        ))}
      </UniversalList>
    </View>
  );
}

const meta = {
  title: 'Components/List',
  component: ListDemo,
  args: {
    testID: 'expo-ui-list',
    itemCount: 8,
    supportingText: true,
    showLeading: true,
    showTrailing: true,
    disabledRows: false,
    viewportHeight: 400,
    colorScheme: 'dark',
    onRowPress: action('list row pressed'),
    example: 'list',
  },
  argTypes: {
    ...nativeThemeControls,
    itemCount: { control: { type: 'number', min: 0, max: 30, step: 1 } },
    supportingText: { control: 'boolean' },
    showLeading: { control: 'boolean' },
    showTrailing: { control: 'boolean' },
    disabledRows: { control: 'boolean' },
    viewportHeight: { control: { type: 'number', min: 200, max: 600 } },
    children: { control: false },
    onRowPress: { control: false },
    example: { control: 'select', options: ['list', 'compound-slots'] },
  },
  render: ({ example, ...args }) => (
    <NativeStoryFrame {...args}>
      {example === 'compound-slots' ? <CompoundSlotsDemo {...args} /> : <ListDemo {...args} />}
    </NativeStoryFrame>
  ),
} satisfies Meta<DemoProps & { example: 'list' | 'compound-slots' }>;

export default meta;

type Story = StoryObj<typeof meta>;

function CompoundSlotsDemo(args: Readonly<DemoProps>) {
  const [presses, setPresses] = useState(0);
  return (
    <View style={{ gap: 16 }}>
      <RNText
        colorScheme={args.colorScheme}
        testID="list-compound-status"
      >{`Row presses: ${presses}`}</RNText>
      <UniversalList {...args}>
        <ListItem
          testID="list-compound-row"
          leading="Shorthand leading"
          supportingText="Shorthand supporting"
          trailing="Shorthand trailing"
          onPress={() => setPresses((count) => count + 1)}
        >
          <>
            {'A shared row with nested compound slots'}
            <>
              <ListItem.Leading>Badge</ListItem.Leading>
              <ListItem.Supporting>{0}</ListItem.Supporting>
              <ListItem.Trailing>Open</ListItem.Trailing>
            </>
          </>
        </ListItem>
        <ListItem testID="list-compound-passive-row">Row without an action</ListItem>
      </UniversalList>
    </View>
  );
}

export const Playground: Story = {};

export const Empty: Story = { args: { itemCount: 0 } };
