import { NativeStoryHost, type NativeStoryTheme } from '../native-story-frame';
import { Column, type ColumnProps } from '@expo/ui';

export type UniversalColumnProps = ColumnProps & NativeStoryTheme;

export function UniversalColumn({
  colorScheme,
  seedColor,
  ...props
}: Readonly<UniversalColumnProps>) {
  return (
    <NativeStoryHost testID={props.testID} colorScheme={colorScheme} seedColor={seedColor}>
      <Column {...props} />
    </NativeStoryHost>
  );
}
