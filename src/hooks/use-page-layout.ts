import { useIsFocused } from 'expo-router';
import { useCallback, useContext, useEffect, useRef } from 'react';
import { PerformanceReadyContext } from '@/context/performance-ready.context';
import { StartupLayoutContext } from '@/context/startup-layout.context';
import { usePerformanceObserver } from '@/lib/performance';
import { useAppActive } from './use-motion-enabled';

/** Report initial layout and frame readiness without making the frame own startup state. */
export function usePageLayout() {
  const focused = useIsFocused();
  const active = useAppActive();
  const ready = useContext(PerformanceReadyContext);
  const onStartupLayout = useContext(StartupLayoutContext);
  const { markInteractive } = usePerformanceObserver();
  const laidOut = useRef(false);
  const marked = useRef(false);

  useEffect(() => {
    if (laidOut.current) onStartupLayout?.();
  }, [onStartupLayout]);

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
    onStartupLayout?.();
    markIfReady();
  }, [markIfReady, onStartupLayout]);
}
