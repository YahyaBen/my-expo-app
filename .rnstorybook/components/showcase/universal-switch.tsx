import { NativeStoryHost, type NativeStoryTheme } from '../native-story-frame';
import { Switch, type SwitchProps } from '@components/ui';

export type UniversalSwitchProps = SwitchProps & NativeStoryTheme;

export function UniversalSwitch({
  colorScheme,
  seedColor,
  ...props
}: Readonly<UniversalSwitchProps>) {
  return (
    <NativeStoryHost testID={props.testID} colorScheme={colorScheme} seedColor={seedColor}>
      <Switch {...props} />
    </NativeStoryHost>
  );
}
