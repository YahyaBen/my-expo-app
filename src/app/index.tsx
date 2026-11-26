import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { hasCompletedOnboarding } from '@/features/onboarding/onboarding-preference';
import TemplateScreen from '@/features/template/template-screen';

export default function Index() {
  const [showApp, setShowApp] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let focused = true;
      void hasCompletedOnboarding().then((completed) => {
        if (!focused) return;
        if (completed) setShowApp(true);
        else router.replace('/onboarding');
      });
      return () => {
        focused = false;
      };
    }, []),
  );

  return showApp ? <TemplateScreen /> : null;
}
