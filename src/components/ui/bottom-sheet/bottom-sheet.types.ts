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
  /** Bound the content, or the viewport when scrollable is true. */
  contentHeight?: number;
  /** Present at a single fraction of the available height, greater than 0 and at most 1. */
  heightFraction?: number;
  /** Native banner rendered edge-to-edge above the padded content. */
  banner?: ReactNode;
  /** Caller-owned title and controls, including close or overflow actions. */
  header?: ReactNode;
  /** Caller-owned actions, such as a horizontal chip rail. */
  actions?: ReactNode;
  /** Rendered after the body; scrolls with the other content. */
  footer?: ReactNode;
  /** Scroll the whole composition. Without a height, fit the content up to the available height. */
  scrollable?: boolean;
  /** Override the scroll viewport test ID. Defaults to the sheet test ID plus "-scroll". */
  scrollTestID?: string;
};
