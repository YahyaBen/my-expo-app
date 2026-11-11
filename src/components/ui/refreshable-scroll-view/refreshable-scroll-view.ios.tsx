import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { ScrollView } from '@expo/ui';
import { refreshable, useScrollGeometryChange } from '@expo/ui/swift-ui/modifiers';
import type { RefreshableScrollViewProps } from './refreshable-scroll-view.types';

export function RefreshableScrollView({
  onRefresh,
  onScrollGeometryChange,
  modifiers = [],
  ...props
}: Readonly<RefreshableScrollViewProps>) {
  const refresh = usePullToRefresh(onRefresh);
  const scrollModifier = useScrollGeometryChange(onScrollGeometryChange);
  // Expo UI stores this listener for native refresh events; it does not invoke it during render.
  const refreshModifier = refreshable(refresh);
  return (
    <ScrollView
      {...props}
      modifiers={[
        ...modifiers,
        ...(onRefresh && !props.disabled && !props.hidden ? [refreshModifier] : []),
        ...(scrollModifier ? [scrollModifier] : []),
      ]}
    />
  );
}
