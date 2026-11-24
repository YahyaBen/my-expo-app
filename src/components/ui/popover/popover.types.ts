import type { ReactNode } from 'react';

export type PopoverProps = {
  isPresented: boolean;
  onIsPresentedChange: (isPresented: boolean) => void;
  /** A native control whose action sets isPresented to true. */
  trigger: ReactNode;
  children: ReactNode;
  /** Optional width in points or dp. The native popup still constrains placement. */
  width?: number;
  /** Keep taller native content reachable within the popup. */
  scrollable?: boolean;
  testID?: string;
};
