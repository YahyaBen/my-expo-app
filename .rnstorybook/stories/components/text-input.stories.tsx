import {
  Column,
  UniversalHost as Host,
  Icon,
  UniversalTextContent as Text,
  type TextInputRef,
  UniversalButtonContent,
  TextInput,
  type TextInputProps,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useRef, useState } from 'react';
import { View } from 'react-native';
import { action } from 'storybook/actions';

const searchIcon = Icon.select({
  ios: 'magnifyingglass',
  android: 'search',
});

const clearIcon = Icon.select({
  ios: 'xmark.circle.fill',
  android: 'cancel',
});

/** Story-only RN boundary; application fields compose inside their existing Host. */
function InputPreview(props: Readonly<TextInputProps>) {
  return (
    <Host
      colorScheme={props.colorScheme}
      testID={props.testID ? `${props.testID}-container` : undefined}
    >
      <TextInput {...props} />
    </Host>
  );
}

const meta = {
  title: 'Components/Text Input',
  component: TextInput,
  args: {
    testID: 'expo-ui-text-input',
    label: 'Display name',
    placeholder: 'Enter your name',
    defaultValue: '',
    helperText: 'This name appears on your profile.',
    status: 'default',
    colorScheme: 'dark',
    disabled: false,
    readOnly: false,
    autoFocus: false,
    multiline: false,
    secureTextEntry: false,
    autoCapitalize: 'sentences',
    autoCorrect: true,
    onFocus: action('input focused'),
    onBlur: action('input blurred'),
    onChangeText: action('text changed'),
    onSubmitEditing: action('input submitted'),
    onSelectionChange: action('selection changed'),
    onContentSizeChange: action('size changed'),
    example: 'input',
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    defaultValue: {
      control: 'text',
      description: 'Changing this control remounts the field with the new initial text.',
    },
    helperText: { control: 'text' },
    status: { control: 'select', options: ['default', 'error', 'success', 'warning'] },
    disabled: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    editable: { control: 'boolean', description: 'Overrides readOnly when explicitly set.' },
    autoFocus: { control: 'boolean' },
    multiline: { control: 'boolean' },
    secureTextEntry: { control: 'boolean' },
    autoCorrect: { control: 'boolean' },
    autoCapitalize: { control: 'select', options: ['none', 'sentences', 'words', 'characters'] },
    keyboardType: {
      control: 'select',
      options: ['default', 'email-address', 'number-pad', 'decimal-pad', 'phone-pad', 'url'],
    },
    returnKeyType: {
      control: 'select',
      options: ['default', 'done', 'go', 'next', 'search', 'send'],
    },
    inputMode: {
      control: 'select',
      options: ['text', 'decimal', 'numeric', 'tel', 'search', 'email', 'url'],
    },
    enterKeyHint: {
      control: 'select',
      options: ['enter', 'done', 'go', 'next', 'previous', 'search', 'send'],
    },
    autoComplete: {
      control: 'select',
      options: [
        'off',
        'name',
        'email',
        'tel',
        'username',
        'current-password',
        'new-password',
        'one-time-code',
      ],
    },
    numberOfLines: { control: { type: 'number', min: 1, max: 10 } },
    maxLength: { control: { type: 'number', min: 1, max: 500 } },
    textAlign: { control: 'select', options: ['auto', 'left', 'center', 'right'] },
    caretHidden: { control: 'boolean' },
    selectTextOnFocus: { control: 'boolean' },
    cursorColor: { control: 'color' },
    placeholderTextColor: { control: 'color' },
    selectionColor: { control: 'color' },
    selectionHandleColor: { control: 'color' },
    value: { control: false },
    selection: { control: false },
    ref: { control: false },
    leftIcon: { control: false },
    rightIcon: { control: false },
    rightIconAccessibilityLabel: { control: 'text' },
    onRightIconPress: { action: 'right icon pressed', control: false },
    modifiers: { control: false },
    onChangeText: { action: 'text changed' },
    onFocus: { action: 'focused' },
    onBlur: { action: 'blurred' },
    onSubmitEditing: { action: 'submitted' },
    onSelectionChange: { action: 'selection changed' },
    onContentSizeChange: { action: 'size changed' },
    example: {
      control: 'select',
      options: ['input', 'controlled', 'filtered', 'clear-icon', 'password', 'imperative'],
    },
  },
  decorators: [
    (Story, context) => (
      <View
        testID={context.args.testID ? `${context.args.testID}-canvas` : undefined}
        style={{ flex: 1, padding: 24 }}
      >
        <Story />
      </View>
    ),
  ],
  render: ({ example, ...args }) => {
    const key = JSON.stringify([args.defaultValue, args.autoFocus, args.multiline]);
    switch (example) {
      case 'controlled':
        return <ControlledInputDemo key={key} {...args} />;
      case 'filtered':
        return <FilteredControlledInputDemo key={key} {...args} testID="filtered-input" />;
      case 'clear-icon':
        return <IconInputDemo key={`${key}-${args.disabled}`} {...args} />;
      case 'password':
        return <PasswordVisibilityDemo key={key} {...args} />;
      case 'imperative':
        return <InputActionsDemo key={key} {...args} />;
      default:
        return <InputPreview key={key} {...args} />;
    }
  },
  parameters: {
    controls: { exclude: /^(testID|modifiers|children|ref|on[A-Z].*)$/ },
    docs: {
      description: {
        component:
          'Use example to explore controlled editing, digit filtering, icon actions, password visibility and imperative focus/selection. Programmatic selection requires iOS 18+ and is supported on Android; secure fields ignore selection and multiline on iOS.',
      },
    },
  },
} satisfies Meta<
  TextInputProps & {
    example: 'input' | 'controlled' | 'filtered' | 'clear-icon' | 'password' | 'imperative';
  }
