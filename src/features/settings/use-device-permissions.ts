import { useIsFocused } from 'expo-router';
import { useContext, useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { useAppActive } from '@/hooks/use-motion-enabled';
import { PerformanceReadyContext } from '@/context/performance-ready.context';
import {
  getDevicePermission,
  requestDevicePermission,
  SYSTEM_PERMISSIONS,
  type DevicePermission,
  type SystemPermission,
} from '@/lib/device-permissions';
import {
  setDeviceFeatureEnabled,
  useDevicePreferences,
  type DeviceFeature,
} from '@/lib/device-preferences';

// The location hook owns its status and service checks; do not read it twice.
const refreshedPermissions = SYSTEM_PERMISSIONS.filter((kind) => kind !== 'location');

export function useDevicePermissions() {
  const preferences = useDevicePreferences();
  const focused = useIsFocused();
  const active = useAppActive();
  const ready = useContext(PerformanceReadyContext);
  const visible = focused && active && ready !== false;
  const mounted = useRef(false);
  const busy = useRef(false);
  const [permissions, setPermissions] = useState<
    Partial<Record<SystemPermission, DevicePermission>>
  >({});
  const [pending, setPending] = useState<SystemPermission | 'settings' | null>(null);
  const [error, setError] = useState<'requestFailed' | 'settingsFailed' | null>(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!visible || pending) return;
    let disposed = false;
    // A missing native capability must not hide the other permission controls.
    void Promise.allSettled(refreshedPermissions.map(getDevicePermission)).then((results) => {
      if (disposed) return;
      setPermissions((current) => {
        const next = { ...current };
        let changed = false;
        results.forEach((result, index) => {
          const kind = refreshedPermissions[index];
          if (result.status === 'fulfilled') {
            const permission = retainPermission(current[kind], result.value);
            if (permission !== current[kind]) {
              next[kind] = permission;
              changed = true;
            }
          } else if (current[kind]) {
            delete next[kind];
            changed = true;
          }
        });
        return changed ? next : current;
      });
      if (results.some((result) => result.status === 'rejected')) setError('requestFailed');
    });
    return () => {
      disposed = true;
    };
  }, [visible, pending]);

  async function openSettings() {
    if (busy.current || !mounted.current || !visible) return;
    busy.current = true;
    setPending('settings');
    setError(null);
    try {
      await Linking.openSettings();
    } catch {
      if (mounted.current) setError('settingsFailed');
    } finally {
      busy.current = false;
      if (mounted.current) setPending(null);
    }
  }

  async function setEnabled(kind: SystemPermission | DeviceFeature, enabled: boolean) {
    if (busy.current || !preferences.ready || !mounted.current || !visible) return;
    if (kind === 'notifications' && !enabled) {
      // Only the OS can stop background push alerts; keep the switch truthful until return.
      await openSettings();
      return;
    }
    if (kind === 'photos' || kind === 'haptics' || !enabled) {
      if (kind !== 'notifications') setDeviceFeatureEnabled(kind, enabled);
      return;
    }
    busy.current = true;
    setPending(kind);
    setError(null);
    try {
      const permission = await requestDevicePermission(kind);
      if (!mounted.current) return;
      setPermissions((current) => {
        const next = retainPermission(current[kind], permission);
        return next === current[kind] ? current : { ...current, [kind]: next };
      });
      // Save intent even when a blocked request opens Settings; OS approval is still required.
      if (kind !== 'notifications') setDeviceFeatureEnabled(kind, true);
    } catch {
      if (mounted.current) setError('requestFailed');
    } finally {
      busy.current = false;
      if (mounted.current) setPending(null);
    }
  }

  return {
    ...preferences,
    permissions,
    pending,
    error,
    setEnabled,
    openSettings,
  };
}

/** The form consumes only these flags, independently of native object/key identity. */
function retainPermission(current: DevicePermission | undefined, next: DevicePermission) {
  return current && current.granted === next.granted && current.canAskAgain === next.canAskAgain
    ? current
    : { granted: next.granted, canAskAgain: next.canAskAgain };
}
