import Constants from 'expo-constants';
import { Platform } from 'react-native';

if (Platform.OS === 'android' && Constants.expoConfig?.extra?.brand?.firebaseMessaging === true) {
  const { getMessaging, setBackgroundMessageHandler } = require('@react-native-firebase/messaging');
  setBackgroundMessageHandler(getMessaging(), async () => {
    // FCM displays notification payloads itself in the background. Do not display them twice.
    // Add data-only background work here when a feature has a concrete contract for it.
  });
}

// Register background messaging before Router loads the React tree.
require('expo-router/entry');
