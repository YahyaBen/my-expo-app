import Constants from 'expo-constants';
import MapView, { Marker } from 'react-native-maps';
import { Linking, Pressable, Text, View } from 'react-native';

const CASABLANCA = { latitude: 33.5731, longitude: -7.5898 };

export function MapExperience() {
  if (
    process.env.EXPO_OS === 'android' &&
    !Constants.expoGoConfig &&
    Constants.expoConfig?.extra?.androidMapsConfigured !== true
  ) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E9F1EE', padding: 24 }}>
        <View style={{ maxWidth: 420, width: '100%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28, gap: 14 }}>
          <Text style={{ color: '#53736B', fontSize: 12, letterSpacing: 2 }}>EXPLORE THE MAP</Text>
          <Text style={{ color: '#173C35', fontFamily: 'Inter-Black', fontSize: 30 }}>Casablanca</Text>
          <Text style={{ color: '#4B645F', fontSize: 15 }}>
            The in-app map is unavailable in this build. You can still explore Casablanca in your browser.
          </Text>
          <Pressable
            accessibilityRole="link"
            onPress={() => void Linking.openURL('https://www.openstreetmap.org/#map=12/33.5731/-7.5898')}
            style={{ alignSelf: 'flex-start', backgroundColor: '#173C35', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12 }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '600' }}>Open map</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#E9F1EE' }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{ ...CASABLANCA, latitudeDelta: 0.08, longitudeDelta: 0.08 }}
        showsCompass
        accessibilityLabel="Map centered on Casablanca"
      >
        <Marker coordinate={CASABLANCA} title="Casablanca" description="Explore the city" />
      </MapView>
      <View
        style={{
          position: 'absolute',
          left: 20,
          right: 20,
          bottom: 20,
          backgroundColor: '#FFFFFF',
          padding: 20,
          borderRadius: 24,
          borderCurve: 'continuous',
          boxShadow: '0 8px 24px rgba(20, 43, 54, 0.16)',
          gap: 5,
        }}
      >
        <Text style={{ color: '#53736B', fontSize: 12, letterSpacing: 2 }}>EXPLORE THE MAP</Text>
        <Text style={{ color: '#173C35', fontFamily: 'Inter-Black', fontSize: 27 }}>Casablanca</Text>
        <Text style={{ color: '#4B645F', fontSize: 14 }}>Pinch to zoom, drag to explore, or tap the marker.</Text>
      </View>
    </View>
  );
}
