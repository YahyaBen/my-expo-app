import { useQueryClient, type QueryKey } from '@tanstack/react-query';
import { refetchScreenQueries } from '@/services/query-refresh';

/** Returns an onRefresh handler for the screen's exact active query keys. */
export function useScreenRefresh(queryKeys: readonly QueryKey[]) {
  const client = useQueryClient();
  return () => refetchScreenQueries(client, queryKeys);
}
