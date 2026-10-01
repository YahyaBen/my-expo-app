import { Redirect } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StorybookUI from '@/.rnstorybook';
import { TAB_BAR_CONTENT_HEIGHT } from '@/constants/Layout';

export default function StorybookScreen() {
  const insets = useSafeAreaInsets();

  if (!__DEV__) return <Redirect href="/skia" />;

  return (
    <GestureHandlerRootView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: TAB_BAR_CONTENT_HEIGHT + insets.bottom,
        backgroundColor: '#081224',
      }}
    >
      <StorybookUI />
    </GestureHandlerRootView>
  );
}
