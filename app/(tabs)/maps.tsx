import { Suspense, lazy } from 'react';
import { ActivityIndicator, View } from 'react-native';

const MapExperience = lazy(() =>
  import('@/components/map-experience').then(({ MapExperience }) => ({ default: MapExperience }))
);

export default function MapsScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#E9F1EE' }}>
      <Suspense fallback={<ActivityIndicator color="#173C35" style={{ flex: 1, justifyContent: 'center' }} />}>
        <MapExperience />
      </Suspense>
    </View>
  );
}
