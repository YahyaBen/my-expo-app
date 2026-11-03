import { NativeStoryHost, type NativeStoryTheme } from '../native-story-frame';
import { Checkbox, type CheckboxProps } from '@components/ui';

export type UniversalCheckboxProps = CheckboxProps & NativeStoryTheme;

export function UniversalCheckbox({
  colorScheme,
  seedColor,
  ...props
}: Readonly<UniversalCheckboxProps>) {
  return (
    <NativeStoryHost testID={props.testID} colorScheme={colorScheme} seedColor={seedColor}>
      <Checkbox {...props} />
    </NativeStoryHost>
  );
}
