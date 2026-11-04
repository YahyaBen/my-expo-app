import { semantics } from '@expo/ui/jetpack-compose/modifiers';
import { Checkbox } from '../checkbox/checkbox';
import type { TableCheckboxProps } from './table-checkbox';

export function TableCheckbox({ accessibilityLabel, ...props }: Readonly<TableCheckboxProps>) {
  return (
    <Checkbox {...props} modifiers={[semantics({ contentDescription: accessibilityLabel })]} />
  );
}
