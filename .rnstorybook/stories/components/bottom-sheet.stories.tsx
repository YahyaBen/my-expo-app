import {
  BottomSheet,
  type BottomSheetProps,
  Column,
  ButtonContent,
  UniversalText,
  UniversalTextContent,
  Button,
  nativeFillWidth,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { action } from 'storybook/actions';
import { NativeStoryFrame } from '../../components/native-story-frame';

type DemoProps = Pick<BottomSheetProps, 'isPresented' | 'onDismiss' | 'testID'> & {
  contentHeight?: number;
  colorScheme: 'light' | 'dark';
  title: string;
  content: string;
  onOpen: () => void;
  onClose: () => void;
};

function BottomSheetDemo({
  title,
  content,
  colorScheme,
  contentHeight,
  isPresented: requestedPresentation,
  testID,
  onOpen,
  onClose,
  onDismiss,
}: Readonly<DemoProps>) {
  const [isPresented, setIsPresented] = useState(requestedPresentation);
  const [controlledPresentation, setControlledPresentation] = useState(requestedPresentation);
  if (controlledPresentation !== requestedPresentation) {
    setControlledPresentation(requestedPresentation);
    setIsPresented(requestedPresentation);
  }
  return (
    <View style={{ gap: 20 }}>
      <Button
        variant="secondary"
        testID={testID ? `${testID}-open` : undefined}
        label="Open bottom sheet"
        colorScheme={colorScheme}
        onPress={() => {
          setIsPresented(true);
          onOpen();
        }}
      />
      <UniversalText testID={testID ? `${testID}-state` : undefined} colorScheme={colorScheme}>
        {`State: ${isPresented ? 'Open' : 'Closed'}. Swipe down or tap Close to dismiss.`}
      </UniversalText>
      <BottomSheet
        testID={testID}
        contentHeight={contentHeight}
        isPresented={isPresented}
        onDismiss={() => {
          setIsPresented(false);
          onDismiss();
        }}
      >
        <Column
          testID={testID ? `${testID}-content` : undefined}
          spacing={16}
          modifiers={nativeFillWidth}
        >
          <UniversalTextContent variant="subtitle" testID={testID ? `${testID}-title` : undefined}>
            {title}
          </UniversalTextContent>
          <UniversalTextContent
            testID={testID ? `${testID}-description` : undefined}
            textStyle={{ fontSize: 16 }}
          >
            {content}
          </UniversalTextContent>
          <ButtonContent
            variant="secondary"
            fullWidth
            testID={testID ? `${testID}-close` : undefined}
            label="Close"
            onPress={() => {
              setIsPresented(false);
              onClose();
            }}
          />
        </Column>
      </BottomSheet>
    </View>
  );
}

const meta = {
  title: 'Components/Bottom Sheet',
  component: BottomSheetDemo,
  args: {
    testID: 'expo-ui-bottom-sheet',
    isPresented: false,
    title: 'A native bottom sheet',
    content: 'Swipe down to dismiss this sheet, or close it and open it again.',
    colorScheme: 'dark',
    onOpen: action('open button pressed'),
    onClose: action('close button pressed'),
    onDismiss: action('sheet dismissed'),
  },
  argTypes: {
    isPresented: { control: 'boolean' },
    title: { control: 'text' },
    content: { control: 'text' },
    contentHeight: { control: { type: 'number', min: 1 } },
    onOpen: { control: false },
    onClose: { control: false },
    onDismiss: { control: false },
  },
  render: (args) => (
    <NativeStoryFrame {...args}>
      <BottomSheetDemo {...args} />
    </NativeStoryFrame>
  ),
} satisfies Meta<typeof BottomSheetDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
