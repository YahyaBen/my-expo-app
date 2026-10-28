import { Checkbox as NativeCheckbox, type CheckboxProps } from '@expo/ui';

export function Checkbox({ disabled, onValueChange, ...props }: Readonly<CheckboxProps>) {
  return (
    <NativeCheckbox
      {...props}
      disabled={disabled}
      onValueChange={(value) => {
        if (!disabled) onValueChange(value);
      }}
    />
  );
}

export type { CheckboxProps } from '@expo/ui';
