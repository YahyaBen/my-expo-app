// Worklet dependencies must be initialized before the worklets that capture them.
function photoMotionTangent(index: number, input: readonly number[], output: readonly number[]) {
  'worklet';
  // Match the constant styles outside the interpolation range.
  if (index === 0 || index === input.length - 1) return 0;
  const before = input[index] - input[index - 1];
  const after = input[index + 1] - input[index];
  const incoming = (output[index] - output[index - 1]) / before;
  const outgoing = (output[index + 1] - output[index]) / after;
  if (incoming * outgoing <= 0) return 0;
  const firstWeight = 2 * after + before;
  const secondWeight = after + 2 * before;
  return (firstWeight + secondWeight) / (firstWeight / incoming + secondWeight / outgoing);
}

/** Spatial interpolation for scroll-driven artwork; the native scroll remains the clock. */
export function interpolatePhotoMotion(
  value: number,
  input: readonly number[],
  output: readonly number[],
) {
  'worklet';
  const last = input.length - 1;
  if (value <= input[0]) return output[0];
  if (value >= input[last]) return output[last];

  let index = 0;
  while (value > input[index + 1]) index++;
  const span = input[index + 1] - input[index];
  const t = (value - input[index]) / span;
  const t2 = t * t;
  const t3 = t2 * t;
  // Monotone cubic Hermite interpolation keeps velocity continuous at each
  // card position without overshooting opacity, scale or the visible stack.
  return (
    (2 * t3 - 3 * t2 + 1) * output[index] +
    (t3 - 2 * t2 + t) * span * photoMotionTangent(index, input, output) +
    (-2 * t3 + 3 * t2) * output[index + 1] +
    (t3 - t2) * span * photoMotionTangent(index + 1, input, output)
  );
}
