import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useSyncExternalStore } from 'react';

export const DEVICE_FEATURES = ['camera', 'microphone', 'photos', 'location', 'haptics'] as const;
export type DeviceFeature = (typeof DEVICE_FEATURES)[number];

const STORAGE_KEY = 'appDevicePreferences';
const listeners = new Set<() => void>();
let snapshot = {
  ready: false,
  enabled: { camera: true, microphone: true, photos: true, location: true, haptics: true },
  saveFailed: false,
};
let restoration: Promise<void> | undefined;
let persistence = Promise.resolve();

export function getDevicePreferences() {
  return snapshot;
}

function publish(next: typeof snapshot) {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function restoreDevicePreferences() {
  restoration ??= persistence
    .then(() => AsyncStorage.getItem(STORAGE_KEY))
    .then((stored) => {
      const parsed: unknown = stored ? JSON.parse(stored) : null;
      const enabled = { ...snapshot.enabled };
      if (parsed && typeof parsed === 'object') {
        for (const feature of DEVICE_FEATURES) {
          const value = (parsed as Record<string, unknown>)[feature];
          if (typeof value === 'boolean') enabled[feature] = value;
        }
      }
      publish({ ready: true, enabled, saveFailed: false });
    })
    .catch(() =>
      publish({
        ready: true,
        enabled: {
          camera: false,
          microphone: false,
          photos: false,
          location: false,
          haptics: false,
        },
        saveFailed: true,
      }),
    );
  return restoration;
}

/** App preferences never grant or revoke the operating system's permissions. */
export function setDeviceFeatureEnabled(feature: DeviceFeature, enabled: boolean) {
  if (!snapshot.ready) return;
  const next = { ...snapshot.enabled, [feature]: enabled };
  publish({ ...snapshot, enabled: next, saveFailed: false });
  persistence = persistence
    .then(() => AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)))
    .then(() => publish({ ...snapshot, saveFailed: false }))
    .catch(() => publish({ ...snapshot, saveFailed: true }));
}

export function isDeviceFeatureEnabled(feature: DeviceFeature) {
  return snapshot.ready && snapshot.enabled[feature];
}

export function useDevicePreferences() {
  useEffect(() => {
    void restoreDevicePreferences();
  }, []);
  return useSyncExternalStore(subscribe, getDevicePreferences, getDevicePreferences);
}
