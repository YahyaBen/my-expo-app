import { createContext } from 'react';

/** Native page markers wait until the app's blocking launch overlay has exited. */
export const PerformanceReadyContext = createContext(false);
