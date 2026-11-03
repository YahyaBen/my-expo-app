import { NativeStoryHost, type NativeStoryTheme } from '../native-story-frame';
import { List, type ListProps } from '@components/ui';

export type UniversalListProps = ListProps & NativeStoryTheme & { viewportHeight?: number };

export function UniversalList({
  colorScheme,
  seedColor,
  viewportHeight = 400,
  ...props
}: Readonly<UniversalListProps>) {
  return (
    <NativeStoryHost
      testID={props.testID}
      viewportHeight={viewportHeight}
      colorScheme={colorScheme}
      seedColor={seedColor}
    >
      <List {...props} />
    </NativeStoryHost>
  );
}
