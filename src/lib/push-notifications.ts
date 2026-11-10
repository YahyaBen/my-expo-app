import { getAppBrand } from '@/config/brand';
import Constants from 'expo-constants';
import { getExpoPushTokenAsync, subscribeToTopicAsync } from 'expo-notifications';
import { Platform } from 'react-native';
import { ensureNotificationChannel, getDevicePermission } from './device-permissions';

/** Join the development Android broadcast topic after OS approval, without prompting. */
export async function subscribeToDevelopmentPushTopic(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const brand = getAppBrand();
  if (!brand.pushNotifications || brand.variant !== 'development') return;
  if (!(await getDevicePermission('notifications')).granted) return;
  await ensureNotificationChannel();
  await subscribeToTopicAsync('all-testing-et');
}

/** Register with Expo Push Service after OS permission, without showing a permission prompt. */
export async function getExpoPushToken(): Promise<string | null> {
  if (Platform.OS !== 'android' || !getAppBrand().pushNotifications) return null;
  if (!(await getDevicePermission('notifications')).granted) return null;
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (typeof projectId !== 'string' || !projectId.trim()) {
    throw new Error('An Expo project ID is required for Expo push registration.');
  }
  await ensureNotificationChannel();
  // Topic registration can wait for connectivity without delaying the Expo token field.
  void subscribeToDevelopmentPushTopic().catch(() => {
    console.warn('[Notifications] Could not join the all-testing-et topic.');
  });
  const token = await getExpoPushTokenAsync({ projectId });
  return token.data;
}
