import { radii, spacing } from '@/constants/layout';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import { useThemeColors } from '@/hooks/use-theme';
import {
  ButtonContent,
  Chip,
  Column,
  EmptyState,
  PageFrame,
  PageScreen,
  PageSection,
  Row,
  SnapshotReveal,
  UniversalHost,
  UniversalTextContent as Text,
  nativeFillWidth,
  usePageHeaderInset,
} from '@components/ui';
import Constants from 'expo-constants';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TurboModuleRegistry, View } from 'react-native';
import type MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMapTypeTransition } from './use-map-type-transition';

const sampleRegion = {
  latitude: 33.5731,
  longitude: -7.5898,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};

export function GoogleMapExamples({
  title,
  onBack,
}: Readonly<{ title: string; onBack: () => void }>) {
  const { t } = useTranslation();
  const configured = Constants.expoConfig?.extra?.googleMaps?.[Platform.OS] === true;
  // react-native-maps 1.29 requires this module when its JS entry is evaluated.
  const nativeAvailable = TurboModuleRegistry.get('RNMapsAirModule') !== null;

  if (!configured || !nativeAvailable) {
    return (
      <PageScreen title={title} onBack={onBack}>
        <PageSection testID="component-page-google-map">
          <EmptyState
            icon={{ ios: 'map', android: 'map' }}
            title={t('componentCatalog.googleMap.unavailable')}
            description={t('componentCatalog.googleMap.setupHint')}
            testID="component-google-map-unavailable"
          />
        </PageSection>
      </PageScreen>
    );
  }

  return (
    // Keep the map behind the blurred header; its controls use the measured clearance.
    <PageFrame title={title} onBack={onBack} headerMode="scroll">
      <GoogleMapPreview />
    </PageFrame>
  );
}

function GoogleMapPreview() {
  const maps: typeof import('react-native-maps') =
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Old native builds can show setup feedback without evaluating a missing module.
    require('react-native-maps');
  const { default: Map, Marker, PROVIDER_GOOGLE } = maps;
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const colors = useThemeColors(scheme);
  const reducedMotion = useAppReducedMotion();
  const insets = useSafeAreaInsets();
  const headerInset = usePageHeaderInset();
  const map = useRef<MapView>(null);
  const [ready, setReady] = useState(false);
  const [controlsHeight, setControlsHeight] = useState(0);
  const transition = useMapTypeTransition(
    map,
    ready,
    insets.bottom + spacing.lg + controlsHeight / 2,
  );

  return (
    <View style={{ flex: 1 }} onLayout={transition.onLayout} testID="component-page-google-map">
      <Map
        ref={map}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={sampleRegion}
        mapType={transition.mapType}
        pointerEvents={transition.busy ? 'none' : 'auto'}
        mapPadding={{
          top: headerInset + spacing.sm,
          bottom: insets.bottom + controlsHeight + spacing.lg * 2,
          left: insets.left + spacing.lg,
          right: insets.right + spacing.lg,
        }}
        paddingAdjustmentBehavior="never"
        userInterfaceStyle={scheme}
        loadingEnabled
        toolbarEnabled={false}
        onMapReady={() => setReady(true)}
        accessibilityLabel={t('componentCatalog.googleMap.accessibilityLabel')}
        testID="component-google-map"
      >
        <Marker
          coordinate={sampleRegion}
          title={t('componentCatalog.googleMap.place')}
          description={t('componentCatalog.googleMap.markerHint')}
          testID="component-google-map-marker"
        />
      </Map>
      {transition.reveal ? (
        <SnapshotReveal
          reveal={transition.reveal}
          image={transition.image}
          onCovered={transition.applyPending}
          onComplete={transition.finish}
          testID="component-google-map-type-reveal"
        />
      ) : null}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: insets.left + spacing.lg,
          right: insets.right + spacing.lg,
          bottom: insets.bottom + spacing.lg,
          alignItems: 'center',
        }}
      >
        <UniversalHost
          ignoreSafeArea="all"
          onLayout={({ nativeEvent }) => setControlsHeight(nativeEvent.layout.height)}
          style={{ maxWidth: 480, borderRadius: radii.card, backgroundColor: colors.background }}
        >
          <Column spacing={spacing.md} modifiers={nativeFillWidth} style={{ padding: spacing.md }}>
            <Row spacing={spacing.sm}>
              <Chip
                variant="filter"
                appearance="filled"
                label={t('componentCatalog.googleMap.standard')}
                selected={transition.mapType === 'standard'}
                disabled={!ready || transition.busy}
                onPress={() => void transition.selectMapType('standard')}
                testID="component-google-map-standard"
              />
              <Chip
                variant="filter"
                appearance="filled"
                label={t('componentCatalog.googleMap.satellite')}
                selected={transition.mapType === 'satellite'}
                disabled={!ready || transition.busy}
                onPress={() => void transition.selectMapType('satellite')}
                testID="component-google-map-satellite"
              />
            </Row>
            <Text variant="caption" tone="muted">
              {t('componentCatalog.googleMap.hint')}
            </Text>
            <ButtonContent
              variant="secondary"
              label={t('componentCatalog.googleMap.reset')}
              disabled={!ready || transition.busy}
              onPress={() => map.current?.animateToRegion(sampleRegion, reducedMotion ? 0 : 300)}
              testID="component-google-map-reset"
            />
          </Column>
        </UniversalHost>
      </View>
    </View>
  );
}
