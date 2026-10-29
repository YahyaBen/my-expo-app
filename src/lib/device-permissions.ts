import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import {
  AndroidImportance,
  getPermissionsAsync,
  IosAuthorizationStatus,
  requestPermissionsAsync,
  setNotificationChannelAsync,
  setNotificationHandler,
  type NotificationPermissionsStatus,
} from 'expo-notifications';
import { Linking, Platform } from 'react-native';
import { isDeviceFeatureEnabled } from './device-preferences';
import i18n from './i18n';

export const SYSTEM_PERMISSIONS = ['notifications', 'camera', 'microphone', 'location'] as const;
export type SystemPermission = (typeof SYSTEM_PERMISSIONS)[number];
export type DevicePermission = {
  granted: boolean;
  canAskAgain: boolean;
};

export async function getDevicePermission(kind: SystemPermission): Promise<DevicePermission> {
  switch (kind) {
    case 'camera':
      return Camera.getCameraPermissionsAsync();
    case 'microphone':
      return Camera.getMicrophonePermissionsAsync();
    case 'location':
      return Location.getForegroundPermissionsAsync();
    case 'notifications':
      return notificationPermission(await getPermissionsAsync());
  }
}

function notificationPermission(permission: NotificationPermissionsStatus) {
  const status = permission.ios?.status;
  const limited =
    status === IosAuthorizationStatus.PROVISIONAL || status === IosAuthorizationStatus.EPHEMERAL;
  return {
    ...permission,
    granted: permission.ios
      ? status === IosAuthorizationStatus.AUTHORIZED || limited
      : permission.granted,
  };
}

/** Invoke only after a user action, and never request background location. */
export async function requestDevicePermission(kind: SystemPermission): Promise<DevicePermission> {
  if (kind === 'notifications') await ensureNotificationChannel();
  const current = await getDevicePermission(kind);
  if (current.granted) return current;
  if (!current.canAskAgain) {
    await Linking.openSettings();
    return current;
  }
  switch (kind) {
    case 'camera':
      return Camera.requestCameraPermissionsAsync();
    case 'microphone':
      return Camera.requestMicrophonePermissionsAsync();
    case 'location':
      return Location.requestForegroundPermissionsAsync();
    case 'notifications':
      return notificationPermission(
        await requestPermissionsAsync({
          ios: { allowAlert: true, allowBadge: true, allowSound: true },
        }),
      );
  }
}

/** Feature entry points must respect saved app opt-outs before touching native APIs. */
export async function requestDeviceAccess(kind: Exclude<SystemPermission, 'notifications'>) {
  if (!isDeviceFeatureEnabled(kind)) return false;
  const permission = await requestDevicePermission(kind);
  return permission.granted && isDeviceFeatureEnabled(kind);
}

async function ensureNotificationChannel() {
  if (Platform.OS === 'android') {
    await setNotificationChannelAsync('default', {
      name: i18n.t('settings.permissions.notificationChannel'),
      importance: AndroidImportance.DEFAULT,
    });
  }
}

export function configureNotificationPresentation() {
  setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}
