import { useNavigation } from 'expo-router';
import type { EventConsumer, NavigationProp, ParamListBase } from 'expo-router/react-navigation';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

type PageNavigation = Pick<NavigationProp<ParamListBase>, 'isFocused'> &
  EventConsumer<{
    blur: { data: undefined };
    focus: { data: undefined };
    transitionEnd: { data: { closing: boolean } | undefined };
  }>;

/** Rebind only the Android backdrop after its retained native screen reappears. */
export function usePageBlurKey(enabled: boolean) {
  const navigation = useNavigation<PageNavigation>();
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
    if (Platform.OS !== 'android' || !enabled) return;

    let leftScreen = !navigation.isFocused();
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
      leftScreen = true;
      returning = false;
      cancelRefresh();
    });
    const unsubscribeFocus = navigation.addListener('focus', () => {
      if (!leftScreen) return;
      leftScreen = false;
      returning = true;
      refresh();
    });
    const unsubscribeTransition = navigation.addListener('transitionEnd', ({ data }) => {
      // Stack transitions include closing; tab transitions have no payload.
      if (data?.closing || !returning || !navigation.isFocused()) return;
      returning = false;
      // Focus can precede native reattachment and the temporary transition hardware
      // layer. Rebind once more after that layer is gone, with the same live target.
      refresh();
    });

    return () => {
      cancelRefresh();
      unsubscribeBlur();
      unsubscribeFocus();
      unsubscribeTransition();
    };
  }, [enabled, navigation]);

  return generation;
}
