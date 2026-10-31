/** Keep invalid values out of native progress APIs; missing values remain indeterminate. */
export function normalizeProgress(value: number | undefined) {
  return value !== undefined && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : undefined;
}
