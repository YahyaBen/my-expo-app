import * as Location from 'expo-location';
import { useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Linking } from 'react-native';
import { useAppActive } from '@/hooks/use-motion-enabled';
import { openLocationServicesSettings, requestLocationServices } from './location-services';
import { isDeviceFeatureEnabled, useDevicePreferences } from '@/lib/device-preferences';
import type { DevicePermission } from '@/lib/device-permissions';

/** Read OS permission state on return; acquire a single location only on request. */
export function useDeviceLocation(permissionChanged?: DevicePermission) {
  const preferences = useDevicePreferences();
  const enabled = preferences.ready && preferences.enabled.location;
  const focused = useIsFocused();
  const active = useAppActive();
  const mounted = useRef(false);
  const busy = useRef(false);
  const [permission, setPermission] = useState<Location.LocationPermissionResponse | null>(null);
  const [servicesEnabled, setServicesEnabled] = useState<boolean | null>(null);
  const [position, setPosition] = useState<Location.LocationObject | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<'requestFailed' | 'settingsFailed' | null>(null);

  if (!enabled && position !== null) setPosition(null);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!focused || !active || pending) return;
    let disposed = false;
    void Promise.all([Location.getForegroundPermissionsAsync(), Location.hasServicesEnabledAsync()])
      .then(([nextPermission, enabled]) => {
        if (disposed) return;
        setPermission(nextPermission);
        setServicesEnabled(enabled);
        if (!nextPermission.granted || !enabled) setPosition(null);
      })
      .catch(() => {
        if (!disposed) setError('requestFailed');
      });
    return () => {
      disposed = true;
    };
  }, [active, focused, pending, permissionChanged]);

  async function requestLocation() {
    if (busy.current || !mounted.current || !focused || !active || !enabled) return;
    busy.current = true;
    setPending(true);
    setError(null);
    setPosition(null);
    try {
      let nextPermission = await Location.getForegroundPermissionsAsync();
      if (!mounted.current) return;
      if (!nextPermission.granted && !nextPermission.canAskAgain) {
        setPermission(nextPermission);
        await openSettings(nextPermission);
        return;
      }
      if (!nextPermission.granted && nextPermission.canAskAgain) {
        nextPermission = await Location.requestForegroundPermissionsAsync();
      }
      if (!mounted.current) return;
      setPermission(nextPermission);
      if (!nextPermission.granted || !isDeviceFeatureEnabled('location')) return;
      let enabled = await Location.hasServicesEnabledAsync();
      if (!mounted.current) return;
      setServicesEnabled(enabled);
      if (!enabled) {
        enabled = await requestLocationServices();
        if (!mounted.current) return;
        setServicesEnabled(enabled);
        if (!enabled) return;
      }
      if (!isDeviceFeatureEnabled('location')) return;
      const nextPosition = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      if (mounted.current && isDeviceFeatureEnabled('location')) setPosition(nextPosition);
    } catch {
      if (mounted.current) setError('requestFailed');
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  }

  async function openSettings(currentPermission = permission) {
    setError(null);
    try {
      if (currentPermission?.granted && servicesEnabled === false) {
        await openLocationServicesSettings();
      } else {
        await Linking.openSettings();
      }
    } catch {
      if (mounted.current) setError('settingsFailed');
    }
  }

  return {
    permission,
    servicesEnabled,
    position: enabled ? position : null,
    enabled,
    pending,
    error,
    requestLocation,
    openSettings,
  };
}
