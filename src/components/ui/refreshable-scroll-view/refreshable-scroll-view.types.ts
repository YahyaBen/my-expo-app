import type { ScrollViewProps } from '@expo/ui';
import type { ScrollGeometry } from '@expo/ui/swift-ui';

/** Vertical native scrolling inside an existing Expo UI Host. The caller owns error feedback. */
export type RefreshableScrollViewProps = Omit<ScrollViewProps, 'direction'> & {
  onRefresh?: () => Promise<void>;
  /** Native iOS 18+ scroll observation; worklet callbacks run on the UI thread. */
  onScrollGeometryChange?: (geometry: ScrollGeometry) => void;
};
