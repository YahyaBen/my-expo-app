export interface TableAction {
  id: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface TableActionsProps {
  /** Visible, translated native menu trigger. */
  label: string;
  /** Include the row identity so repeated triggers have distinct spoken names. */
  accessibilityLabel: string;
  actions: readonly TableAction[];
  testID?: string;
}

/** Native row menu; reuse the current Host. Metro selects the platform adapter. */
export declare function TableActions(props: Readonly<TableActionsProps>): React.JSX.Element;
