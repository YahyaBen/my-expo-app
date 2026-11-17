import { DEFAULT_API_TIMEOUT_MS, resolveApiBaseUrl } from '../../config/api';
import { ApiConfigurationError } from './api.error';
import { getAppBrand } from '@/config/brand';

export { DEFAULT_API_TIMEOUT_MS };

/** Lazy so the public starter can open without a configured backend. */
export function getApiBaseUrl(override?: string) {
  try {
    return resolveApiBaseUrl(override ?? getAppBrand().apiUrl);
  } catch (error) {
    throw new ApiConfigurationError(error instanceof Error ? error.message : undefined);
  }
}
