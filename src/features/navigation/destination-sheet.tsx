import { spacing } from '@/constants/layout';
import { useAppTheme } from '@/hooks/use-theme';
import {
  BottomSheet,
  Column,
  List,
  ListForEach,
  RNHostView,
  UniversalButtonContent,
  UniversalHost,
  UniversalTextContent,
  nativeFillWidth,
  useHostColorScheme,
} from '@components/ui';
import { useTranslation } from 'react-i18next';
import { View, useWindowDimensions } from 'react-native';
import { DestinationRow } from './destination-row';
import { sampleDestinations, type SampleDestination } from './sample-destinations';

function renderDestination({ item }: { item: SampleDestination }) {
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
  const { height, fontScale } = useWindowDimensions();
  const { design } = useAppTheme(useHostColorScheme());
  const contentHeight = Math.min(640, height * 0.72);
  const estimatedRowHeight =
    spacing.lg * 2 +
    spacing.md +
    spacing.xs * 3 +
    1 +
    fontScale *
      (design.typography.label.fontSize +
        design.typography.caption.fontSize * 3 +
        design.typography.subtitle.fontSize);

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
          {/* Give Yoga a height before native measurement so the list starts bounded. */}
          <View style={{ height: contentHeight }}>
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
            <UniversalHost matchContents={false} style={{ flex: 1 }}>
              <List testID="tab-destinations-list">
                <ListForEach
                  data={sampleDestinations}
                  keyExtractor={destinationKey}
                  estimatedItemSize={estimatedRowHeight}
                  overscanCount={2}
                >
                  {renderDestination}
                </ListForEach>
              </List>
            </UniversalHost>
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
