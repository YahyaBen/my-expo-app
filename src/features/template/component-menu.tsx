import { BottomSheet, EmptyState, UniversalHost } from '@components/ui';
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
        <EmptyState
          title={t('template.noComponents')}
          testID="template-component-menu-empty"
          titleTestID="template-component-menu-title"
          secondaryAction={{
            label: t('template.closeComponents'),
            onPress: onClose,
            testID: 'template-component-menu-close',
          }}
        />
      </BottomSheet>
    </UniversalHost>
  );
}
