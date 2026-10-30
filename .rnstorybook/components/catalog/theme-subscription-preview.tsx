import { useLayoutEffect, useRef } from 'react';
import {
  Column,
  ScrollView,
  Switch,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent as Text,
  nativeFillWidth,
} from '@components/ui';
import {
  ThemePreferencesProvider,
  useAppearanceSettings,
  useHeaderSettings,
  useMotionSettings,
  usePaletteSettings,
} from '@/context/theme.context';
import { spacing } from '@/constants/layout';
import { useMotionEnabled } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

/** Commit logging stays in this development fixture and never updates React state. */
function useCommitLog(name: string) {
  const commits = useRef(0);
  useLayoutEffect(() => {
    commits.current += 1;
    console.info(`[theme-subscription] ${name}: ${commits.current}`);
  });
}

export function ThemeSubscriptionPreview() {
  return (
    <ThemePreferencesProvider initialColorScheme="light" initialReducedMotion={false}>
      <UniversalHost matchContents={false} style={{ flex: 1 }}>
        <ScrollView>
          <Column spacing={spacing.lg} modifiers={nativeFillWidth} style={{ padding: spacing.lg }}>
            <Text variant="title">Theme subscriptions</Text>
            <Text>
              After startup settles, watch [theme-subscription] in the console. Header changes
              commit the header probe; motion changes commit motion and motion-gate; appearance
              changes commit appearance and colors. Palette stays unchanged.
            </Text>
            <PaletteProbe />
            <ColorProbe />
            <AppearanceProbe />
            <HeaderProbe />
            <MotionProbe />
            <MotionGateProbe />
          </Column>
        </ScrollView>
      </UniversalHost>
    </ThemePreferencesProvider>
  );
}

function PaletteProbe() {
  const { themeId } = usePaletteSettings();
  useCommitLog('palette');
  return <Text testID="theme-subscription-palette">{`Palette: ${themeId}`}</Text>;
}

function ColorProbe() {
  const colors = useThemeColors();
  useCommitLog('colors');
  return <Text testID="theme-subscription-colors">{`Background: ${colors.background}`}</Text>;
}

function AppearanceProbe() {
  const { colorScheme, setColorScheme } = useAppearanceSettings();
  useCommitLog('appearance');
  return (
    <UniversalButtonContent
      variant="secondary"
      label={`Appearance: ${colorScheme}`}
      onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
      testID="theme-subscription-appearance"
    />
  );
}

function HeaderProbe() {
  const { headerShape, setHeaderShape } = useHeaderSettings();
  useCommitLog('header');
  return (
    <UniversalButtonContent
      variant="secondary"
      label={`Header: ${headerShape}`}
      onPress={() => setHeaderShape(headerShape === 'default' ? 'dunes' : 'default')}
      testID="theme-subscription-header"
    />
  );
}

function MotionProbe() {
  const { reducedMotion, setReducedMotion } = useMotionSettings();
  useCommitLog('motion');
  return (
    <Switch
      label="Reduce motion"
      value={reducedMotion === true}
      onValueChange={setReducedMotion}
      testID="theme-subscription-motion"
    />
  );
}

function MotionGateProbe() {
  const enabled = useMotionEnabled();
  useCommitLog('motion-gate');
  return <Text testID="theme-subscription-motion-gate">{`Motion enabled: ${enabled}`}</Text>;
}
