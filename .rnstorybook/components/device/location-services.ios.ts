import { Linking } from 'react-native';

export async function requestLocationServices(): Promise<boolean> {
  await openLocationServicesSettings();
  // Opening Settings does not mean the user has enabled location services.
  return false;
}

export async function openLocationServicesSettings(): Promise<void> {
  await Linking.openSettings();
}
