import { FlashList, type ListRenderItemInfo } from '@shopify/flash-list';
import { useTranslation } from 'react-i18next';
import { Platform, View, useWindowDimensions } from 'react-native';
import {
  BottomSheet,
  Column,
  RNHostView,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent,
  nativeFillWidth,
} from '@components/ui';
import { spacing } from '@/constants/layout';
import {
  reportDestinationListLoad,
  reportDestinationViewability,
} from './destination-list-diagnostics';
import { DestinationRow } from './destination-row';
import { sampleDestinations, type SampleDestination } from './sample-destinations';

function renderDestination({ item }: ListRenderItemInfo<SampleDestination>) {
  return <DestinationRow destination={item} />;
}

function destinationKey(destination: SampleDestination) {
  return destination.id;
}

export function DestinationSheet({
  isPresented,
  onDismiss,
}: {
  isPresented: boolean;
  onDismiss: () => void;
}) {
  const { t } = useTranslation();
  const { height } = useWindowDimensions();
  const contentHeight = Math.min(640, height * 0.72);

  return (
    <UniversalHost inline ignoreSafeArea="all" style={{ position: 'absolute' }}>
      <BottomSheet
        isPresented={isPresented}
        onDismiss={onDismiss}
        contentHeight={contentHeight}
        testID="tab-center-action-sheet"
      >
        {/* The bounded native parent supplies the sheet's actual width, including on tablets. */}
        <RNHostView>
          <View style={{ flex: 1 }}>
            <UniversalHost>
              <Column
                spacing={spacing.xs}
                modifiers={nativeFillWidth}
                style={{ paddingBottom: spacing.md }}
              >
                <UniversalTextContent variant="title">
                  {t('destinations.title')}
                </UniversalTextContent>
                <UniversalTextContent tone="muted">
                  {t('destinations.subtitle', { count: sampleDestinations.length })}
                </UniversalTextContent>
              </Column>
            </UniversalHost>
            <FlashList
              data={sampleDestinations}
              renderItem={renderDestination}
              keyExtractor={destinationKey}
              style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: spacing.sm }}
              contentInsetAdjustmentBehavior="never"
              nestedScrollEnabled={Platform.OS === 'android'}
              onLoad={__DEV__ ? reportDestinationListLoad : undefined}
              onViewableItemsChanged={__DEV__ ? reportDestinationViewability : undefined}
              testID="tab-destinations-list"
            />
            <UniversalHost>
              <Column modifiers={nativeFillWidth} style={{ paddingVertical: spacing.md }}>
                <UniversalButtonContent
                  variant="secondary"
                  label={t('common.close')}
                  fullWidth
                  testID="tab-center-action-close"
                  onPress={onDismiss}
                />
              </Column>
            </UniversalHost>
          </View>
        </RNHostView>
      </BottomSheet>
    </UniversalHost>
  );
}
