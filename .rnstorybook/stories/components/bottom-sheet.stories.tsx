import {
  BottomSheet,
  type BottomSheetProps,
  Column,
  ButtonContent,
  UniversalText,
  UniversalTextContent,
  Button,
  nativeFillWidth,
  Icon,
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

type DemoProps = BottomSheetProps & {
  example: 'modal' | 'inline' | 'custom-action';
  colorScheme: 'light' | 'dark';
  title: string;
  content: string;
  onOpen: () => void;
  onClose: () => void;
};

function BottomSheetDemo({ example, ...args }: Readonly<DemoProps>) {
  return example === 'modal' ? (
    <ModalSheetDemo example={example} {...args} />
  ) : (
    <InlineSheetDemo example={example} {...args} />
  );
}

function ModalSheetDemo({ title, content, onOpen, onClose, ...args }: Readonly<DemoProps>) {
  const [isPresented, setIsPresented] = useState(args.isPresented);
  const [controlledPresentation, setControlledPresentation] = useState(args.isPresented);
  if (controlledPresentation !== args.isPresented) {
    setControlledPresentation(args.isPresented);
    setIsPresented(args.isPresented);
  }
  return (
    <View style={{ gap: 20 }}>
      <Button
        variant="secondary"
        testID={args.testID ? `${args.testID}-open` : undefined}
        label="Open bottom sheet"
        colorScheme={args.colorScheme}
        onPress={() => {
          setIsPresented(true);
          onOpen();
        }}
      />
      <UniversalText
        testID={args.testID ? `${args.testID}-state` : undefined}
        colorScheme={args.colorScheme}
      >
        {`State: ${isPresented ? 'Open' : 'Closed'}. Swipe down or tap Close to dismiss.`}
      </UniversalText>
      <UniversalText colorScheme={args.colorScheme}>
        The sheet uses the active theme surface color and native dismissal. The iOS drag indicator
        is hidden.
      </UniversalText>
      <BottomSheet
        {...args}
        isPresented={isPresented}
        onDismiss={() => {
          setIsPresented(false);
          args.onDismiss();
        }}
        title={title}
        headerAction={{
          icon: Icon.select({ ios: 'xmark', android: 'close' }),
          accessibilityLabel: 'Close sheet',
          testID: `${args.testID}-header-close`,
          onPress: () => {
            setIsPresented(false);
            onClose();
          },
        }}
      >
        <Column
          testID={args.testID ? `${args.testID}-content` : undefined}
          spacing={16}
          modifiers={nativeFillWidth}
        >
          <UniversalTextContent
            testID={args.testID ? `${args.testID}-description` : undefined}
            textStyle={{ fontSize: 16 }}
          >
            {content}
          </UniversalTextContent>
          <ButtonContent
            variant="secondary"
            fullWidth
            testID={args.testID ? `${args.testID}-close` : undefined}
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
  example,
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
              Drag the header or tap the handle. The dock stays interactive above the sheet.
            </UniversalTextContent>
            <UniversalTextContent
              testID={`${testID}-action-count`}
            >{`Custom action presses: ${presses}. Selected tab: ${activeId}.`}</UniversalTextContent>
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
          title={title}
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
          headerAction={
            example === 'custom-action'
              ? {
                  icon: Icon.select({ ios: 'bookmark', android: 'bookmark' }),
                  accessibilityLabel: 'Run custom action without closing',
                  onPress: () => setPresses((current) => current + 1),
                  testID: `${testID}-custom-action`,
                }
              : {
                  icon: Icon.select({ ios: 'xmark', android: 'close' }),
                  accessibilityLabel: 'Close sheet',
                  onPress: () => {
                    setIsPresented(false);
                    onClose();
                  },
                  testID: `${testID}-header-close`,
                }
          }
        >
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
    example: 'inline',
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
    example: { control: 'select', options: ['modal', 'inline', 'custom-action'] },
    isPresented: { control: 'boolean' },
    title: { control: 'text' },
    content: { control: 'text' },
    contentHeight: { control: { type: 'number', min: 1 } },
    children: { control: false },
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
