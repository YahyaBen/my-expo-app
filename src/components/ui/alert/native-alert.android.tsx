import { AlertDialog, Text, TextButton } from '@expo/ui/jetpack-compose';
import { testID } from '@expo/ui/jetpack-compose/modifiers';
import type { NativeAlertProps } from './native-alert';

export function NativeAlert({
  accentColor,
  title,
  message,
  confirmLabel,
  onDismiss,
}: Readonly<NativeAlertProps>) {
  return (
    <AlertDialog
      colors={{ titleContentColor: accentColor }}
      onDismissRequest={onDismiss}
      modifiers={[testID('app-alert')]}
    >
      <AlertDialog.Title>
        <Text>{title}</Text>
      </AlertDialog.Title>
      <AlertDialog.Text>
        <Text modifiers={[testID('app-alert-message')]}>{message}</Text>
      </AlertDialog.Text>
      <AlertDialog.ConfirmButton>
        <TextButton
          colors={{ contentColor: accentColor }}
          onClick={onDismiss}
          modifiers={[testID('app-alert-dismiss')]}
        >
          <Text>{confirmLabel}</Text>
        </TextButton>
      </AlertDialog.ConfirmButton>
    </AlertDialog>
  );
}
