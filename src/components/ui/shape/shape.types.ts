export type ShapeProps = {
  variant?: 'circle' | 'rectangle' | 'roundedRectangle' | 'capsule';
  width?: number;
  height?: number;
  cornerRadius?: number;
  color?: string;
  testID?: string;
  /** Omit for decorative artwork. */
  accessibilityLabel?: string;
};
