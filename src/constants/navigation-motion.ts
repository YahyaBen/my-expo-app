import type { NativeStackNavigationOptions } from 'expo-router';
import { Platform } from 'react-native';
import type { LayoutDirection } from '@/context/layout-direction.context';

type MotionNavigationState = {
  readonly routes: readonly {
    readonly key?: string;
    readonly name: string;
    readonly state?: MotionNavigationState;
  }[];
};

/** Locate the owning stack below Router's wrapper before counting pushes above the shell. */
export function stackRouteDepth(
  state: MotionNavigationState,
  routeKey: string | undefined,
): number | undefined {
  if (!routeKey) return undefined;
  const routeIndex = state.routes.findIndex((route) => route.key === routeKey);
  if (routeIndex >= 0) {
    const rootIndex = state.routes.findLastIndex(
      (route, index) => index <= routeIndex && route.name === 'index',
    );
    return routeIndex - Math.max(0, rootIndex);
  }
  for (const route of state.routes) {
    if (!route.state) continue;
    const depth = stackRouteDepth(route.state, routeKey);
    if (depth !== undefined) return depth;
  }
  return undefined;
}

export function stackMotionOptions(
  reducedMotion: boolean,
  direction: LayoutDirection,
  fromBottom = false,
): NativeStackNavigationOptions {
  // The iOS push follows the stack's locale; Android uses physical directions.
  const horizontalAnimation =
    Platform.OS === 'ios'
      ? 'simple_push'
      : direction === 'rtl'
        ? 'slide_from_left'
        : 'slide_from_right';
  return {
    animation: reducedMotion ? 'none' : fromBottom ? 'slide_from_bottom' : horizontalAnimation,
    ...(Platform.OS === 'ios'
      ? {
          animationDuration: 220,
          animationMatchesGesture: true,
          gestureDirection: fromBottom ? 'vertical' : 'horizontal',
        }
      : {}),
  };
}
