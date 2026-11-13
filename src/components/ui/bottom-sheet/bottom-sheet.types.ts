import type { ReactNode } from 'react';

export type BottomSheetBaseProps = {
  children?: ReactNode;
  isPresented: boolean;
  onDismiss: () => void;
  /** Allow user dismissal. Set false inside a Host for a required action. */
  dismissible?: boolean;
  testID?: string;
};

export type BottomSheetProps = BottomSheetBaseProps & {
  presentation?: 'modal';
  contentHeight?: number;
  /** Present at a single fraction of the available height, greater than 0 and at most 1. */
  heightFraction?: number;
};
