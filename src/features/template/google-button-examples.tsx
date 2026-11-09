import { radii, spacing } from '@/constants/layout';
import {
  ButtonContent,
  Column,
  RNHostView,
  Row,
  Text,
  UniversalTextContent,
  nativeFillWidth,
  nativeRowWeight,
} from '@components/ui';
import { Image } from 'expo-image';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

const googleActions = [
  { id: 'login', labelKey: 'showcase.buttonGallery.googleLogin' },
  { id: 'register', labelKey: 'showcase.buttonGallery.googleRegister' },
] as const;

export function GoogleButtonExamples({
  onPress,
}: Readonly<{ onPress: (labelKey: string) => void }>) {
  const { t } = useTranslation();

  return (
    <Column spacing={spacing.md} modifiers={nativeFillWidth}>
      <UniversalTextContent variant="subtitle">
        {t('showcase.buttonGallery.google')}
      </UniversalTextContent>
      <UniversalTextContent variant="caption" tone="muted">
        {t('showcase.buttonGallery.googleHint')}
      </UniversalTextContent>
      {googleActions.map(({ id, labelKey }) => (
        <ButtonContent
          key={id}
          variant="primary"
          accessibilityLabel={t(labelKey)}
          fullWidth
          borderRadius={radii.pill}
          color="#F2F2F2"
          contentColor="#1F1F1F"
          testID={`component-button-google-${id}`}
          onPress={() => onPress(labelKey)}
        >
          <Row spacing={spacing.md} alignment="center" modifiers={nativeFillWidth}>
            <RNHostView matchContents>
              <View
                collapsable={false}
                pointerEvents="none"
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image
                  source={require('@assets/images/google-g.png')}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                  accessible={false}
                  pointerEvents="none"
                />
              </View>
            </RNHostView>
            <Column modifiers={nativeRowWeight}>
              <Text>{t(labelKey)}</Text>
            </Column>
          </Row>
        </ButtonContent>
      ))}
    </Column>
  );
}
