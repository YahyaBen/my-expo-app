import { Linking, Pressable, Text, View } from 'react-native';

export function MapExperience() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E9F1EE', padding: 24 }}>
      <View style={{ maxWidth: 420, width: '100%', backgroundColor: '#FFFFFF', borderRadius: 24, padding: 28, gap: 14 }}>
        <Text style={{ color: '#53736B', fontSize: 12, letterSpacing: 2 }}>EXPLORE THE MAP</Text>
        <Text style={{ color: '#173C35', fontFamily: 'Inter-Black', fontSize: 30 }}>Casablanca</Text>
        <Text style={{ color: '#4B645F', fontSize: 15 }}>
          Open the interactive map in your browser, or use the Maps tab on iOS or Android.
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
