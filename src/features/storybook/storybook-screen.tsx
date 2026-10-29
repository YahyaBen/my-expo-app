import { Redirect, useLocalSearchParams } from 'expo-router';
import { useContext } from 'react';
import { View } from 'react-native';
import { storybookEnabled } from '@/config/developer-tools';
import { StartupLayoutContext } from '@/context/startup-layout.context';

// Keep the registration dependency inside a branch Expo removes from release bundles.
const StorybookUI: typeof import('@storybook').default | undefined = __DEV__
  ? // eslint-disable-next-line @typescript-eslint/no-require-imports -- Expo removes this dependency in release mode.
    require('@storybook').default
  : undefined;

export default function StorybookScreen() {
  const { storyId, canvas } = useLocalSearchParams<{ storyId?: string; canvas?: string }>();
  const onLayout = useContext(StartupLayoutContext);

  if (!storybookEnabled || !StorybookUI) return <Redirect href="/" />;

  const canvasMode = canvas === 'true';
  return (
    <View testID="storybook-root" style={{ flex: 1 }} onLayout={onLayout}>
      <StorybookUI
        key={`${canvasMode ? 'canvas' : 'browser'}:${storyId ?? ''}`}
        canvasMode={canvasMode}
        initialStoryId={storyId}
      />
    </View>
  );
}
