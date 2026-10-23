import type { ReactElement, ReactNode } from 'react';

export type ListItemActionProps = {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  testID?: string;
};

/** Native row action content. Compose inside an existing Host and list/form row. */
export declare function ListItemAction(props: ListItemActionProps): ReactElement;
