import {
  BottomSheet,
  type BottomSheetProps,
  Column,
  ButtonContent,
  UniversalText,
  UniversalTextContent,
  Button,
  nativeFillWidth,
  TabNavigationBar,
  UniversalHost,
  type TabNavigationItemId,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/hooks/use-theme';
import { action } from 'storybook/actions';
import { NativeStoryFrame } from '../../components/native-story-frame';

type DemoProps = Pick<BottomSheetProps, 'isPresented' | 'onDismiss' | 'testID'> & {
  example: 'modal' | 'inline';
  contentHeight?: number;
  colorScheme: 'light' | 'dark';
  title: string;
  content: string;
  onOpen: () => void;
  onClose: () => void;
};

function BottomSheetDemo(args: Readonly<DemoProps>) {
  return args.example === 'modal' ? <ModalSheetDemo {...args} /> : <InlineSheetDemo {...args} />;
}

function ModalSheetDemo({
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

function InlineSheetDemo({
  title,
  content,
  colorScheme,
  testID,
  onOpen,
  onClose,
  onDismiss,
}: Readonly<DemoProps>) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors(colorScheme);
  const [isPresented, setIsPresented] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [presses, setPresses] = useState(0);
  const [activeId, setActiveId] = useState<TabNavigationItemId>('search');
  return (
    <View style={{ flex: 1, paddingTop: insets.top + 16, backgroundColor: colors.background }}>
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <UniversalHost colorScheme={colorScheme}>
          <Column spacing={12} modifiers={nativeFillWidth}>
            <UniversalTextContent>
              Drag or tap the handle. The dock stays interactive above the sheet.
            </UniversalTextContent>
            <UniversalTextContent
              testID={`${testID}-action-count`}
            >{`Action presses: ${presses}. Selected tab: ${activeId}.`}</UniversalTextContent>
            <ButtonContent
              variant="secondary"
              label="Reopen sheet"
              testID={`${testID}-open`}
              onPress={() => {
                setIsPresented(true);
                onOpen();
              }}
            />
          </Column>
        </UniversalHost>
        <BottomSheet
          presentation="inline"
          isPresented={isPresented}
          onDismiss={() => {
            setIsPresented(false);
            onDismiss();
          }}
          height={400}
          collapsedHeight={240}
          expanded={expanded}
          onExpandedChange={setExpanded}
          bottomClearance={28}
          expandAccessibilityLabel="Expand sheet"
          collapseAccessibilityLabel="Collapse sheet"
          collapsedContent={
            <UniversalTextContent>
              Tap or drag the handle to explore the content.
            </UniversalTextContent>
          }
          testID={testID}
        >
          <UniversalTextContent variant="subtitle" testID={testID ? `${testID}-title` : undefined}>
            {title}
          </UniversalTextContent>
          <UniversalTextContent>{content}</UniversalTextContent>
          {Array.from({ length: 8 }, (_, index) => (
            <UniversalTextContent
              key={index}
            >{`Scrollable item ${index + 1}`}</UniversalTextContent>
          ))}
          <ButtonContent
            variant="secondary"
            fullWidth
            label="Final action"
            testID={`${testID}-final-action`}
            onPress={() => setPresses((current) => current + 1)}
          />
          <ButtonContent
            variant="link"
            label="Close"
            testID={testID ? `${testID}-header-close` : undefined}
            onPress={() => {
              setIsPresented(false);
              onClose();
            }}
          />
        </BottomSheet>
      </View>
      <TabNavigationBar
        colorScheme={colorScheme}
        bottomInset={insets.bottom}
        activeId={activeId}
        onSelect={setActiveId}
        items={[
          { id: 'home', label: 'Home' },
          { id: 'search', label: 'Search' },
          { id: 'recipes', label: 'Components' },
          { id: 'more', label: 'More' },
        ]}
        action={{
          kind: 'continue',
          label: 'Count action',
          onPress: () => setPresses((current) => current + 1),
          testID: `${testID}-dock-action`,
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Components/Bottom Sheet',
  component: BottomSheetDemo,
  args: {
    example: 'modal',
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
    example: { control: 'select', options: ['modal', 'inline'] },
    isPresented: { control: 'boolean' },
    title: { control: 'text' },
    content: { control: 'text' },
    contentHeight: { control: { type: 'number', min: 1 } },
    onOpen: { control: false },
    onClose: { control: false },
    onDismiss: { control: false },
  },
  render: (args) =>
    args.example === 'modal' ? (
      <NativeStoryFrame {...args}>
        <BottomSheetDemo {...args} />
      </NativeStoryFrame>
    ) : (
      <BottomSheetDemo {...args} />
    ),
} satisfies Meta<typeof BottomSheetDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
