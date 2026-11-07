import type { ReactNode } from 'react';

export type TableRowProps = {
  children: ReactNode;
  onPress: () => void;
  accessibilityLabel?: string;
  testID?: string;
};

export declare const tableRowInsets: { start: number; end: number };
export declare function TableRow(props: Readonly<TableRowProps>): React.JSX.Element;
