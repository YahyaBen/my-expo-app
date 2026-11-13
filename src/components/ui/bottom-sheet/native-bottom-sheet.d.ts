import type { BottomSheetProps } from '@expo/ui';
import type { ReactNode } from 'react';

export type NativeBottomSheetProps = Pick<
  BottomSheetProps,
  'children' | 'isPresented' | 'onDismiss' | 'testID' | 'containerColor' | 'contentColor'
> & { dismissible: boolean; heightFraction?: number };

export declare function NativeBottomSheet(props: Readonly<NativeBottomSheetProps>): ReactNode;
