import type { ReactElement } from 'react';
import type { ButtonContentProps } from './button';

export type NativeButtonProps = ButtonContentProps & { minHeight?: number };

/** @internal Native renderer shared by standalone and hosted buttons. */
export declare function NativeButton(props: Readonly<NativeButtonProps>): ReactElement;
