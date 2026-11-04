import * as Location from 'expo-location';
import { Linking } from 'react-native';

export async function requestLocationServices(): Promise<boolean> {
  try {
    await Location.enableNetworkProviderAsync();
  } catch {
    // Dismissing the system dialog leaves the choice with the user.
  }
  return Location.hasServicesEnabledAsync();
}

export async function openLocationServicesSettings(): Promise<void> {
  try {
    await Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
  } catch {
    await Linking.openSettings();
  }
}
