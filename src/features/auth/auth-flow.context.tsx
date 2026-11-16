import { establishSession } from '@/services/auth/auth.lifecycle';
import { authRepository } from '@/services/auth/auth.repository';
import { getSessionVersion, subscribeAuthSession } from '@/services/auth/auth.session';
import { SessionChangedError } from '@/services/auth/auth.errors';
import { getDeviceMetadata } from '@/services/auth/device-installation';
import { getGoogleIdToken } from '@/services/auth/google-sign-in';
import type {
  AuthFlowResponse,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from '@/types/auth.types';
import { usePathname } from 'expo-router';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';

interface AuthFlowContextValue {
  registrationChallenge: AuthFlowResponse | null;
  signIn: (request: Pick<LoginRequest, 'login' | 'password'>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  register: (request: RegisterRequest) => Promise<void>;
  confirmRegistration: (code: string) => Promise<void>;
  canResendRegistration: boolean;
  resendRegistration: () => Promise<void>;

  clearChallenge: () => void;
}

interface RegistrationChallengeState {
  response: AuthFlowResponse;
  email: string | null;
}

const AuthFlowContext = createContext<AuthFlowContextValue | undefined>(undefined);

/** Coordinate auth results; the route owner supplies completion navigation. */
export function AuthFlowProvider({
  children,
  onVerificationRequired,
  onAuthenticated,
}: Readonly<
  PropsWithChildren<{ onVerificationRequired: () => void; onAuthenticated: () => void }>
>) {
  const pathname = usePathname();

  const [challengeState, setChallengeState] = useState<RegistrationChallengeState | null>(null);
  const mounted = useRef(true);
  const sequence = useRef(0);
  const pendingRequest = useRef<number | null>(null);
  const committingSession = useRef(false);
  const invalidatePending = useCallback(() => {
    sequence.current += 1;
    pendingRequest.current = null;
  }, []);

  // Leaving a form invalidates its pending response, including Android back gestures.
  useEffect(() => {
    invalidatePending();
  }, [pathname, invalidatePending]);

  useEffect(() => {
    mounted.current = true;
    const unsubscribe = subscribeAuthSession(({ reason }) => {
      if (reason !== 'cleared') return;
      invalidatePending();
      committingSession.current = false;
      setChallengeState(null);
    });
    return () => {
      mounted.current = false;
      invalidatePending();
      committingSession.current = false;
      unsubscribe();
    };
  }, [invalidatePending]);

  const clearChallenge = useCallback(() => {
    if (committingSession.current) return;
    invalidatePending();
    setChallengeState(null);
  }, [invalidatePending]);

  const run = useCallback(
    async (
      request: (assertCurrent: () => void) => Promise<AuthFlowResponse | TokenResponse | null>,
      challengeEmail: string | null = null,
    ) => {
      if (!mounted.current || committingSession.current || pendingRequest.current !== null) return;
      const id = ++sequence.current;
      pendingRequest.current = id;
      try {
        const version = getSessionVersion();
        const isCurrent = () => mounted.current && sequence.current === id;
        const assertCurrent = () => {
          if (!isCurrent() || version !== getSessionVersion()) throw new SessionChangedError();
        };
        let response: AuthFlowResponse | TokenResponse | null;
        try {
          response = await request(assertCurrent);
        } catch (error) {
          assertCurrent();
          throw error;
        }
        assertCurrent();
        if (response === null) return;

        let token: TokenResponse;
        if ('isOtpValidated' in response) {
          if (!response.isOtpValidated && response.challengeId) {
            setChallengeState({ response, email: challengeEmail });
            onVerificationRequired();
            return;
          }
          if (!response.isOtpValidated || !response.loginResponse) {
            throw new Error('Invalid authentication flow response.');
          }
          token = response.loginResponse;
        } else {
          token = response;
        }

        committingSession.current = true;
        try {
          await establishSession(token, version);
          if (isCurrent()) {
            setChallengeState(null);
            onAuthenticated();
          }
        } finally {
          // No other commit can start while this flag is set. Always release it,
          // even if navigation invalidated the response while storage was pending.
          committingSession.current = false;
        }
      } finally {
        if (pendingRequest.current === id) pendingRequest.current = null;
      }
    },
    [onAuthenticated, onVerificationRequired],
  );

  const registrationChallenge = challengeState?.response ?? null;
  const challengeId = registrationChallenge?.challengeId ?? null;
  const challengeEmail = challengeState?.email ?? null;
  const canResendRegistration = challengeEmail !== null;

  const signIn = useCallback(
    async (request: Pick<LoginRequest, 'login' | 'password'>) => {
      const login = request.login.trim();
      await run(
        async (assertCurrent) => {
          const metadata = await getDeviceMetadata();
          assertCurrent();
          return authRepository.login({
            ...request,
            login,
            ...metadata,
          });
        },
        login.includes('@') ? login : null,
      );
    },
    [run],
  );

  const register = useCallback(
    (request: RegisterRequest) => run(() => authRepository.register(request), request.email.trim()),
    [run],
  );

  const signInWithGoogle = useCallback(
    () =>
      run(async (assertCurrent) => {
        const idToken = await getGoogleIdToken();
        if (!idToken) return null;
        assertCurrent();
        const metadata = await getDeviceMetadata();
        assertCurrent();
        return authRepository.googleSignIn({ idToken, ...metadata });
      }),
    [run],
  );

  const confirmRegistration = useCallback(
    (code: string) =>
      run(async (assertCurrent) => {
        if (!challengeId) {
          throw new Error('Missing verification challenge.');
        }
        const metadata = await getDeviceMetadata();
        assertCurrent();
        return authRepository.confirmRegistration({
          challengeId,
          code: code.trim(),
          ...metadata,
        });
      }, challengeEmail),
    [challengeId, challengeEmail, run],
  );

  const resendRegistration = useCallback(async () => {
    if (!challengeEmail) throw new Error('Missing registration email.');
    await run(() => authRepository.resendRegistration({ email: challengeEmail }), challengeEmail);
  }, [challengeEmail, run]);

  const value = useMemo<AuthFlowContextValue>(
    () => ({
      registrationChallenge,
      signIn,
      signInWithGoogle,
      register,
      confirmRegistration,
      canResendRegistration,
      resendRegistration,

      clearChallenge,
    }),
    [
      canResendRegistration,
      clearChallenge,
      confirmRegistration,
      register,
      registrationChallenge,
      resendRegistration,
      signIn,
      signInWithGoogle,
    ],
  );

  return <AuthFlowContext.Provider value={value}>{children}</AuthFlowContext.Provider>;
}

export function useAuthFlow() {
  const context = useContext(AuthFlowContext);
  if (!context) throw new Error('useAuthFlow must be used within AuthFlowProvider');
  return context;
}
