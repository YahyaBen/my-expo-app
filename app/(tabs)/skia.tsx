import { Suspense, lazy } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { AsyncSkia } from '@/components/async-skia';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

const SkiaExperience = lazy(() => import('@/components/skia-experience'));

export default function SkiaScreen() {
  const clientReady = useClientOnlyValue(false, true);

  return (
    <View style={{ flex: 1, backgroundColor: '#081224' }}>
      <StatusBar style="light" />
      {clientReady ? (
        <Suspense fallback={<ActivityIndicator color="#B8E9FF" style={{ flex: 1 }} />}>
          <AsyncSkia />
          <SkiaExperience />
        </Suspense>
      ) : null}
    </View>
  );
}
