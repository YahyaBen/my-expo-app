import { useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { useAppActive } from '@/hooks/use-motion-enabled';
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

export function useDevicePermissions() {
  const preferences = useDevicePreferences();
  const focused = useIsFocused();
  const active = useAppActive();
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
    if (!focused || !active || pending) return;
    let disposed = false;
    // A missing native capability must not hide the other permission controls.
    void Promise.allSettled(SYSTEM_PERMISSIONS.map(getDevicePermission)).then((results) => {
      if (disposed) return;
      const next: Partial<Record<SystemPermission, DevicePermission>> = {};
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') next[SYSTEM_PERMISSIONS[index]] = result.value;
      });
      setPermissions(next);
      if (results.some((result) => result.status === 'rejected')) setError('requestFailed');
    });
    return () => {
      disposed = true;
    };
  }, [active, focused, pending]);

  async function openSettings() {
    if (busy.current || !mounted.current || !focused || !active) return;
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
    if (busy.current || !preferences.ready || !mounted.current || !focused || !active) return;
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
      setPermissions((current) => ({ ...current, [kind]: permission }));
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
