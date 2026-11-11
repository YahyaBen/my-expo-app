import { radii, spacing } from '@/constants/layout';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAppReducedMotion } from '@/hooks/use-motion-enabled';
import {
  ButtonContent,
  Column,
  EmptyState,
  RNHostView,
  SegmentedControl,
  UniversalTextContent as Text,
  nativeFillWidth,
} from '@components/ui';
import Constants from 'expo-constants';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, TurboModuleRegistry, View, useWindowDimensions } from 'react-native';
import type MapView from 'react-native-maps';

const sampleRegion = {
  latitude: 33.5731,
  longitude: -7.5898,
  latitudeDelta: 0.09,
  longitudeDelta: 0.09,
};

export function GoogleMapExamples({ width }: Readonly<{ width: number }>) {
  const { t } = useTranslation();
  const configured = Constants.expoConfig?.extra?.googleMaps?.[Platform.OS] === true;
  // react-native-maps 1.29 requires this module when its JS entry is evaluated.
  const nativeAvailable = TurboModuleRegistry.get('RNMapsAirModule') !== null;

  if (!configured || !nativeAvailable) {
    return (
      <EmptyState
        icon={{ ios: 'map', android: 'map' }}
        title={t('componentCatalog.googleMap.unavailable')}
        description={t('componentCatalog.googleMap.setupHint')}
        testID="component-google-map-unavailable"
      />
    );
  }

  return <GoogleMapPreview width={width} />;
}

function GoogleMapPreview({ width }: Readonly<{ width: number }>) {
  const maps: typeof import('react-native-maps') =
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Old native builds can show setup feedback without evaluating a missing module.
    require('react-native-maps');
  const { default: Map, Marker, PROVIDER_GOOGLE } = maps;
  const { t } = useTranslation();
  const scheme = useColorScheme();
  const reducedMotion = useAppReducedMotion();
  const { height } = useWindowDimensions();
  const map = useRef<MapView>(null);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [ready, setReady] = useState(false);

  return (
    <Column spacing={spacing.lg} modifiers={nativeFillWidth}>
      <SegmentedControl
        label={t('componentCatalog.googleMap.mapType')}
        selectedValue={mapType}
        onValueChange={(value) => {
          if (value === 'standard' || value === 'satellite') setMapType(value);
        }}
        options={[
          {
            value: 'standard',
            label: t('componentCatalog.googleMap.standard'),
            testID: 'component-google-map-standard',
          },
          {
            value: 'satellite',
            label: t('componentCatalog.googleMap.satellite'),
            testID: 'component-google-map-satellite',
          },
        ]}
      />
      <RNHostView matchContents>
        <View
          style={{
            width,
            height: Math.max(240, Math.min(420, height * 0.5)),
            borderRadius: radii.card,
            overflow: 'hidden',
          }}
        >
          <Map
            ref={map}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFill}
            initialRegion={sampleRegion}
            mapType={mapType}
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
        </View>
      </RNHostView>
      <Text variant="caption" tone="muted">
        {t('componentCatalog.googleMap.hint')}
      </Text>
      <ButtonContent
        variant="secondary"
        label={t('componentCatalog.googleMap.reset')}
        disabled={!ready}
        onPress={() => map.current?.animateToRegion(sampleRegion, reducedMotion ? 0 : 300)}
        testID="component-google-map-reset"
      />
    </Column>
  );
}
