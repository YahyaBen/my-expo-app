import { spacing } from '@/constants/layout';
import {
  BottomSheet,
  ButtonContent,
  Column,
  ScrollView,
  UniversalHost,
  UniversalTextContent as Text,
  nativeFillWidth,
} from '@components/ui';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { componentCatalog, type ComponentId } from './component-catalog';
import { ComponentList } from './component-list';

/** Keep the native presenter mounted while the component menu opens and dismisses. */
export function ComponentMenu({
  isPresented,
  onClose,
  onSelect,
}: Readonly<{
  isPresented: boolean;
  onClose: () => void;
  onSelect: (id: ComponentId) => void;
}>) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const contentHeight = Math.min(560, height * 0.65);

  return (
    <UniversalHost
      matchContents={false}
      ignoreSafeArea="all"
      pointerEvents="none"
      style={{ position: 'absolute', inset: 0 }}
    >
      <BottomSheet
        isPresented={isPresented}
        onDismiss={onClose}
        contentHeight={contentHeight}
        testID="template-component-menu"
      >
        <ScrollView
          style={{ height: contentHeight }}
          modifiers={nativeFillWidth}
          testID="template-component-menu-scroll"
        >
          <Column
            spacing={spacing.lg}
            modifiers={nativeFillWidth}
            style={{ paddingBottom: spacing.lg }}
          >
            <Text variant="subtitle" testID="template-component-menu-title">
              {t('template.components')}
            </Text>
            <ComponentList
              items={componentCatalog}
              onSelect={onSelect}
              testIDPrefix="template-component-menu"
            />
            <ButtonContent
              variant="secondary"
              label={t('template.closeComponents')}
              onPress={onClose}
              testID="template-component-menu-close"
            />
          </Column>
        </ScrollView>
      </BottomSheet>
    </UniversalHost>
  );
}
