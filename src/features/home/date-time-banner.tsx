import {
  Column,
  UniversalTextContent,
  nativeFillWidthCenter,
  useHostColorScheme,
} from '@components/ui';
import { useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import { radii, spacing } from '@/constants/layout';
import { useLanguage } from '@/context/language.context';
import { useAppActive } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';

export function DateTimeBanner() {
  const { language } = useLanguage();
  const colors = useThemeColors(useHostColorScheme());
  const active = useAppActive();
  const focused = useIsFocused();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!active || !focused) return;
    let timer: ReturnType<typeof setTimeout>;
    function update() {
      const current = new Date();
      setNow(current);
      timer = setTimeout(update, 60_000 - (current.getTime() % 60_000));
    }
    update();
    return () => clearTimeout(timer);
  }, [active, focused]);

  // Retain the existing banner and primary-text selectors.
  return (
    <Column
      alignment="center"
      spacing={spacing.sm}
      modifiers={nativeFillWidthCenter}
      style={{
        padding: spacing.xl,
        borderRadius: radii.card,
        backgroundColor: colors.surfaceVariant,
      }}
      testID="home-ramadan-banner"
    >
      <UniversalTextContent
        variant="body"
        tone="muted"
        textStyle={{ textAlign: 'center' }}
        testID="home-ramadan-greeting"
      >
        {now.toLocaleDateString(language, { dateStyle: 'full' })}
      </UniversalTextContent>
      <UniversalTextContent variant="heading" testID="home-time">
        {now.toLocaleTimeString(language, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </UniversalTextContent>
    </Column>
  );
}
