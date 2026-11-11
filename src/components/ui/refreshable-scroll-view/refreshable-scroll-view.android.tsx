import { usePullToRefresh } from '@/hooks/use-pull-to-refresh';
import { ScrollView } from '@expo/ui';
import { PullToRefreshBox } from '@expo/ui/jetpack-compose';
import { fillMaxSize } from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';
import type { RefreshableScrollViewProps } from './refreshable-scroll-view.types';

export function RefreshableScrollView({
  onRefresh,
  onScrollGeometryChange: _onScrollGeometryChange,
  ...props
}: Readonly<RefreshableScrollViewProps>) {
  const [refreshing, setRefreshing] = useState(false);
  const refresh = usePullToRefresh(onRefresh, setRefreshing);
  if (!onRefresh || props.disabled || props.hidden) return <ScrollView {...props} />;
  return (
    <PullToRefreshBox
      isRefreshing={refreshing}
      onRefresh={refresh}
      contentAlignment="topCenter"
      modifiers={[fillMaxSize()]}
    >
      <ScrollView {...props} />
    </PullToRefreshBox>
  );
}
