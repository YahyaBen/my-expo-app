import { scheduleNotificationAsync } from 'expo-notifications';
import { Platform } from 'react-native';
import { getAppBrand } from '@/config/brand';
import {
  configureNotificationPresentation,
  ensureNotificationChannel,
  getDevicePermission,
} from './device-permissions';

const productionTopic = 'all-testing';

function getFirebaseMessaging() {
  if (Platform.OS !== 'android' || !getAppBrand().firebaseMessaging) return null;
  // iOS deliberately excludes these native modules until its Firebase setup is supplied.
  // eslint-disable-next-line @typescript-eslint/no-require-imports -- Keep the native import behind the Android configuration guard.
  return require('@react-native-firebase/messaging') as typeof import('@react-native-firebase/messaging');
}

function reportToken(token: string) {
  if (__DEV__) console.info('[FCM] device token:', token);
}

function subscribeToProductionTopic(firebase: typeof import('@react-native-firebase/messaging')) {
  if (getAppBrand().variant !== 'production') return;
  // Topic registration can wait for connectivity without delaying display of the device token.
  void firebase.subscribeToTopic(firebase.getMessaging(), productionTopic).catch(() => {
    console.warn('[FCM] Could not subscribe to the production topic.');
  });
}

/** Observe token rotations without adding storage or requesting OS permission. */
export function onFirebaseMessagingTokenRefresh(listener: (token: string) => void) {
  const firebase = getFirebaseMessaging();
  return firebase ? firebase.onTokenRefresh(firebase.getMessaging(), listener) : () => {};
}

/** Read a direct FCM token after OS permission; this never displays a permission prompt. */
export async function getFirebaseMessagingToken(): Promise<string | null> {
  const firebase = getFirebaseMessaging();
  if (!firebase || !(await getDevicePermission('notifications')).granted) return null;
  await ensureNotificationChannel();
  const messaging = firebase.getMessaging();
  await firebase.setAutoInitEnabled(messaging, true);
  const token = await firebase.getToken(messaging);
  reportToken(token);
  subscribeToProductionTopic(firebase);
  return token;
}

/** Listen while active after launch; notification permission stays with the Settings action. */
export function startFirebaseMessaging() {
  const firebase = getFirebaseMessaging();
  if (!firebase) return () => {};
  const messaging = firebase.getMessaging();
  configureNotificationPresentation();

  const stopMessages = firebase.onMessage(messaging, async (message) => {
    if (!message.notification) return;
    try {
      await ensureNotificationChannel();
      await scheduleNotificationAsync({
        identifier: message.messageId,
        content: {
          title: message.notification.title,
          body: message.notification.body,
          data: message.data,
          sound: 'default',
        },
        trigger: { channelId: 'default' },
      });
    } catch {
      console.warn('[FCM] Could not present the foreground notification.');
    }
  });
  const stopTokens = firebase.onTokenRefresh(messaging, (token) => {
    reportToken(token);
    subscribeToProductionTopic(firebase);
  });
  void getFirebaseMessagingToken().catch(() => {
    console.warn('[FCM] Could not register for push notifications.');
  });

  return () => {
    stopMessages();
    stopTokens();
  };
}
