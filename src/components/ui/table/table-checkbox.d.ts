import type { ReactElement } from 'react';

export type TableCheckboxProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel: string;
  disabled?: boolean;
  testID?: string;
};

/** Private label-free native selection control with a spoken row name. */
export declare function TableCheckbox(props: Readonly<TableCheckboxProps>): ReactElement;
