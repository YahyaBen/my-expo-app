import { queryOptions, skipToken } from '@tanstack/react-query';
import { authRepository } from './auth.repository';

export const currentIdentityQuery = (userId?: string) => {
  const id = userId?.trim() || undefined;
  return queryOptions({
    queryKey: ['auth', 'me', id],
    queryFn: id ? ({ signal }) => authRepository.getCurrentIdentity({ signal }) : skipToken,
    enabled: Boolean(id),
  });
};
