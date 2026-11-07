import { requireOptionalNativeModule } from 'expo';
import { AppState, Platform } from 'react-native';
import { getAppBrand } from '@/config/brand';

export function canCheckStoreUpdates() {
  return (
    !__DEV__ &&
    (Platform.OS === 'ios' || Platform.OS === 'android') &&
    getAppBrand().variant === 'production' &&
    requireOptionalNativeModule('ExpoInAppUpdates') !== null
  );
}

export async function checkStoreUpdate(): Promise<{
  available: boolean;
  version: string | null;
}> {
  if (!canCheckStoreUpdates()) throw new Error('Store updates are unavailable.');

  // Defer the package's required native module until a supported release checks.
  const updates = await import('expo-in-app-updates');
  const info = await updates.checkForUpdate();
  if (Platform.OS === 'ios' && !info.storeVersion) {
    throw new Error('The app could not be found in the App Store.');
  }

  return {
    available: info.updateAvailable || info.updateInProgress === true,
    version: info.storeVersion ?? null,
  };
}

export async function startStoreUpdate(): Promise<boolean> {
  if (!canCheckStoreUpdates()) return false;

  const updates = await import('expo-in-app-updates');
  if (Platform.OS === 'android') {
    const info = await updates.checkForUpdate();
    if (AppState.currentState !== 'active') return false;
    // Prefer Play's immediate flow when permitted; otherwise let Play choose.
    return updates.startUpdate(info.immediateAllowed ? true : undefined);
  }

  return AppState.currentState === 'active' ? updates.startUpdate() : false;
}
