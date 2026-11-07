import * as Updates from 'expo-updates';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from 'react';
import {
  canCheckStoreUpdates,
  checkStoreUpdate,
  startStoreUpdate,
} from '@/services/updates/store-updates';

type UpdateStatus = 'unchecked' | 'current' | 'available' | 'ready' | 'unavailable' | 'error';
type PendingAction = 'check' | 'download' | 'restart' | 'store';

interface AppUpdates {
  otaStatus: UpdateStatus;
  storeStatus: UpdateStatus;
  storeVersion: string | null;
  pending: PendingAction | null;
  actionError: Exclude<PendingAction, 'check'> | null;
  checkForUpdates: () => Promise<void>;
  downloadUpdate: () => Promise<void>;
  restartApp: () => Promise<void>;
  openStore: () => Promise<void>;
}

const AppUpdatesContext = createContext<AppUpdates | null>(null);

/** One controller shares automatic detection and Settings actions for this app session. */
export function AppUpdatesProvider({
  children,
  ready,
}: Readonly<PropsWithChildren<{ ready: boolean }>>) {
  const [{ otaEnabled, storeEnabled }] = useState(() => ({
    otaEnabled: !__DEV__ && Updates.isEnabled,
    storeEnabled: canCheckStoreUpdates(),
  }));
  const nativeUpdates = Updates.useUpdates();
  const [otaStatus, setOtaStatus] = useState<UpdateStatus>(
    otaEnabled ? 'unchecked' : 'unavailable',
  );
  const [storeStatus, setStoreStatus] = useState<UpdateStatus>(
    storeEnabled ? 'unchecked' : 'unavailable',
  );
  const [storeVersion, setStoreVersion] = useState<string | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [actionError, setActionError] = useState<AppUpdates['actionError']>(null);
  const operation = useRef<PendingAction | null>(null);
  const checkedAutomatically = useRef(false);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const begin = useCallback(
    (action: PendingAction) => {
      if (!ready || !mounted.current || operation.current !== null) return false;
      operation.current = action;
      setPending(action);
      setActionError(null);
      return true;
    },
    [ready],
  );

  const finish = useCallback(() => {
    operation.current = null;
    if (mounted.current) setPending(null);
  }, []);

  const checkForUpdates = useCallback(async () => {
    if ((!otaEnabled && !storeEnabled) || !begin('check')) return;
    // Failures are independent: an offline store must not hide an available OTA update.
    await Promise.allSettled([
      ...(otaEnabled
        ? [
            Updates.checkForUpdateAsync().then(
              (result) => {
                if (mounted.current)
                  setOtaStatus(
                    result.isAvailable || result.isRollBackToEmbedded ? 'available' : 'current',
                  );
              },
              () => {
                if (mounted.current) setOtaStatus('error');
              },
            ),
          ]
        : []),
      ...(storeEnabled
        ? [
            checkStoreUpdate().then(
              (result) => {
                if (!mounted.current) return;
                setStoreVersion(result.version);
                setStoreStatus(result.available ? 'available' : 'current');
              },
              () => {
                if (mounted.current) setStoreStatus('error');
              },
            ),
          ]
        : []),
    ]);
    finish();
  }, [begin, finish, otaEnabled, storeEnabled]);

  useEffect(() => {
    if (!ready || checkedAutomatically.current) return;
    checkedAutomatically.current = true;
    void checkForUpdates();
  }, [ready, checkForUpdates]);

  async function downloadUpdate() {
    if (!otaEnabled || otaStatus !== 'available' || !begin('download')) return;
    try {
      const result = await Updates.fetchUpdateAsync();
      if (mounted.current)
        setOtaStatus(result.isNew || result.isRollBackToEmbedded ? 'ready' : 'current');
    } catch {
      if (mounted.current) setActionError('download');
    } finally {
      finish();
    }
  }

  async function restartApp() {
    if (
      !otaEnabled ||
      (otaStatus !== 'ready' && !nativeUpdates.isUpdatePending) ||
      !begin('restart')
    )
      return;
    try {
      // A successful reload replaces this JS runtime; do not schedule more work after it.
      await Updates.reloadAsync();
    } catch {
      if (mounted.current) setActionError('restart');
      finish();
    }
  }

  async function openStore() {
    if (!storeEnabled || storeStatus !== 'available' || !begin('store')) return;
    try {
      const started = await startStoreUpdate();
      if (!started && mounted.current) setActionError('store');
    } catch {
      if (mounted.current) setActionError('store');
    } finally {
      finish();
    }
  }

  return (
    <AppUpdatesContext.Provider
      value={{
        otaStatus: otaEnabled && nativeUpdates.isUpdatePending ? 'ready' : otaStatus,
        storeStatus,
        storeVersion,
        pending,
        actionError,
        checkForUpdates,
        downloadUpdate,
        restartApp,
        openStore,
      }}
    >
      {children}
    </AppUpdatesContext.Provider>
  );
}

/** Standalone component previews have no app update lifecycle. */
export function useAppUpdates() {
  return useContext(AppUpdatesContext);
}
