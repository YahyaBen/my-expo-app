import { CircularCarousel, Column, UniversalHost, UniversalTextContent } from '@components/ui';
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { screenContentMaxWidth, spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import { componentCatalog, type ComponentId } from './component-catalog';

/** Transient navigation artwork; the dock remains its own native touch owner. */
export function ComponentMenu({
  onClose,
  onNavigate,
}: Readonly<{
  onClose: () => void;
  onNavigate: (id: ComponentId) => void;
}>) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const width = Math.min(
    screenContentMaxWidth,
    window.width - insets.left - insets.right - spacing.xl * 2,
  );
  const height = Math.max(140, Math.min(220, window.height - insets.top - insets.bottom - 180));
  const namePopover = useRef<ComponentNamePopoverHandle>(null);
  const items = componentCatalog.map((item) => ({
    ...item,
    label: t(`componentCatalog.names.${item.id}`),
  }));

  function showPageName(_index: number, item: { id: ComponentId }) {
    namePopover.current?.show(item.id);
  }

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => listener.remove();
  }, [onClose]);

  return (
    <View
      pointerEvents="box-none"
      style={{ position: 'absolute', inset: 0 }}
      onAccessibilityEscape={onClose}
      testID="template-component-menu"
    >
      <View
        style={{ position: 'absolute', inset: 0, backgroundColor: colors.overlay }}
        accessible
        accessibilityRole="button"
        accessibilityLabel={t('template.closeComponents')}
        onAccessibilityTap={onClose}
        onStartShouldSetResponder={() => true}
        onResponderRelease={onClose}
        testID="template-component-backdrop"
      />
      <View
        style={{
          position: 'absolute',
          bottom: 84 + insets.bottom + spacing.sm,
          left: insets.left + spacing.xl,
          right: insets.right + spacing.xl,
          alignItems: 'center',
        }}
        pointerEvents="box-none"
      >
        <View pointerEvents="box-none" style={{ width, height: height + 56 }}>
          <UniversalHost viewportHeight={height} style={{ width }} ignoreSafeArea="all">
            <CircularCarousel
              items={items}
              width={width}
              height={height}
              itemSize={Math.max(64, Math.min(92, width / 3.5))}
              accessibilityLabel={t('template.components')}
              onPreviewIndexChange={showPageName}
              onIndexChange={showPageName}
              onSelectionSettled={showPageName}
              onItemPress={(_, item) => onNavigate(item.id)}
              testID="template-component-carousel"
            />
          </UniversalHost>
          <ComponentNamePopover ref={namePopover} width={width} />
        </View>
      </View>
    </View>
  );
}

type ComponentNamePopoverHandle = { show: (id: ComponentId) => void };

/** Keep the native name panel mounted; its updates do not rebuild the carousel. */
function ComponentNamePopover({
  ref,
  width,
}: Readonly<{ ref: Ref<ComponentNamePopoverHandle>; width: number }>) {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const [selectedId, setSelectedId] = useState<ComponentId>();
  useImperativeHandle(ref, () => ({ show: setSelectedId }), []);

  return (
    <View
      pointerEvents="none"
      accessibilityLiveRegion={selectedId ? 'polite' : 'none'}
      accessibilityElementsHidden={!selectedId}
      importantForAccessibility={selectedId ? 'auto' : 'no-hide-descendants'}
      style={{
        position: 'absolute',
        bottom: 0,
        alignSelf: 'center',
        maxWidth: width,
        opacity: selectedId ? 1 : 0,
      }}
      testID="template-component-name-popover"
    >
      <UniversalHost inline>
        <Column
          alignment="center"
          style={{
            width: Math.min(240, width),
            padding: spacing.md,
            borderRadius: 12,
            backgroundColor: colors.surfaceRaised,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <UniversalTextContent variant="label">
            {t(`componentCatalog.names.${selectedId ?? componentCatalog[0].id}`)}
          </UniversalTextContent>
        </Column>
      </UniversalHost>
    </View>
  );
}
