import type { PropsWithChildren } from 'react';
import { Column, ScrollView, Switch, UniversalHost, nativeFillWidth } from '@components/ui';
import { spacing } from '@/constants/layout';
import { useThemeSettings } from '@/context/theme.context';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { StoryTheme, type StoryThemeProps } from './story-theme';

export type AnimatedComponentPreviewProps = StoryThemeProps & { rtl?: boolean };

/** Native content fixtures share one bounded canvas and isolated preferences. */
export function AnimatedComponentPreview({
  children,
  rtl = false,
  ...theme
}: Readonly<PropsWithChildren<AnimatedComponentPreviewProps>>) {
  return (
    <StoryTheme {...theme}>
      <UniversalHost
        layoutDirection={rtl ? 'rightToLeft' : 'leftToRight'}
        matchContents={false}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <Column spacing={spacing.xl} modifiers={nativeFillWidth} style={{ padding: spacing.lg }}>
            <ReducedMotionControl />
            {children}
          </Column>
        </ScrollView>
      </UniversalHost>
    </StoryTheme>
  );
}

function ReducedMotionControl() {
  const { setReducedMotion } = useThemeSettings();
  const reducedMotion = useAppReducedMotion();
  return (
    <Switch
      label="Reduce motion"
      value={reducedMotion}
      onValueChange={setReducedMotion}
      testID="animated-component-reduce-motion"
    />
  );
}
