import { useNavigation, type NativeStackNavigationProp } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

type PageNavigation = Pick<
  NativeStackNavigationProp<Record<string, object | undefined>>,
  'isFocused' | 'addListener'
>;

/** Rebind only the Android backdrop after its retained native screen reappears. */
export function usePageBlurKey(enabled: boolean) {
  const navigation = useNavigation<PageNavigation>();
  const [generation, setGeneration] = useState(0);
  const leftScreen = useRef(false);

  useEffect(() => {
    if (Platform.OS !== 'android' || !enabled) return;

    if (!navigation.isFocused()) leftScreen.current = true;
    let returning = false;
    let frame: number | undefined;
    const cancelRefresh = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
    };
    const refresh = () => {
      cancelRefresh();
      frame = requestAnimationFrame(() => {
        frame = undefined;
        setGeneration((value) => value + 1);
      });
    };
    const unsubscribeBlur = navigation.addListener('blur', () => {
      leftScreen.current = true;
      returning = false;
      cancelRefresh();
    });
    const handleFocus = () => {
      if (!leftScreen.current) return;
      leftScreen.current = false;
      returning = true;
      refresh();
    };
    const unsubscribeFocus = navigation.addListener('focus', handleFocus);
    const unsubscribeTransition = navigation.addListener('transitionEnd', ({ data }) => {
      // Stack transitions include closing; tab transitions have no payload.
      if (data?.closing || !returning || !navigation.isFocused()) return;
      returning = false;
      // Focus can precede native reattachment and the temporary transition hardware
      // layer. Rebind once more after that layer is gone, with the same live target.
      refresh();
    });
    // Activity can resume the effect after focus has already been delivered.
    if (navigation.isFocused()) handleFocus();

    return () => {
      // Preserve departure even when Activity cleans up before the blur listener runs.
      if (!navigation.isFocused()) leftScreen.current = true;
      cancelRefresh();
      unsubscribeBlur();
      unsubscribeFocus();
      unsubscribeTransition();
    };
  }, [enabled, navigation]);

  return generation;
}
