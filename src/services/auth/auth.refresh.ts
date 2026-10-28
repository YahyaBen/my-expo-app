import { create, type AxiosResponse } from 'axios';
import { DEFAULT_API_TIMEOUT_MS, getApiBaseUrl } from '../api.config';
import { ApiResponseValidationError } from '../api.error';
import { tokenResponseSchema } from '@/validation/schemas/api/auth';
import { isSessionInvalid } from './auth.errors';
import {
  assertSessionVersion,
  clearAuthSession,
  getAuthSession,
  getSessionVersion,
  persistAuthSession,
} from './auth.session';

// Raw transport prevents interceptor recursion.
const refreshClient = create({
  timeout: DEFAULT_API_TIMEOUT_MS,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

let activeRefresh: { version: number; promise: Promise<void> } | null = null;

async function rotateToken(version: number) {
  assertSessionVersion(version);
  const session = await getAuthSession();
  assertSessionVersion(version);
  if (!session?.refreshToken) {
    await clearAuthSession(version);
    throw new Error('No refresh token available.');
  }

  let response: AxiosResponse<unknown>;
  try {
    response = await refreshClient.post<unknown>(
      '/api/auth/token/refresh',
      { refreshToken: session.refreshToken },
      { baseURL: getApiBaseUrl() },
    );
  } catch (error) {
    assertSessionVersion(version);
    if (isSessionInvalid(error)) await clearAuthSession(version);
    throw error;
  }

  assertSessionVersion(version);
  try {
    const token = tokenResponseSchema.safeParse(response.data);
    if (!token.success) throw new ApiResponseValidationError(response.status);
    await persistAuthSession(token.data, version);
  } catch (error) {
    assertSessionVersion(version);
    // Rotation consumes the old refresh token; discard it if saving fails.
    await clearAuthSession(version);
    throw error;
  }
  assertSessionVersion(version);
}

/** One refresh per session generation, shared by every caller. */
export function requestNewToken(version = getSessionVersion()): Promise<void> {
  if (activeRefresh?.version === version) return activeRefresh.promise;
  const promise = rotateToken(version).finally(() => {
    if (activeRefresh?.promise === promise) activeRefresh = null;
  });
  activeRefresh = { version, promise };
  return promise;
}
