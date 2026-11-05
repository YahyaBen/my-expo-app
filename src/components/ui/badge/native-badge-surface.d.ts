import type { ReactNode } from 'react';

export interface NativeBadgeSurfaceProps {
  children: ReactNode;
  backgroundColor: string;
  borderColor?: string;
}

export declare function NativeBadgeSurface(props: Readonly<NativeBadgeSurfaceProps>): ReactNode;
