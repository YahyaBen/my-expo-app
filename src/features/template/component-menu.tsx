import {
  BottomSheet,
  Column,
  EmptyState,
  UniversalHost,
  UniversalTextContent as Text,
} from '@components/ui';
import { useTranslation } from 'react-i18next';

/** Keep the native presenter mounted while the component menu opens and dismisses. */
export function ComponentMenu({
  isPresented,
  onClose,
}: Readonly<{
  isPresented: boolean;
  onClose: () => void;
}>) {
  const { t } = useTranslation();

  return (
    <UniversalHost
      matchContents={false}
      ignoreSafeArea="all"
      pointerEvents="none"
      style={{ position: 'absolute', inset: 0 }}
    >
      <BottomSheet isPresented={isPresented} onDismiss={onClose} testID="template-component-menu">
        <Column>
          <Text variant="subtitle" testID="template-component-menu-title">
            {t('template.components')}
          </Text>
          <EmptyState
            title={t('template.noComponents')}
            secondaryAction={{
              label: t('template.closeComponents'),
              onPress: onClose,
              testID: 'template-component-menu-close',
            }}
            testID="template-component-menu-empty"
          />
        </Column>
      </BottomSheet>
    </UniversalHost>
  );
}
