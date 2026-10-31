type ChipBaseProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};

/** Selection and token removal belong to the caller. */
export type ChipProps = ChipBaseProps &
  (
    | { variant?: 'assist' | 'suggestion'; selected?: never }
    | { variant: 'filter' | 'input'; selected: boolean }
  );
