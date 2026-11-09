import type { ReactNode } from 'react';

export type BottomSheetBaseProps = {
  children?: ReactNode;
  isPresented: boolean;
  onDismiss: () => void;
  testID?: string;
};

export type BottomSheetProps = BottomSheetBaseProps & {
  presentation?: 'modal';
  contentHeight?: number;
};
