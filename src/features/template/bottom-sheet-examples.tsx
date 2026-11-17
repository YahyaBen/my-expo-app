import { getAppBrand } from '@/config/brand';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';
import {
  BottomSheet,
  BottomSheetBanner,
  ButtonContent,
  Chip,
  Column,
  Icon,
  Popover,
  Row,
  ScrollView,
  Switch,
  UniversalTextContent as Text,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
} from '@components/ui';
import { useIsFocused } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const sheets = ['basic', 'promo', 'place', 'improvements'] as const;
type Sheet = (typeof sheets)[number];

/** Each presenter retains its content while native dismissal finishes. */
export function BottomSheetExamples() {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const colors = useThemeColors(useHostColorScheme());
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const height = Math.max(1, Math.min(680, (window.height - insets.top - insets.bottom) * 0.78));
  const [active, setActive] = useState<Sheet | null>(null);
  const [dismissible, setDismissible] = useState(true);
  const [overflow, setOverflow] = useState(false);
  const [saved, setSaved] = useState(false);
  const [count, setCount] = useState(0);
  const label = (key: string) => t(`componentCatalog.sheets.${key}`);
  const onAction = () => setCount((current) => current + 1);

  function open(sheet: Sheet) {
    setOverflow(false);
    setActive(sheet);
  }

  function close(sheet: Sheet) {
    setActive((current) => (current === sheet ? null : current));
    if (sheet === 'place') setOverflow(false);
  }

  function toggleSaved() {
    setSaved((current) => !current);
    setOverflow(false);
    onAction();
  }

  function closeButton(sheet: Sheet) {
    return (
      <ButtonContent
        variant="tertiary"
        circular
        size="sm"
        accessibilityLabel={t('common.close')}
        onPress={() => close(sheet)}
        testID={`component-bottom-sheet-${sheet}-close`}
      >
        <Icon name={{ ios: 'xmark', android: 'close' }} />
      </ButtonContent>
    );
  }

  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <Text tone="muted">{label('hint')}</Text>
      <Switch
        value={dismissible}
        onValueChange={setDismissible}
        label={label('dismissible')}
        testID="component-bottom-sheet-dismissible"
      />
      {sheets.map((sheet) => (
        <ButtonContent
          key={sheet}
          variant={sheet === 'basic' ? 'primary' : 'secondary'}
          label={sheet === 'improvements' ? t('updates.improvements') : label(sheet)}
          fullWidth
          onPress={() => open(sheet)}
          testID={
            sheet === 'basic'
              ? 'component-bottom-sheet-trigger'
              : `component-bottom-sheet-${sheet}-trigger`
          }
        />
      ))}
      <Text testID="component-bottom-sheet-action-count">
        {t('componentCatalog.sheets.actionCount', { count })}
      </Text>

      <BottomSheet
        isPresented={active === 'basic'}
        onDismiss={() => close('basic')}
        dismissible={dismissible}
        testID="component-bottom-sheet"
      >
        <Column
          spacing={spacing.lg}
          modifiers={nativeFillWidth}
          style={{ paddingBottom: spacing.lg }}
        >
          <Text variant="title">{label('basic')}</Text>
          <Text>{label('hint')}</Text>
          <ButtonContent
            variant="secondary"
            label={t('common.close')}
            onPress={() => close('basic')}
            testID="component-bottom-sheet-basic-close"
          />
        </Column>
      </BottomSheet>

      <BottomSheet
        isPresented={active === 'promo'}
        onDismiss={() => close('promo')}
        dismissible={dismissible}
        contentHeight={height}
        scrollable
        testID="component-bottom-sheet-promo"
        banner={
          <BottomSheetBanner
            animate={active === 'promo' && focused}
            testID="component-bottom-sheet-banner"
          >
            <Icon
              name={{ ios: 'sparkles', android: 'auto_awesome' }}
              size={160}
              color={colors.tint}
            />
          </BottomSheetBanner>
        }
        header={
          <Row spacing={spacing.md} modifiers={nativeFillWidth}>
            <Column spacing={spacing.sm} modifiers={nativeRowWeight}>
              <Text variant="title">{label('promoTitle')}</Text>
              <Text tone="muted">{label('promoDescription')}</Text>
            </Column>
            {closeButton('promo')}
          </Row>
        }
        footer={
          <ButtonContent
            variant="primary"
            label={label('promoAction')}
            fullWidth
            onPress={() => {
              onAction();
              close('promo');
            }}
            testID="component-bottom-sheet-promo-action"
          />
        }
      >
        <Column spacing={spacing.xl} modifiers={nativeFillWidth}>
          {(['Profile', 'Emoji', 'Upload'] as const).map((benefit) => (
            <Row key={benefit} spacing={spacing.md} modifiers={nativeFillWidth}>
              <Icon
                name={{ ios: 'checkmark.circle.fill', android: 'check_circle' }}
                color={colors.tint}
              />
              <Column spacing={spacing.xs} modifiers={nativeRowWeight}>
                <Text variant="subtitle">{label(`benefit${benefit}`)}</Text>
                <Text tone="muted">{label(`benefit${benefit}Hint`)}</Text>
              </Column>
            </Row>
          ))}
        </Column>
      </BottomSheet>

      <BottomSheet
        isPresented={active === 'place'}
        onDismiss={() => close('place')}
        dismissible={dismissible}
        contentHeight={height}
        scrollable
        testID="component-bottom-sheet-place"
        header={
          <Row spacing={spacing.sm} modifiers={nativeFillWidth}>
            <Column spacing={spacing.xs} modifiers={nativeRowWeight}>
              <Text variant="title">{label('placeTitle')}</Text>
              <Text tone="muted">{label('placeDescription')}</Text>
            </Column>
            <Popover
              isPresented={overflow}
              onIsPresentedChange={setOverflow}
              testID="component-bottom-sheet-overflow"
              trigger={
                <ButtonContent
                  variant="tertiary"
                  circular
                  size="sm"
                  accessibilityLabel={label('more')}
                  onPress={() => setOverflow(true)}
                  testID="component-bottom-sheet-overflow-trigger"
                >
                  <Icon name={{ ios: 'ellipsis', android: 'more_horiz' }} />
                </ButtonContent>
              }
            >
              <Column
                spacing={spacing.sm}
                style={{
                  padding: spacing.md,
                  width: Math.max(1, Math.min(240, window.width - insets.left - insets.right - 64)),
                }}
              >
                <ButtonContent
                  variant="tertiary"
                  label={label(saved ? 'saved' : 'save')}
                  onPress={toggleSaved}
                  testID="component-bottom-sheet-overflow-save"
                />
                <ButtonContent
                  variant="tertiary"
                  label={label('share')}
                  onPress={() => {
                    onAction();
                    setOverflow(false);
                  }}
                  testID="component-bottom-sheet-overflow-share"
                />
              </Column>
            </Popover>
            {closeButton('place')}
          </Row>
        }
        actions={
          <ScrollView
            direction="horizontal"
            modifiers={nativeFillWidth}
            testID="component-bottom-sheet-chip-rail"
          >
            <Row spacing={spacing.sm} alignment="center">
              {(['directions', 'start', 'share'] as const).map((action) => (
                <Chip
                  key={action}
                  label={label(action)}
                  onPress={onAction}
                  testID={`component-bottom-sheet-chip-${action}`}
                />
              ))}
              <Chip
                variant="filter"
                label={label(saved ? 'saved' : 'save')}
                selected={saved}
                onPress={toggleSaved}
                testID="component-bottom-sheet-chip-save"
              />
            </Row>
          </ScrollView>
        }
        footer={
          <ButtonContent
            variant="primary"
            label={label('finalAction')}
            fullWidth
            onPress={() => {
              onAction();
              close('place');
            }}
            testID="component-bottom-sheet-final-action"
          />
        }
      >
        <Column spacing={spacing.xl} modifiers={nativeFillWidth}>
          {Array.from({ length: 8 }, (_, index) => (
            <Column key={index} spacing={spacing.sm} modifiers={nativeFillWidth}>
              <Text variant="subtitle">{`${label('details')} ${index + 1}`}</Text>
              <Text tone="muted">{label('detailsHint')}</Text>
            </Column>
          ))}
        </Column>
      </BottomSheet>

      <BottomSheet
        isPresented={active === 'improvements'}
        onDismiss={() => close('improvements')}
        dismissible={false}
        contentHeight={height}
        scrollable
        testID="component-bottom-sheet-improvements"
        banner={
          <BottomSheetBanner
            animate={active === 'improvements' && focused}
            testID="component-bottom-sheet-improvements-banner"
          >
            <Icon
              name={{ ios: 'sparkles', android: 'auto_awesome' }}
              size={160}
              color={colors.tint}
            />
          </BottomSheetBanner>
        }
        header={
          <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
            <Text variant="title">{t('updates.improvementsReady')}</Text>
            <Text tone="muted">{t('updates.description', { appName: getAppBrand().name })}</Text>
          </Column>
        }
        footer={
          <ButtonContent
            variant="primary"
            label={label('finalAction')}
            fullWidth
            onPress={() => {
              onAction();
              close('improvements');
            }}
            testID="component-bottom-sheet-improvements-action"
          />
        }
      >
        <Column spacing={spacing.md} modifiers={nativeFillWidth}>
          <Text>{t('updates.downloadHint')}</Text>
          <Text tone="muted">{label('hint')}</Text>
        </Column>
      </BottomSheet>
    </Column>
  );
}