>;

export default meta;

type Story = StoryObj<typeof meta>;

function FilteredControlledInputDemo(args: Readonly<TextInputProps>) {
  const [value, setValue] = useState((args.defaultValue ?? '').replace(/[^0-9]/g, ''));
  return (
    <Host colorScheme={args.colorScheme}>
      <Column spacing={16}>
        <TextInput
          {...args}
          value={value}
          onChangeText={(text) => {
            setValue(text.replace(/[^0-9]/g, ''));
            args.onChangeText?.(text);
          }}
        />
        <Text testID="filtered-input-value">{`Controlled value: ${value}`}</Text>
        <UniversalButtonContent
          variant="secondary"
          label="Reset to 123"
          testID="filtered-input-reset"
          onPress={() => setValue('123')}
        />
      </Column>
    </Host>
  );
}

function IconInputDemo(args: Readonly<TextInputProps>) {
  const [value, setValue] = useState(args.defaultValue ?? '');
  const [pressCount, setPressCount] = useState(0);
  const [disabled, setDisabled] = useState(args.disabled ?? false);
  return (
    <View style={{ gap: 20 }}>
      <InputPreview
        {...args}
        leftIcon={searchIcon}
        rightIcon={clearIcon}
        rightIconAccessibilityLabel={args.rightIconAccessibilityLabel ?? 'Clear search'}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          args.onChangeText?.(text);
        }}
        disabled={disabled}
        onRightIconPress={() => {
          setValue('');
          setPressCount((count) => count + 1);
          action('right icon pressed')();
        }}
      />
      <Host
        matchContents={{ vertical: true }}
        colorScheme={args.colorScheme}
        style={{ width: '100%' }}
      >
        <Column spacing={10}>
          <Text
            testID={args.testID ? `${args.testID}-press-count` : undefined}
          >{`Right icon presses: ${pressCount}`}</Text>
          <UniversalButtonContent
            variant="secondary"
            testID={args.testID ? `${args.testID}-toggle-disabled` : undefined}
            label={disabled ? 'Enable input' : 'Disable input'}
            onPress={() => setDisabled((current) => !current)}
          />
        </Column>
      </Host>
    </View>
  );
}

