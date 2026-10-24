export const DEFAULT_HEADER_BLUR = 40;
export const MIN_HEADER_BLUR = 5;
export const MAX_HEADER_BLUR = 100;
export const HEADER_BLUR_STEP = 5;

export function isHeaderBlur(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    Number.isFinite(value) &&
    value >= MIN_HEADER_BLUR &&
    value <= MAX_HEADER_BLUR &&
    value % HEADER_BLUR_STEP === 0
  );
}
