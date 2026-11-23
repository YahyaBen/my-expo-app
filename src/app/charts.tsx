export default function ChartsRoute() {
  const ChartsScreen: typeof import('@/features/charts/charts-screen').default =
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Evaluate chart libraries only when this destination opens.
    require('@/features/charts/charts-screen').default;
  return <ChartsScreen />;
}
