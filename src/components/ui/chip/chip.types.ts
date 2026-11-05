type ChipBaseProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
  /** Opaque native surfaces for chips displayed over maps or artwork. */
  appearance?: 'native' | 'filled';
};

/** Selection and token removal belong to the caller. */
export type ChipProps = ChipBaseProps &
  (
    | { variant?: 'assist' | 'suggestion'; selected?: never }
    | { variant: 'filter' | 'input'; selected: boolean }
  );
