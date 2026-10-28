export interface NativeAlertProps {
  title: string;
  message: string;
  confirmLabel: string;
  onDismiss: () => void;
}

export declare function NativeAlert(
  props: Readonly<NativeAlertProps>,
): import('react').ReactElement;