function PasswordVisibilityDemo(args: Readonly<TextInputProps>) {
  const [value, setValue] = useState(args.defaultValue ?? '');
  const [shown, setShown] = useState(false);
  const [layout, setLayout] = useState({ first: 0, current: 0 });
  const [toggles, setToggles] = useState(0);
  const stable = layout.first > 0 && Math.abs(layout.current - layout.first) < 0.5;
  return (
    <View style={{ gap: 16 }}>
      <View
        onLayout={({ nativeEvent }) => {
          const next = nativeEvent.layout.height;
          if (next <= 0) return;
          setLayout((previous) =>
            previous.current === next ? previous : { first: previous.first || next, current: next },
          );
        }}
      >
        <InputPreview
          {...args}
          value={value}
          onChangeText={(text) => {
            setValue(text);
            args.onChangeText?.(text);
          }}
          secureTextEntry={!shown}
          leftIcon={Icon.select({
            ios: 'lock',
            android: 'lock',
          })}
          rightIcon={Icon.select({
            ios: shown ? 'eye.slash' : 'eye',
            android: shown ? 'visibility_off' : 'visibility',
          })}
          rightIconAccessibilityLabel={shown ? 'Hide password' : 'Show password'}
          onRightIconPress={() => {
            setShown((current) => !current);
            setToggles((count) => count + 1);
          }}
        />
      </View>
      <Host colorScheme={args.colorScheme}>
        <Column spacing={8}>
          <Text testID="password-layout-state">
            {`Height ${stable ? 'stable' : 'changed'}: ${Math.round(layout.current)} points`}
          </Text>
          <Text testID="password-visibility-state">
            {`Password ${shown ? 'shown' : 'hidden'} · Toggles: ${toggles}`}
          </Text>
        </Column>
      </Host>
    </View>
  );
}

function InputActionsDemo(args: Readonly<TextInputProps>) {
  const ref = useRef<TextInputRef>(null);
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 20 }}>
      <InputPreview
        {...args}
        ref={ref}
        onFocus={() => {
          setFocused(true);
          args.onFocus?.();
        }}
        onBlur={() => {
          setFocused(false);
          args.onBlur?.();
        }}
      />
      <Host
        matchContents={{ vertical: true }}
        colorScheme={args.colorScheme}
        style={{ width: '100%' }}
      >
        <Column testID={args.testID ? `${args.testID}-actions` : undefined} spacing={10}>
          <Text testID={args.testID ? `${args.testID}-focus-state` : undefined}>
            {focused ? 'Input focused' : 'Input blurred'}
          </Text>
          <UniversalButtonContent
            variant="secondary"
            testID={args.testID ? `${args.testID}-focus` : undefined}
            label="Focus"
            onPress={() => {
              action('focus button pressed')();
              ref.current?.focus();
            }}
          />
          <UniversalButtonContent
            variant="secondary"
            testID={args.testID ? `${args.testID}-blur` : undefined}
            label="Blur"
            onPress={() => {
              action('blur button pressed')();
              ref.current?.blur();
            }}
          />
          <UniversalButtonContent
            variant="secondary"
            testID={args.testID ? `${args.testID}-clear` : undefined}
            label="Clear"
            onPress={() => {
              action('clear button pressed')();
              ref.current?.clear();
            }}
          />
          <UniversalButtonContent
            variant="secondary"
            testID={args.testID ? `${args.testID}-select` : undefined}
            label="Select first five characters"
            onPress={() => {
              action('select button pressed')();
              ref.current?.focus();
              void ref.current?.setSelection(0, 5);
            }}
          />
        </Column>
      </Host>
    </View>
  );
}

function ControlledInputDemo(args: Readonly<TextInputProps>) {
  const [value, setValue] = useState(args.defaultValue ?? '');
  return (
    <View style={{ gap: 20 }}>
      <InputPreview
        {...args}
        value={value}
        onChangeText={(text) => {
          setValue(text);
          args.onChangeText?.(text);
        }}
      />
      <Host
        matchContents={{ vertical: true }}
        colorScheme={args.colorScheme}
        style={{ width: '100%' }}
      >
        <Column testID={args.testID ? `${args.testID}-actions` : undefined} spacing={10}>
          <Text
            testID={args.testID ? `${args.testID}-description` : undefined}
          >{`Controlled value: ${value}`}</Text>
          <UniversalButtonContent
            variant="secondary"
            testID={args.testID ? `${args.testID}-set-value` : undefined}
            label="Set value from JavaScript"
            onPress={() => {
              action('set value button pressed')();
              setValue('UPDATED');
            }}
          />
          <UniversalButtonContent
            variant="secondary"
            testID={args.testID ? `${args.testID}-reset` : undefined}
            label="Reset value"
            onPress={() => {
              action('reset button pressed')();
              setValue('');
            }}
          />
        </Column>
      </Host>
    </View>
  );
}

export const Playground: Story = {};
