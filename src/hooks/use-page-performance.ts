import { useIsFocused } from 'expo-router';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { PerformanceReadyContext } from '@/context/performance-ready.context';
import { usePerformanceObserver } from '@/lib/performance';
import { useAppActive } from './use-motion-enabled';

/** Mark a usable native frame, independently of optional data or child animations. */
export function usePagePerformance() {
  const focused = useIsFocused();
  const active = useAppActive();
  const ready = useContext(PerformanceReadyContext);
  const { markInteractive } = usePerformanceObserver();
  const laidOut = useRef(false);
  const marked = useRef(false);

  const markIfReady = useCallback(() => {
    if (!laidOut.current || marked.current || !focused || !active || !ready) return;
    marked.current = true;
    try {
      void Promise.resolve(markInteractive({ params: { readiness: 'frame-layout' } })).catch(() => {
        marked.current = false;
      });
    } catch {
      // Performance reporting must never block navigation or a usable recovery screen.
      marked.current = false;
    }
  }, [active, focused, markInteractive, ready]);

  useEffect(markIfReady, [markIfReady]);

  return useCallback(() => {
    laidOut.current = true;
    markIfReady();
  }, [markIfReady]);
}
