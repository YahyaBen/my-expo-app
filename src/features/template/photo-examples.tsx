import { spacing } from '@/constants/layout';
import { isDeviceFeatureEnabled, useDevicePreferences } from '@/lib/device-preferences';
import { requestDeviceAccess } from '@/lib/device-permissions';
import {
  ButtonContent,
  CircularCarousel,
  Column,
  IosHomeGrid,
  PageSection,
  Picker,
  StackedCarousel,
  StoryList,
  UniversalTextContent as Text,
  nativeFillWidth,
  type PhotoItem,
} from '@components/ui';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';

const layouts = ['circular-carousel', 'stacked-carousel', 'story-list', 'ios-home-grid'] as const;
export type PhotoLayout = (typeof layouts)[number];
type Photo = Omit<PhotoItem, 'label'>;
type PhotoError = 'permissionFailed' | 'permissionBlocked' | 'captureFailed' | 'pickerFailed';

const sampleSources: readonly Photo['source'][] = [
  require('@assets/images/photo-examples/alpine-lake.jpg'),
  require('@assets/images/photo-examples/desert-arch.jpg'),
  require('@assets/images/photo-examples/forest-waterfall.jpg'),
  require('@assets/images/photo-examples/coastal-village.jpg'),
  require('@assets/images/photo-examples/lavender-field.jpg'),
  require('@assets/images/photo-examples/atlantic-lighthouse.jpg'),
];

function pickSamplePhotos(): Photo[] {
  const available = sampleSources.map((source, index) => ({ id: `sample-${index}`, source }));
  return Array.from({ length: 5 }, () => {
    const index = Math.floor(Math.random() * available.length);
    return available.splice(index, 1)[0];
  });
}

