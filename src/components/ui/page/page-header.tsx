import { Column, Row } from '@expo/ui';
import { Platform } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme';
import { useLanguage } from '@/context/language.context';
import { getBrandHeadingFont } from '@/config/brand-assets';
import { UniversalHost, useHostColorScheme } from '../host/universal-host';
import { UniversalTextContent as Text } from '../text/universal-text';
import { PageBackButton } from './page-back-button';
import { PAGE_HEADER_MIN_HEIGHT } from './page-header-layout';
import {
  nativeCenteredMinHeight,
  nativeFillWidth,
  nativeRowWeight,
} from '../native/native-fill-width';
import { screenContentMaxWidth, spacing } from '@/constants/layout';

/** Page title and optional navigation action. Preferences live in App Settings. */
export function PageHeader({
  title,
  onBack,
  colorScheme,
}: Readonly<{
  title?: string;
  onBack?: () => void;
  colorScheme?: 'light' | 'dark';
}>) {
  const scheme = useHostColorScheme(colorScheme);
  const colors = useThemeColors(scheme);
  const { language } = useLanguage();
  const headingFont = getBrandHeadingFont(language);
  const isIOS = Platform.OS === 'ios';
  return (
    <UniversalHost
      colorScheme={scheme}
      ignoreSafeArea="all"
      style={{ maxWidth: screenContentMaxWidth, alignSelf: 'center' }}
      testID="page-header"
    >
      <Column
        spacing={spacing.sm}
        modifiers={nativeFillWidth}
        style={{ paddingHorizontal: spacing.lg }}
      >
        {title ? (
          <Row
            alignment="center"
            spacing={spacing.sm}
            modifiers={nativeCenteredMinHeight(PAGE_HEADER_MIN_HEIGHT)}
          >
            {onBack ? <PageBackButton color={colors.tint} onPress={onBack} /> : null}
            <Column alignment="start" modifiers={isIOS ? nativeFillWidth : nativeRowWeight}>
              <Text
                variant="title"
                tone="primary"
                textStyle={{ fontFamily: headingFont }}
                testID="page-title"
              >
                {title}
              </Text>
            </Column>
          </Row>
        ) : null}
      </Column>
    </UniversalHost>
  );
}
