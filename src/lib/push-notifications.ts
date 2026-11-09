import Constants from 'expo-constants';
import { getExpoPushTokenAsync } from 'expo-notifications';
import { Platform } from 'react-native';
import { getAppBrand } from '@/config/brand';
import { ensureNotificationChannel, getDevicePermission } from './device-permissions';

/** Register with Expo Push Service after OS permission, without showing a permission prompt. */
export async function getExpoPushToken(): Promise<string | null> {
  if (Platform.OS !== 'android' || !getAppBrand().pushNotifications) return null;
  if (!(await getDevicePermission('notifications')).granted) return null;
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('An Expo project ID is required for Expo push registration.');
  }
  await ensureNotificationChannel();
  const token = await getExpoPushTokenAsync({ projectId });
  return token.data;
}
