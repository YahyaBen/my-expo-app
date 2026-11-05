import {
  BottomSheet,
  ButtonContent,
  Column,
  Icon,
  ListItem,
  ScrollView,
  UniversalHost,
  UniversalTextContent,
  nativeFillWidth,
} from '@components/ui';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { componentCatalog, type ComponentId } from './component-catalog';

/** Keep the native presenter mounted while the component menu opens and dismisses. */
export function ComponentMenu({
  isPresented,
  onClose,
  onNavigate,
}: Readonly<{
  isPresented: boolean;
  onClose: () => void;
  onNavigate: (id: ComponentId) => void;
}>) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const { height } = useWindowDimensions();
  const contentHeight = Math.min(560, height * 0.65);

  return (
    <UniversalHost
      matchContents={false}
      ignoreSafeArea="all"
      pointerEvents="box-none"
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
            style={{ paddingVertical: spacing.lg }}
          >
            <UniversalTextContent variant="title">{t('template.components')}</UniversalTextContent>
            <Column spacing={0} modifiers={nativeFillWidth}>
              {componentCatalog.map(({ id, icon }) => (
                <ListItem
                  key={id}
                  colors={{ containerColor: colors.surface, contentColor: colors.text }}
                  leading={<Icon name={icon} />}
                  onPress={() => onNavigate(id)}
                  testID={`template-component-menu-${id}`}
                >
                  {t(`componentCatalog.names.${id}`)}
                </ListItem>
              ))}
            </Column>
            <ButtonContent
              variant="secondary"
              label={t('template.closeComponents')}
              fullWidth
              onPress={onClose}
              testID="template-component-menu-close"
            />
          </Column>
        </ScrollView>
      </BottomSheet>
    </UniversalHost>
  );
}