/** One local collection survives layout changes; native camera/picker UI owns its lifecycle. */
export function PhotoExamples({
  initialLayout,
  width,
}: Readonly<{ initialLayout: PhotoLayout; width: number }>) {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const preferences = useDevicePreferences();
  const cameraEnabled = preferences.ready && preferences.enabled.camera;
  const photosEnabled = preferences.ready && preferences.enabled.photos;
  const [layout, setLayout] = useState(initialLayout);
  const [samplePhotos] = useState(pickSamplePhotos);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [pending, setPending] = useState<'camera' | 'photos' | null>(null);
  const [recovering, setRecovering] = useState(Platform.OS === 'android');
  const [error, setError] = useState<PhotoError | null>(null);
  const mounted = useRef(false);
  const busy = useRef(false);
  const nextId = useRef(0);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android' || !focused || !preferences.ready) return;
    let disposed = false;
    // Recover the current native result if Android recreated the activity during capture/picking.
    void ImagePicker.getPendingResultAsync()
      .then((result) => {
        if (disposed || busy.current || !result) return;
        // A recovered result has no origin; honor both saved opt-outs in that case.
        if (!isDeviceFeatureEnabled('camera') || !isDeviceFeatureEnabled('photos')) return;
        if ('code' in result) setError('pickerFailed');
        else if (!result.canceled) {
          const recovered = result.assets.map(({ uri }) => ({
            id: `photo-${++nextId.current}`,
            source: { uri },
          }));
          setPhotos((current) => [...recovered, ...current]);
        }
      })
      .catch(() => {
        if (!disposed) setError('pickerFailed');
      })
      .finally(() => {
        if (!disposed) setRecovering(false);
      });
    return () => {
      disposed = true;
    };
  }, [focused, preferences.ready]);

  async function addPhotos(origin: 'camera' | 'photos') {
    if (busy.current || recovering || !focused || !isDeviceFeatureEnabled(origin)) return;
    busy.current = true;
    setPending(origin);
    setError(null);
    let failure: PhotoError = 'permissionFailed';
    try {
      if (origin === 'camera') {
        const granted = await requestDeviceAccess('camera');
        if (!mounted.current || !isDeviceFeatureEnabled('camera')) return;
        if (!granted) {
          setError('permissionBlocked');
          return;
        }
      }
      failure = origin === 'camera' ? 'captureFailed' : 'pickerFailed';
      const result =
        origin === 'camera'
          ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsMultipleSelection: true,
              quality: 1,
            });
      if (!mounted.current || !isDeviceFeatureEnabled(origin) || result.canceled) return;
      const added = result.assets.map(({ uri }) => ({
        id: `photo-${++nextId.current}`,
        source: { uri },
      }));
      setPhotos((current) => [...added, ...current]);
    } catch {
      if (mounted.current) setError(failure);
    } finally {
      busy.current = false;
      if (mounted.current) setPending(null);
    }
  }

  const items: PhotoItem[] = (photos.length > 0 ? photos : samplePhotos).map((photo, index) => ({
    ...photo,
    label: t('showcase.homeGridPhoto', { number: index + 1 }),
  }));
  const title = t(`componentCatalog.names.${layout}`);
  const positionLabel = (index: number, total: number) =>
    t('showcase.storyListPosition', { number: index + 1, total });
  const disabled = pending !== null || recovering || !focused;

  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth} testID="component-photo-examples">
      <PageSection style={{ paddingVertical: 0 }}>
        <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
          <Text variant="subtitle">{t('media.photoLayout')}</Text>
          <Picker selectedValue={layout} onValueChange={setLayout} testID="component-photo-layout">
            {layouts.map((value) => (
              <Picker.Item key={value} value={value} label={t(`componentCatalog.names.${value}`)} />
            ))}
          </Picker>
        </Column>
        {!cameraEnabled && preferences.ready ? (
          <Text tone="muted">{t('media.cameraDisabled')}</Text>
        ) : null}
        <ButtonContent
          variant="primary"
          label={t(pending === 'camera' ? 'media.capturing' : 'media.takePhoto')}
          disabled={disabled || !cameraEnabled}
          onPress={() => void addPhotos('camera')}
          testID="component-photo-capture"
        />
        {!photosEnabled && preferences.ready ? (
          <Text tone="muted">{t('media.photosDisabled')}</Text>
        ) : null}
        <ButtonContent
          variant="secondary"
          label={t(pending === 'photos' ? 'media.choosing' : 'media.choosePhotos')}
          disabled={disabled || !photosEnabled}
          onPress={() => void addPhotos('photos')}
          testID="component-photo-pick"
        />
        {error ? (
          <Text tone="error" testID="component-photo-error">
            {t(`media.${error}`)}
          </Text>
        ) : null}
        <Text variant="caption" tone="muted" testID="component-photo-count">
          {t('media.photoCount', { count: items.length })}
        </Text>
      </PageSection>
      {layout === 'circular-carousel' ? (
        <CircularCarousel
          items={items}
          width={width}
          accessibilityLabel={title}
          getPositionLabel={positionLabel}
          testID="component-circular-carousel"
        />
      ) : layout === 'stacked-carousel' ? (
        <StackedCarousel
          items={items}
          width={width}
          accessibilityLabel={title}
          getPositionLabel={positionLabel}
          testID="component-stacked-carousel"
        />
      ) : layout === 'story-list' ? (
        <StoryList
          items={items}
          width={width}
          accessibilityLabel={title}
          getPositionLabel={positionLabel}
          testID="component-story-list"
        />
      ) : (
        <PageSection style={{ paddingVertical: 0 }}>
          <IosHomeGrid
            items={items}
            width={Math.max(1, width - spacing.lg * 2)}
            closeLabel={t('common.close')}
            showLabels={false}
            dismissHint={t('showcase.homeGridDismiss')}
            testID="component-ios-home-grid"
          />
        </PageSection>
      )}
      {photos.length > 0 && (
        <PageSection style={{ paddingVertical: 0 }}>
          <ButtonContent
            variant="tertiary"
            label={t('common.clear')}
            disabled={disabled}
            onPress={() => {
              setPhotos([]);
              setError(null);
            }}
            testID="component-photo-clear"
          />
        </PageSection>
      )}
    </Column>
  );
}
