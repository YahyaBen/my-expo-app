import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  PageScreen,
  RNHostView,
  UniversalButtonContent,
  UniversalTextContent as Text,
} from '@components/ui';
import { radii, screenContentMaxWidth, spacing } from '@/constants/layout';
import { useAppActive } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import { DemoSection } from './demo-section';
import { isDeviceFeatureEnabled, useDevicePreferences } from '@/lib/device-preferences';
import { requestDeviceAccess } from '@/lib/device-permissions';

type MediaError =
  | 'permissionFailed'
  | 'cameraFailed'
  | 'captureFailed'
  | 'pickerFailed'
  | 'settingsFailed'
  | 'previewFailed';
type Photo = { uri: string; width: number; height: number };

export default function CameraScreen() {
  const { t } = useTranslation();
  const focused = useIsFocused();
  const active = useAppActive();
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const preferences = useDevicePreferences();
  const cameraEnabled = preferences.ready && preferences.enabled.camera;
  const photosEnabled = preferences.ready && preferences.enabled.photos;
  const previewWidth = Math.max(
    1,
    Math.min(screenContentMaxWidth, width - insets.left - insets.right) - spacing.lg * 2,
  );
  const previewHeight = Math.min(400, (previewWidth * 4) / 3);
  const [permission, , getPermission] = useCameraPermissions();
  const camera = useRef<CameraView>(null);
  const mounted = useRef(false);
  const busy = useRef(false);
  const session = useRef(0);
  const [facing, setFacing] = useState<CameraType>('back');
  const [cameraOpen, setCameraOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState<'camera' | 'capture' | 'picker' | null>(null);
  const [error, setError] = useState<MediaError | null>(null);
  const [photo, setPhoto] = useState<Photo | null>(null);
  const previewActive =
    focused &&
    active &&
    cameraEnabled &&
    cameraOpen &&
    permission?.granted &&
    !photo &&
    pending !== 'picker' &&
    error !== 'cameraFailed';
  const permissionBlocked = permission?.canAskAgain === false && !permission.granted;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (focused && active) {
      void getPermission().catch(() => {
        if (mounted.current) setError('permissionFailed');
      });
    }
  }, [active, focused, getPermission]);

  const attachCamera = useCallback((instance: CameraView | null) => {
    // A native preview detaches on blur, backgrounding, picker presentation or a lens change.
    camera.current = instance;
    session.current += 1;
    setReady(false);
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    let disposed = false;
    // Android can recreate the activity while the system photo picker is open.
    void ImagePicker.getPendingResultAsync()
      .then((result) => {
        if (disposed || !result || busy.current || !isDeviceFeatureEnabled('photos')) return;
        if ('code' in result) setError('pickerFailed');
        else if (!result.canceled && result.assets[0]) setPhoto(result.assets[0]);
      })
      .catch(() => {
        if (!disposed) setError('pickerFailed');
      });
    return () => {
      disposed = true;
    };
  }, []);

  async function openSettings() {
    try {
      await Linking.openSettings();
    } catch {
      if (mounted.current) setError('settingsFailed');
    }
  }

  async function openCamera() {
    if (busy.current || !cameraEnabled) return;
    busy.current = true;
    setPending('camera');
    setError(null);
    try {
      const granted = await requestDeviceAccess('camera');
      await getPermission();
      if (!mounted.current || !granted || !isDeviceFeatureEnabled('camera')) return;
      setReady(false);
      setPhoto(null);
      setCameraOpen(true);
    } catch {
      if (mounted.current) setError('permissionFailed');
    } finally {
      busy.current = false;
      if (mounted.current) setPending(null);
    }
  }

  async function takePhoto() {
    if (busy.current || !ready || !previewActive || !camera.current) return;
    busy.current = true;
    const currentSession = session.current;
    setPending('capture');
    setError(null);
    try {
      const result = await camera.current.takePictureAsync({ quality: 0.8 });
      if (mounted.current && session.current === currentSession) {
        setPhoto(result);
        setCameraOpen(false);
      }
    } catch {
      if (mounted.current && session.current === currentSession) setError('captureFailed');
    } finally {
      busy.current = false;
      if (mounted.current) setPending(null);
    }
  }

  async function pickPhoto() {
    if (busy.current || !photosEnabled) return;
    busy.current = true;
    setPending('picker');
    setReady(false);
    setError(null);
    try {
      // The system image picker grants access to the selected image without a broad library request.
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });
      if (
        mounted.current &&
        isDeviceFeatureEnabled('photos') &&
        !result.canceled &&
        result.assets[0]
      ) {
        setPhoto(result.assets[0]);
        setCameraOpen(false);
      }
    } catch {
      if (mounted.current) setError('pickerFailed');
    } finally {
      busy.current = false;
      if (mounted.current) setPending(null);
    }
  }

  return (
    <PageScreen title={t('media.title')} description={t('media.description')}>
      <DemoSection title={t('media.camera')} hint={t('media.cameraHint')}>
        {!cameraEnabled ? <Text tone="muted">{t('media.cameraDisabled')}</Text> : null}
        {permission && !permission.granted ? (
          <Text tone="muted" testID="demo-camera-permission-status">
            {t(permissionBlocked ? 'media.permissionBlocked' : 'media.permissionHint')}
          </Text>
        ) : null}
        {error ? (
          <Text tone="error" testID="demo-camera-error">
            {t(`media.${error}`)}
          </Text>
        ) : null}
        {previewActive || photo ? (
          <RNHostView matchContents>
            <View
              style={{
                width: previewWidth,
                height: previewHeight,
                borderRadius: radii.card,
                overflow: 'hidden',
                backgroundColor: colors.surfaceVariant,
              }}
            >
              {photo ? (
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: previewWidth, height: previewHeight }}
                  contentFit="contain"
                  accessibilityLabel={t('media.photoPreview')}
                  onError={() => setError('previewFailed')}
                  testID="demo-camera-photo"
                />
              ) : (
                <CameraView
                  key={facing}
                  ref={attachCamera}
                  style={{ flex: 1 }}
                  facing={facing}
                  mode="picture"
                  onCameraReady={() => setReady(true)}
                  onMountError={() => {
                    setReady(false);
                    setError('cameraFailed');
                  }}
                  accessibilityLabel={t('media.livePreview')}
                  testID="demo-camera-preview"
                />
              )}
            </View>
          </RNHostView>
        ) : null}
        {!cameraOpen || photo || !permission?.granted || error === 'cameraFailed' ? (
          <UniversalButtonContent
            variant="primary"
            label={t(permissionBlocked ? 'media.openSettings' : 'media.openCamera')}
            disabled={pending !== null || !cameraEnabled}
            onPress={() => void (permissionBlocked ? openSettings() : openCamera())}
            testID="demo-camera-open"
          />
        ) : (
          <>
            <UniversalButtonContent
              variant="primary"
              label={t(pending === 'capture' ? 'media.capturing' : 'media.takePhoto')}
              disabled={!ready || !previewActive || pending !== null}
              onPress={() => void takePhoto()}
              testID="demo-camera-capture"
            />
            <UniversalButtonContent
              variant="secondary"
              label={t('media.flipCamera')}
              disabled={pending !== null || !ready}
              onPress={() => {
                setReady(false);
                setFacing((current) => (current === 'back' ? 'front' : 'back'));
              }}
              testID="demo-camera-flip"
            />
            <UniversalButtonContent
              variant="link"
              label={t('media.closeCamera')}
              disabled={pending !== null}
              onPress={() => setCameraOpen(false)}
              testID="demo-camera-close"
            />
          </>
        )}
      </DemoSection>
      <DemoSection title={t('media.photoLibrary')} hint={t('media.photoHint')}>
        {!photosEnabled ? <Text tone="muted">{t('media.photosDisabled')}</Text> : null}
        <UniversalButtonContent
          variant="secondary"
          label={t(pending === 'picker' ? 'media.choosing' : 'media.choosePhoto')}
          disabled={pending !== null || !photosEnabled}
          onPress={() => void pickPhoto()}
          testID="demo-camera-pick-photo"
        />
        {photo ? (
          <>
            <Text testID="demo-camera-photo-size">
              {t('media.photoSize', { width: photo.width, height: photo.height })}
            </Text>
            <UniversalButtonContent
              variant="link"
              label={t('common.clear')}
              disabled={pending !== null}
              onPress={() => {
                setPhoto(null);
                setError(null);
              }}
              testID="demo-camera-clear"
            />
          </>
        ) : null}
      </DemoSection>
    </PageScreen>
  );
}
