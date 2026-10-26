import type { FlashListProps } from '@shopify/flash-list';
import type { SampleDestination } from './sample-destinations';

const diagnostics = {
  initialLayoutMs: null as number | null,
  mountedCells: 0,
  peakMountedCells: 0,
  visibleRows: 0,
};

/** Count cell instances, rather than item IDs, so recycling does not look like a new mount. */
export function trackDestinationCellMount() {
  if (!__DEV__) return;
  diagnostics.mountedCells += 1;
  diagnostics.peakMountedCells = Math.max(diagnostics.peakMountedCells, diagnostics.mountedCells);
  return () => {
    diagnostics.mountedCells = Math.max(0, diagnostics.mountedCells - 1);
    if (diagnostics.mountedCells === 0) diagnostics.visibleRows = 0;
  };
}

export const reportDestinationListLoad: NonNullable<
  FlashListProps<SampleDestination>['onLoad']
> = ({ elapsedTimeInMs }) => {
  if (!__DEV__) return;
  diagnostics.initialLayoutMs = Math.round(elapsedTimeInMs);
  console.info('[destinations] FlashList initial layout', getDestinationListDiagnostics());
};

export const reportDestinationViewability: NonNullable<
  FlashListProps<SampleDestination>['onViewableItemsChanged']
> = ({ viewableItems }) => {
  if (!__DEV__) return;
  diagnostics.visibleRows = viewableItems.length;
};

/** Development snapshot since module initialization; Fast Refresh can reset it. */
export function getDestinationListDiagnostics() {
  return { ...diagnostics };
}
