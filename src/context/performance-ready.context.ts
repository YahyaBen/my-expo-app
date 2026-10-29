import { createContext } from 'react';

/** Root launch/visibility gate. Standalone previews leave motion unrestricted. */
export const PerformanceReadyContext = createContext<boolean | null>(null);
