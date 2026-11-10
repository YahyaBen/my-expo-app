import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {
  Button,
  Icon,
  PageScreen,
  PageSection,
  Row,
  Text,
  UniversalTextContent,
  useHostColorScheme,
  useHostLayoutDirection,
} from '@components/ui';
import { radii, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { ButtonExamples } from '@/features/template/button-examples';
import { HostedPreview } from './hosted-preview';

const starIcon = Icon.select({ ios: 'star.fill', android: 'star' });

function GallerySection({
  title,
  description,
  children,
}: Readonly<{
  title: string;
  description?: string;
  children: ReactNode;
}>) {
  return (
    <PageSection spacing={spacing.md}>
      <UniversalTextContent variant="subtitle">{title}</UniversalTextContent>
      {description && (
        <UniversalTextContent variant="caption" tone="muted">
          {description}
        </UniversalTextContent>
      )}
      {children}
    </PageSection>
  );
}

export default function ButtonsScreen() {
  const { t } = useTranslation();
  const [presses, setPresses] = useState(0);

  return (
    <PageScreen
      title={t('showcase.buttons')}
      description={t('componentCatalog.descriptions.button')}
    >
      <PageSection>
        <UniversalTextContent testID="demo-button-count">
          {t('showcase.actions', { count: presses })}
        </UniversalTextContent>
        <ButtonExamples
          onPress={() => setPresses((count) => count + 1)}
          testIDPrefix="demo-button"
        />
      </PageSection>
    </PageScreen>
  );
}

/** Shared with the native fixture; these controls cross a real RN boundary. */
export function StandaloneButtonPreview({
  onPress,
}: Readonly<{ onPress: (labelKey: string) => void }>) {
  const { t } = useTranslation();
  const lightColors = useThemeColors('light');
  const darkColors = useThemeColors('dark');
  return (
    <GallerySection
      title={t('showcase.buttonGallery.standalone')}
      description={t('showcase.buttonGallery.standaloneHint')}
    >
      <HostedPreview>
        <View
          style={{ width: '100%', backgroundColor: lightColors.background, padding: spacing.lg }}
        >
          <Button
            variant="primary"
            colorScheme="light"
            contentPadding={spacing.lg}
            cornerRadii={{ topLeft: radii.card, bottomRight: radii.card }}
            fullWidth
            testID="demo-button-standalone-light"
            onPress={() => onPress('showcase.buttonGallery.lightCorners')}
          >
            <StandaloneButtonLabel
              label={t('showcase.buttonGallery.lightCorners')}
              testID="demo-button-standalone-light-label"
            />
          </Button>
        </View>
        <View
          style={{ width: '100%', backgroundColor: darkColors.background, padding: spacing.lg }}
        >
          <Button
            variant="primary"
            colorScheme="dark"
            contentPadding={spacing.lg}
            cornerRadii={{ topLeft: radii.card, bottomRight: radii.card }}
            fullWidth
            testID="demo-button-standalone-dark"
            onPress={() => onPress('showcase.buttonGallery.darkCorners')}
          >
            <StandaloneButtonLabel
              label={t('showcase.buttonGallery.darkCorners')}
              testID="demo-button-standalone-dark-label"
            />
          </Button>
        </View>
        <Button
          variant="primary"
          testID="demo-button-standalone-inline"
          onPress={() => onPress('showcase.buttonGallery.fitContent')}
        >
          <StandaloneButtonLabel
            label={t('showcase.buttonGallery.fitContent')}
            testID="demo-button-standalone-inline-label"
          />
        </Button>
        <Button
          variant="primary"
          disabled
          fullWidth
          label={t('showcase.disabledAction')}
          testID="demo-button-standalone-disabled"
          onPress={() => onPress('showcase.disabledAction')}
        />
      </HostedPreview>
    </GallerySection>
  );
}

function StandaloneButtonLabel({ label, testID }: Readonly<{ label: string; testID: string }>) {
  const { t } = useTranslation();
  const scheme = useHostColorScheme();
  const direction = useHostLayoutDirection();
  const colors = useThemeColors(scheme);
  return (
    <Row spacing={spacing.sm} alignment="center">
      <Icon name={starIcon} size={18} color={colors.onPrimary} />
      <Text testID={testID} textStyle={{ color: colors.onPrimary }}>
        {t('showcase.buttonGallery.hostLabel', {
          label,
          scheme: t(`appearance.${scheme}`),
          direction: direction === 'rightToLeft' ? 'RTL' : 'LTR',
        })}
      </Text>
    </Row>
  );
}
