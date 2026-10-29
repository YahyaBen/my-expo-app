import { triggerHaptic } from './haptics';

export function notifyValidationError() {
  triggerHaptic('error');
}
