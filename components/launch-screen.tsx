import { Image } from 'expo-image';
import LottieView from 'lottie-react-native';
import { Text, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';

export function LaunchScreen() {
  const reducedMotion = useReducedMotion();

  return (
    <View
      accessible
      accessibilityLabel="Likan is loading"
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E6F4FE',
      }}
    >
      <View style={{ width: 240, height: 240, alignItems: 'center', justifyContent: 'center' }}>
        {!reducedMotion && (
          <LottieView
            source={require('../assets/animations/brand-ripple.json')}
            autoPlay
            loop
            style={{ position: 'absolute', width: 240, height: 240 }}
          />
        )}
        <Image
          source={require('../assets/images/icon.png')}
          contentFit="contain"
          style={{ width: 190, height: 190 }}
          accessible={false}
        />
      </View>
      <Text style={{ color: '#173C65', fontFamily: 'Inter-Black', fontSize: 28, marginTop: 16 }}>
        Likan
      </Text>
      {!reducedMotion && (
        <LottieView
          source={require('../assets/animations/loading-dots.json')}
          autoPlay
          loop
          style={{ width: 84, height: 24, marginTop: 20 }}
        />
      )}
    </View>
  );
}
