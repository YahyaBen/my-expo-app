import { queryOptions, skipToken } from '@tanstack/react-query';
import { me } from './auth.api';

export const currentIdentityQuery = (userId?: string) => {
  const id = userId?.trim() || undefined;
  return queryOptions({
    queryKey: ['auth', 'me', id],
    queryFn: id ? ({ signal }) => me({ signal }) : skipToken,
    enabled: Boolean(id),
  });
};
