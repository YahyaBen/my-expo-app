type ProgressBaseProps = {
  color?: string;
  accessibilityLabel?: string;
  testID?: string;
};

/** Circular progress is indeterminate on iOS. Use linear for a completion value. */
export type ProgressIndicatorProps = ProgressBaseProps &
  ({ variant: 'circular'; value?: never } | { variant?: 'linear'; value?: number });
