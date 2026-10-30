import type { PropsWithChildren } from 'react';
import { Column, ScrollView, Switch, UniversalHost, nativeFillWidth } from '@components/ui';
import { spacing } from '@/constants/layout';
import { useMotionSettings } from '@/context/theme.context';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { StoryTheme, type StoryThemeProps } from './story-theme';

export type AnimatedComponentPreviewProps = StoryThemeProps & {
  rtl?: boolean;
  scrollable?: boolean;
};

/** Native content fixtures share one bounded canvas and isolated preferences. */
export function AnimatedComponentPreview({
  children,
  rtl = false,
  scrollable = true,
  ...theme
}: Readonly<PropsWithChildren<AnimatedComponentPreviewProps>>) {
  const content = (
    <Column spacing={spacing.xl} modifiers={nativeFillWidth} style={{ padding: spacing.lg }}>
      <ReducedMotionControl />
      {children}
    </Column>
  );
  return (
    <StoryTheme {...theme}>
      <UniversalHost
        layoutDirection={rtl ? 'rightToLeft' : 'leftToRight'}
        matchContents={false}
        style={{ flex: 1 }}
      >
        {scrollable ? <ScrollView>{content}</ScrollView> : content}
      </UniversalHost>
    </StoryTheme>
  );
}

function ReducedMotionControl() {
  const { setReducedMotion } = useMotionSettings();
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
