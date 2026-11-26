import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = 'appOnboardingCompleted';
let completion: Promise<boolean> | undefined;

export function hasCompletedOnboarding() {
  // Keep the app reachable if local storage is unavailable.
  completion ??= AsyncStorage.getItem(storageKey)
    .then((value) => value === 'true')
    .catch(() => true);
  return completion;
}

export async function completeOnboarding() {
  completion = Promise.resolve(true);
  await AsyncStorage.setItem(storageKey, 'true').catch(() => {});
}
