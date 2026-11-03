import { NativeStoryHost, type NativeStoryTheme } from '../native-story-frame';
import { ScrollView, type ScrollViewProps } from '@expo/ui';

export type UniversalScrollViewProps = ScrollViewProps &
  NativeStoryTheme & { viewportHeight?: number };

export function UniversalScrollView({
  colorScheme,
  seedColor,
  viewportHeight = 320,
  ...props
}: Readonly<UniversalScrollViewProps>) {
  return (
    <NativeStoryHost
      testID={props.testID}
      viewportHeight={viewportHeight}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <ScrollView {...props} />
    </NativeStoryHost>
  );
}
