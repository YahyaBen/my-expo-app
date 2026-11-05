import type { ReactElement, ReactNode } from 'react';
import type { IconName } from '../icon/icon';

export type BottomSheetHeaderAction = {
  icon: IconName;
  accessibilityLabel: string;
  onPress: () => void;
  testID?: string;
};

export type BottomSheetBaseProps = {
  children?: ReactNode;
  isPresented: boolean;
  onDismiss: () => void;
  /** A native text element can supply custom typography and its own test ID. */
  title?: string | ReactElement;
  headerAction?: BottomSheetHeaderAction;
  testID?: string;
};

export type InlineBottomSheetProps = BottomSheetBaseProps & {
  presentation: 'inline';
  /** Available expanded height, in points/dp, within the containing screen. */
  height: number;
  collapsedHeight: number;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  expandAccessibilityLabel: string;
  collapseAccessibilityLabel: string;
  /** Content clearance for an overlapping dock; excludes system insets. */
  bottomClearance?: number;
  /** Menus can slide away directly instead of retaining a collapsed preview. */
  dismissOnCollapse?: boolean;
  /** Compact peek content; expanded native content stays mounted during a drag. */
  collapsedContent?: ReactNode;
};

export type BottomSheetProps =
  | (BottomSheetBaseProps & { presentation?: 'modal'; contentHeight?: number })
  | InlineBottomSheetProps;
