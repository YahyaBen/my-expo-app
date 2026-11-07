import { useAppTheme } from '@/hooks/use-theme';
import { useMemo, type ReactNode } from 'react';
import { View } from 'react-native';
import { PageMotionContext, type PageMotionSettings } from './page-motion-context';
import { DEFAULT_HEADER_SHAPE, type PageHeaderStyle } from '@/constants/header-motion';

export type { PageHeaderShape, PageHeaderStyle } from '@/constants/header-motion';

type PageMotionOverlayProps = {
  animate?: boolean;
  colorScheme?: 'light' | 'dark';
  shape?: PageHeaderStyle;
  children?: ReactNode;
  visible?: boolean;
};

/** Share header choices without placing a drawing surface above native navigation. */
export function PageMotionOverlay({
  children,
  shape = DEFAULT_HEADER_SHAPE,
  animate = true,
  visible = true,
  colorScheme,
}: Readonly<PageMotionOverlayProps>) {
  const { design } = useAppTheme(colorScheme);
  const enabled = design.header.artwork;
  const motion = useMemo<PageMotionSettings | null>(
    () => (enabled && shape !== 'default' ? { shape, animate, visible, colorScheme } : null),
    [enabled, shape, animate, visible, colorScheme],
  );

  return (
    <PageMotionContext.Provider value={motion}>
      <View style={{ flex: 1 }}>{children}</View>
    </PageMotionContext.Provider>
  );
}
