import { useThemeColors } from '@/hooks/use-theme';
import { Icon, type IconName } from '../icon/icon';
import { triggerHaptic } from '@/lib/haptics';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { NativeFloatingActionButton } from './floating-action-button';

export type FloatingActionKind =
  'create' | 'continue' | 'filters' | 'active-filters' | 'liked' | 'profile' | 'submit';

export type FloatingActionButtonProps = {
  kind: FloatingActionKind;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  colorScheme?: 'light' | 'dark';
  testID?: string;
};

const filters = Icon.select({
  ios: 'slider.horizontal.3',
  android: 'tune',
});

const floatingActionIcons = {
  create: Icon.select({
    ios: 'fork.knife',
    android: 'fork_spoon',
  }),
  continue: Icon.select({ ios: 'plus', android: 'add' }),
  filters,
  'active-filters': filters,
  liked: Icon.select({
    ios: 'heart.fill',
    android: 'favorite',
  }),
  profile: Icon.select({
    ios: 'fork.knife',
    android: 'chef_hat',
  }),
  submit: Icon.select({ ios: 'checkmark', android: 'check' }),
} satisfies Record<FloatingActionKind, IconName>;

/** Circular native content; reuse the existing Host. */
export function FloatingActionButton({
  kind,
  label,
  onPress,
  disabled,
  colorScheme,
  testID = 'tab-context-action',
}: Readonly<FloatingActionButtonProps>) {
  const colors = useThemeColors(useHostColorScheme(colorScheme));
  return (
    <NativeFloatingActionButton
      testID={testID}
      label={label}
      onPress={() => {
        if (disabled) return;
        triggerHaptic('action');
        onPress();
      }}
      disabled={disabled}
      color={disabled ? colors.controlDisabledSurface : colors.primary}
    >
      <Icon
        name={floatingActionIcons[kind]}
        size={28}
        color={disabled ? colors.controlDisabledContent : colors.onPrimary}
      />
    </NativeFloatingActionButton>
  );
}

/** Standalone circle for a React Native boundary. */
export function FloatingAction(props: Readonly<FloatingActionButtonProps>) {
  return (
    <UniversalHost
      colorScheme={props.colorScheme}
      matchContents={false}
      ignoreSafeArea="all"
      style={{ width: 76, height: 76 }}
    >
      <FloatingActionButton {...props} />
    </UniversalHost>
  );
}
