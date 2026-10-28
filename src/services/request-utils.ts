import type { ApiQueryParams, ApiRequestOptions } from './api';

export type ApiReadOptions = Pick<ApiRequestOptions, 'signal' | 'timeoutMs'>;
export type PaginationQuery = { page?: number; pageSize?: number };

/** Trim primitive parameters without loading transport or native session state. */
export function buildListParams<T extends object>(
  query: T,
  defaults?: Partial<T>,
): Record<string, boolean | number | string> {
  const params: Record<string, boolean | number | string> = {};
  const mergedQuery = { ...defaults, ...query };

  for (const [key, val] of Object.entries(mergedQuery)) {
    if (val === undefined || val === null) continue;
    if (typeof val === 'string') {
      const trimmed = val.trim();
      if (trimmed !== '') {
        params[key] = trimmed;
      }
    } else if (typeof val === 'boolean' || typeof val === 'number') {
      params[key] = val;
    }
  }

  return params;
}

/** Snapshot normalized primitive parameters for the cache key and HTTP request. */
export function normalizeListQuery<T extends PaginationQuery>(
  query: T,
  defaults: PaginationQuery = {},
): T & ApiQueryParams & { page: number; pageSize: number } {
  const params = buildListParams({ page: 1, pageSize: 12, ...defaults, ...buildListParams(query) });
  for (const field of ['page', 'pageSize']) {
    const value = params[field];
    if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 1)
      throw new RangeError(`${field} must be a positive integer.`);
  }
  return params as T & ApiQueryParams & { page: number; pageSize: number };
}

export function entityPath(endpoint: string, ...ids: string[]) {
  if (ids.some((id) => typeof id !== 'string' || !id.trim()))
    throw new Error('An entity identifier is required.');
  return [endpoint, ...ids.map((id) => encodeURIComponent(id.trim()))].join('/');
}
