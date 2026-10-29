import * as Haptics from 'expo-haptics';
import { AppState, Platform } from 'react-native';
import { isDeviceFeatureEnabled } from './device-preferences';

export type HapticFeedback = 'selection' | 'action' | 'success' | 'warning' | 'error';

const androidFeedback = {
  selection: Haptics.AndroidHaptics.Clock_Tick,
  action: Haptics.AndroidHaptics.Context_Click,
  success: Haptics.AndroidHaptics.Confirm,
  // Android has no separate warning effect; use its native rejection feedback.
  warning: Haptics.AndroidHaptics.Reject,
  error: Haptics.AndroidHaptics.Reject,
} satisfies Record<HapticFeedback, Haptics.AndroidHaptics>;

function androidHaptic(feedback: HapticFeedback): Promise<void> {
  let effect: Haptics.AndroidHaptics = androidFeedback[feedback];
  // Expo rejects constants newer than the device API level instead of choosing a fallback.
  if (Platform.OS === 'android' && Platform.Version < 30) {
    if (feedback === 'success') effect = Haptics.AndroidHaptics.Context_Click;
    if (feedback === 'warning' || feedback === 'error') effect = Haptics.AndroidHaptics.Long_Press;
  }
  return Haptics.performAndroidHapticsAsync(effect);
}

const notificationFeedback = {
  success: Haptics.NotificationFeedbackType.Success,
  warning: Haptics.NotificationFeedbackType.Warning,
  error: Haptics.NotificationFeedbackType.Error,
};

let lastInteractionAt = -Infinity;
let lastNotificationAt = -Infinity;
let lastNotification: HapticFeedback | undefined;

/** Best-effort feedback for user interactions. Never await it or queue delayed vibrations. */
export function triggerHaptic(feedback: HapticFeedback): void {
  if (!isDeviceFeatureEnabled('haptics')) return;
  if (Platform.OS !== 'ios' && Platform.OS !== 'android') return;
  if (AppState.currentState !== 'active') return;

  const now = performance.now();
  const notification = feedback === 'success' || feedback === 'warning' || feedback === 'error';
  if (notification) {
    // Several invalid fields or repeated native events can report the same outcome together.
    if (feedback === lastNotification && now - lastNotificationAt < 250) return;
    lastNotification = feedback;
    lastNotificationAt = now;
  } else {
    if (now - lastInteractionAt < 80 || now - lastNotificationAt < 250) return;
    lastInteractionAt = now;
  }

  try {
    const result =
      Platform.OS === 'android'
        ? androidHaptic(feedback)
        : feedback === 'selection'
          ? Haptics.selectionAsync()
          : feedback === 'action'
            ? Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
            : Haptics.notificationAsync(notificationFeedback[feedback]);
    void result.catch(() => {
      // Hardware, system settings or the installed native runtime may suppress feedback.
    });
  } catch {
    // Optional feedback must never prevent the user's action.
  }
}
