import type { ColumnProps } from '@expo/ui';
import type { ReactElement, ReactNode } from 'react';

export type TableCheckboxProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
  testID?: string;
};

export type TableRowProps = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

export declare const tableRowInsets: { start: number; end: number };
export declare function TableCheckbox(props: Readonly<TableCheckboxProps>): ReactElement;
export declare function TableRow(props: Readonly<TableRowProps>): ReactElement;
export declare function onTableViewportLayout(
  handler: (size: { width: number; height: number }) => void,
): NonNullable<ColumnProps['modifiers']>[number];
