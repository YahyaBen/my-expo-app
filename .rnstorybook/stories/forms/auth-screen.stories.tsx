import {
  Column,
  FieldGroup,
  nativeFillWidth,
  AuthScreenFrame,
  FormSubmit,
  FormTextInput,
  Icon,
} from '@components/ui';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useState } from 'react';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import { loginResolver } from '@/validation/resolvers/auth';
import type { LoginFormValues } from '@/validation/schemas/auth';
import type { StoryThemeProps } from '../../components/story-theme';

function NativeFormDemo({
  pending = false,
  icons = false,
  loginHelperText,
  colorScheme = 'dark',
  frameColorScheme,
  grouped = false,
  viewportHeight,
  viewportWidth,
  fieldSelectors = true,
}: {
  pending?: boolean;
  icons?: boolean;
  loginHelperText?: string;
  colorScheme?: 'light' | 'dark';
  frameColorScheme?: 'light' | 'dark';
  grouped?: boolean;
  viewportHeight?: number;
  viewportWidth?: number;
  fieldSelectors?: boolean;
}) {
  const [submissions, setSubmissions] = useState(0);
  const form = useForm<LoginFormValues>({
    resolver: loginResolver,
    defaultValues: { login: '', password: '' },
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });
  const fields = (
    <Column spacing={20} modifiers={nativeFillWidth}>
      <FormTextInput
        control={form.control}
        name="login"
        label="Email or username"
        helperText={loginHelperText}
        leftIcon={
          icons
            ? Icon.select({ ios: 'person', android: require('@expo/material-symbols/person.xml') })
            : undefined
        }
        testID={fieldSelectors ? 'native-form-login' : undefined}
        disabled={pending}
        autoCapitalize="none"
        returnKeyType="next"
        onSubmitEditing={() => form.setFocus('password')}
        onEdited={() => {}}
      />
      <FormTextInput
        control={form.control}
        name="password"
        label="Password"
        leftIcon={
          icons
            ? Icon.select({ ios: 'lock', android: require('@expo/material-symbols/lock.xml') })
            : undefined
        }
        passwordToggle={icons ? 'icon' : 'button'}
        testID={fieldSelectors ? 'native-form-password' : undefined}
        password
        disabled={pending}
        onEdited={() => {}}
      />
      <FormSubmit
        testID="native-form-submit"
        label="Test submit"
        pending={pending}
        notice={`Submissions: ${submissions}`}
        onPress={() => void form.handleSubmit(() => setSubmissions((count) => count + 1))()}
      />
    </Column>
  );
  return (
    <View
      style={{
        ...(viewportHeight === undefined ? { flex: 1 } : { height: viewportHeight }),
        width: '100%',
        maxWidth: viewportWidth,
        alignSelf: 'center',
      }}
    >
      <AuthScreenFrame
        testID="native-form"
        colorScheme={frameColorScheme ?? colorScheme}
        grouped={grouped}
        title="One native Host"
        description="The configured brand owns the header name and heading font. Fields reserve no empty message space; errors and hints wrap below their input."
      >
        {grouped ? <FieldGroup.Section title="Account">{fields}</FieldGroup.Section> : fields}
      </AuthScreenFrame>
    </View>
  );
}

const meta = {
  title: 'Forms/Login Form',
  component: NativeFormDemo,
  args: { pending: false, icons: false, colorScheme: 'dark' },
  argTypes: {
    pending: { control: 'boolean' },
    icons: { control: 'boolean' },
    loginHelperText: { control: 'text' },
    colorScheme: { control: 'select', options: ['light', 'dark'] },
    frameColorScheme: { control: 'select', options: ['light', 'dark'] },
    grouped: { control: 'boolean' },
    viewportHeight: { control: 'number' },
    viewportWidth: { control: 'number' },
  },
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<Parameters<typeof NativeFormDemo>[0] & StoryThemeProps>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SharedHost: Story = {};

export const Pending: Story = { args: { pending: true } };

export const WithoutFieldSelectors: Story = { args: { fieldSelectors: false } };

export const GroupedForm: Story = { args: { grouped: true } };

export const NarrowScreen: Story = { args: { viewportWidth: 360 } };

export const WideScreen: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Use the full available preview on a wide device or window. Check equal outer margins, editable fields and keyboard access without forcing an oversized canvas.',
      },
    },
  },
};

export const WideScreenOverflow: Story = {
  args: {
    viewportHeight: 360,
    loginHelperText:
      'This wrapped helper makes the short viewport scroll. Reach the password field and submit action while retaining the centered content width.',
  },
};

export const AltareaLight: Story = {
  args: { themeId: 'altarea', colorScheme: 'light', icons: true },
};

export const AltareaDark: Story = {
  args: { themeId: 'altarea', colorScheme: 'dark', icons: true },
};

export const HostSchemeOverride: Story = {
  args: {
    colorScheme: 'light',
    frameColorScheme: 'dark',
    loginHelperText: 'Fields and validation feedback follow the dark form Host.',
  },
};
