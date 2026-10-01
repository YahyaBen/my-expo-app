import { Canvas, Fill, Shader, Skia, useClock } from '@shopify/react-native-skia';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useDerivedValue, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/Layout';

const shader = Skia.RuntimeEffect.Make(`
uniform vec2 resolution;
uniform float time;
uniform float hue;

vec4 main(vec2 fragCoord) {
  vec2 uv = fragCoord / resolution;
  vec2 p = (fragCoord - 0.5 * resolution) / min(resolution.x, resolution.y);
  float t = time;
  float firstWave = 0.19 * sin(p.x * 3.6 - t * 1.1) + 0.06 * sin(p.x * 8.0 + t * 0.7);
  float secondWave = -0.3 + 0.14 * sin(p.x * 4.1 + t * 0.75);
  float firstBand = exp(-pow((p.y - firstWave) * 4.4, 2.0));
  float secondBand = exp(-pow((p.y - secondWave) * 5.5, 2.0));
  vec2 orb = vec2(0.46 * sin(t * 0.75), 0.13 * cos(t * 0.92));
  float glow = exp(-length(p - orb) * 3.2);
  float core = exp(-pow(length(p - orb) * 7.0, 2.0));
  vec3 deep = vec3(0.02, 0.07, 0.15);
  vec3 teal = vec3(0.08, 0.8, 0.68);
  vec3 violet = vec3(0.53, 0.28, 0.95);
  vec3 accent = mix(teal, violet, 0.5 + 0.5 * sin(hue));
  vec3 color = deep + accent * firstBand * 0.65 + violet * secondBand * 0.26;
  color += accent * glow * 0.37 + vec3(0.48, 0.82, 1.0) * core * 0.42;
  color += vec3(0.06, 0.13, 0.24) * (1.0 - uv.y);
  return vec4(color, 1.0);
}
`)!;

if (!shader) {
  throw new Error('Could not create the Skia shader.');
}

const paletteNames = ['Aurora', 'Prism', 'Tidal'];

export default function SkiaExperience() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const tabBarHeight = TAB_BAR_CONTENT_HEIGHT + insets.bottom;
  const clock = useClock();
  const reduceMotion = useReducedMotion();
  const hue = useSharedValue(0);
  const [palette, setPalette] = useState(0);

  const uniforms = useDerivedValue(() => ({
    resolution: [width, height],
    time: reduceMotion ? 0 : clock.get() / 1000,
    hue: hue.get(),
  }));

  const changePalette = () => {
    const next = (palette + 1) % paletteNames.length;
    setPalette(next);
    hue.set(withTiming(next * 2.1, { duration: reduceMotion ? 0 : 250 }));
  };

  return (
    <View style={{ flex: 1 }}>
      <Canvas style={{ flex: 1 }}>
        <Fill>
          <Shader source={shader} uniforms={uniforms} />
        </Fill>
      </Canvas>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          position: 'absolute',
          left: Math.max(24, insets.left + 16),
          right: Math.max(24, insets.right + 16),
          bottom: tabBarHeight + 24,
          maxHeight: Math.max(0, height - insets.top - tabBarHeight - 48),
        }}
        contentContainerStyle={{ gap: 12 }}
      >
        <Text style={{ color: '#B8E9FF', fontSize: 12, letterSpacing: 2 }}>LIVE CANVAS</Text>
        <Text style={{ color: '#FFFFFF', fontFamily: 'Inter-Black', fontSize: 40 }}>Light in motion</Text>
        <Text style={{ color: '#DBEDF4', fontSize: 15, lineHeight: 22 }}>
          A Skia shader animated with Reanimated. Change the colors and watch the canvas respond.
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Change color palette, currently ${paletteNames[palette]}`}
          onPress={changePalette}
          style={{ alignSelf: 'flex-start', marginTop: 8, paddingHorizontal: 18, paddingVertical: 12, borderRadius: 16, backgroundColor: '#FFFFFF' }}
        >
          <Text style={{ color: '#132943', fontWeight: '700' }}>Palette: {paletteNames[palette]}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
