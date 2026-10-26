import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import {
  Column,
  Icon,
  Row,
  UniversalHost,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import { useAppTheme } from '@/hooks/use-theme';
import { LANGUAGE_FALLBACK, normalizeLanguage, type Language } from '@/lib/i18n';
import { trackDestinationCellMount } from './destination-list-diagnostics';
import type { SampleDestination } from './sample-destinations';

const transportIcons = {
  train: Icon.select({
    ios: 'tram.fill',
    android: require('@expo/material-symbols/train.xml'),
  }),
  bus: Icon.select({
    ios: 'bus.fill',
    android: require('@expo/material-symbols/directions_bus.xml'),
  }),
};

// The app supports three languages; construct at most one formatter for each.
const timeFormatters: Partial<Record<Language, Intl.DateTimeFormat>> = {};

function getTimeFormatter(language: Language) {
  return (timeFormatters[language] ??= new Intl.DateTimeFormat(language, {
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
    timeZone: 'UTC',
  }));
}

function formatTime(minutes: number, formatter: Intl.DateTimeFormat) {
  return formatter.format(new Date(Date.UTC(2026, 0, 1, 0, minutes)));
}

/** Each recycled RN list cell owns the Host for its native row content. */
export function DestinationRow({ destination }: { destination: SampleDestination }) {
  const { t, i18n } = useTranslation();
  const { colors, design } = useAppTheme(useHostColorScheme());
  const { fontScale } = useWindowDimensions();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language) ?? LANGUAGE_FALLBACK;
  const timeFormatter = getTimeFormatter(language);
  const minimumHeight =
    spacing.lg * 2 +
    spacing.md +
    spacing.xs * 3 +
    1 +
    fontScale *
      (design.typography.label.fontSize +
        design.typography.caption.fontSize * 3 +
        design.typography.subtitle.fontSize);

  useEffect(trackDestinationCellMount, []);

  return (
    <UniversalHost
      testID={`destination-row-${destination.id}`}
      // Native intrinsic size arrives later. A zero-height first layout makes
      // FlashList keep mounting rows to fill the viewport. This floor still
      // allows wrapping and native font metrics to increase the final height.
      style={{ minHeight: minimumHeight }}
    >
      <Column modifiers={nativeFillWidth} spacing={0}>
        <Column
          modifiers={nativeFillWidth}
          spacing={spacing.md}
          style={{ paddingVertical: spacing.lg }}
        >
          <Row modifiers={nativeFillWidth} spacing={spacing.md} alignment="center">
            <Icon name={transportIcons[destination.transport]} size={24} color={colors.tint} />
            <Column modifiers={nativeRowWeight} spacing={spacing.xs}>
              <Text variant="label">
                {t('destinations.journey', { number: destination.number })}
              </Text>
              <Text variant="caption" tone="muted">
                {t(`destinations.${destination.transport}`)}
              </Text>
            </Column>
          </Row>
          <Row modifiers={nativeFillWidth} spacing={spacing.lg}>
            <Column modifiers={nativeRowWeight} spacing={spacing.xs}>
              <Text variant="caption" tone="muted">
                {t('destinations.from')}
              </Text>
              <Text variant="subtitle" modifiers={nativeFillWidth}>
                {destination.from}
              </Text>
              <Text variant="caption" tone="muted" modifiers={nativeFillWidth}>
                {`${t('destinations.departure')} · ${formatTime(destination.startMinutes, timeFormatter)}`}
              </Text>
            </Column>
            <Column modifiers={nativeRowWeight} spacing={spacing.xs}>
              <Text variant="caption" tone="muted">
                {t('destinations.to')}
              </Text>
              <Text variant="subtitle" modifiers={nativeFillWidth}>
                {destination.to}
              </Text>
              <Text variant="caption" tone="muted" modifiers={nativeFillWidth}>
                {`${t('destinations.arrival')} · ${formatTime(destination.endMinutes, timeFormatter)}`}
              </Text>
            </Column>
          </Row>
        </Column>
        <Column
          modifiers={nativeFillWidth}
          style={{ height: 1, backgroundColor: colors.divider }}
        />
      </Column>
    </UniversalHost>
  );
}
