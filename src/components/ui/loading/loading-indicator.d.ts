import type { ReactElement } from 'react';

export type LoadingIndicatorProps = {
  color?: string;
  testID?: string;
  accessibilityLabel?: string;
  /** Material morphing shapes on Android; a native spinner on iOS. */
  variant?: 'circular' | 'expressive';
};
/** Indeterminate native progress, composed inside an Expo UI Host. */
export declare function LoadingIndicator(props: Readonly<LoadingIndicatorProps>): ReactElement;
