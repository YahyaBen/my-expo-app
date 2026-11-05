import { List as NativeList, type ListProps as NativeListProps } from '@expo/ui';

export type ListProps = Omit<NativeListProps, 'onRefresh'>;

export function List({ children, testID }: Readonly<ListProps>) {
  return <NativeList testID={testID}>{children}</NativeList>;
}

export { ListForEach, type ListForEachProps } from '@expo/ui';
