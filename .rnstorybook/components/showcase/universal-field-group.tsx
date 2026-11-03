import { NativeStoryHost, type NativeStoryTheme } from '../native-story-frame';
import { FieldGroup, type FieldGroupProps } from '@components/ui';

export type UniversalFieldGroupProps = FieldGroupProps &
  NativeStoryTheme & { viewportHeight?: number };

/** Form/LazyColumn needs a bounded viewport instead of content-size measurement. */
export function UniversalFieldGroup({
  colorScheme,
  seedColor,
  viewportHeight = 440,
  ...props
}: Readonly<UniversalFieldGroupProps>) {
  return (
    <NativeStoryHost
      testID={props.testID}
      viewportHeight={viewportHeight}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <FieldGroup {...props} />
    </NativeStoryHost>
  );
}
