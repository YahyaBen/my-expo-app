import { requireOptionalNativeModule } from 'expo';
import { Fragment } from 'react';

// Older development clients and Expo Go may not contain these installed native
// modules. Keep the app usable until a matching native build is installed.
const hasNativeMetrics =
  requireOptionalNativeModule('ExpoObserve') !== null &&
  requireOptionalNativeModule('ExpoAppMetrics') !== null;
const observer: typeof import('expo-observe') | undefined = hasNativeMetrics
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- Importing Observe without its native modules throws at module evaluation.
    require('expo-observe')
  : undefined;

const useNoopObserver: typeof import('expo-observe').useObserve = () => ({
  markInteractive: () => {},
});

export const PerformanceRoot = observer?.ObserveRoot ?? Fragment;
// Native availability is fixed for this JS runtime, so hook selection cannot
// change while components are mounted.
export const usePerformanceObserver = observer?.useObserve ?? useNoopObserver;

export function configurePerformance(environment: string) {
  observer?.Observe.configure({
    environment,
    integrations: {
      'expo-router': { filteredParams: ['challengeId', 'token', 'code', 'email'] },
    },
  });
}

type StartupMilestone =
  | 'fonts_ready'
  | 'preferences_ready'
  | 'session_ready'
  | 'page_layout_ready'
  | 'content_ready'
  | 'interactive'
  | 'recovery_interactive';

const startedAt = performance.now();
const startupTimings: Partial<Record<StartupMilestone, number>> = {};

/** Once per JS runtime; elapsedMs starts at this module, not native process creation. */
export function markStartupMilestone(milestone: StartupMilestone) {
  if (startupTimings[milestone] !== undefined) return;
  const elapsedMs = Math.round(performance.now() - startedAt);
  startupTimings[milestone] = elapsedMs;
  try {
    observer?.Observe.logEvent(`app.startup.${milestone}`, { attributes: { elapsedMs } });
  } catch {
    // Optional telemetry must not prevent startup or recovery.
  }
}

/** A bounded snapshot is also available in the native JS debugger without dispatching events. */
export function getStartupTimings() {
  return { ...startupTimings };
}
