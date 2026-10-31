import type { ReactNode } from 'react';

export type PopoverProps = {
  isPresented: boolean;
  onIsPresentedChange: (isPresented: boolean) => void;
  /** A native control whose action sets isPresented to true. */
  trigger: ReactNode;
  children: ReactNode;
  testID?: string;
};
