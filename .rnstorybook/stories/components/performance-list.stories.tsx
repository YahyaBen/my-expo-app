import {
  Column,
  List,
  ListForEach,
  ScrollView,
  UniversalHost,
  UniversalTextContent,
  nativeFillWidth,
} from '@components/ui';
import { FlashList, type ListRenderItem } from '@shopify/flash-list';
import type { Meta, StoryObj } from '@storybook/react-native';
import { useCallback } from 'react';
import { View } from 'react-native';
import { spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme';

type Row = {
  id: string;
  title: string;
  detail: string;
  density: number;
};

type PerformanceListProps = {
  count: 24 | 200 | 1000;
  renderer: 'native-scroll' | 'flash-list' | 'native-list';
  colorScheme: 'light' | 'dark';
  layoutDirection: 'leftToRight' | 'rightToLeft';
};

const titles = ['Tomato salad', 'Pâtes aux légumes et aux herbes', 'سلطة الخضروات الطازجة'];
const details = [
  'A short deterministic row for the list baseline.',
  'Une description plus longue pour vérifier le retour à la ligne et la hauteur du contenu.',
  'وصف طويل لاختبار التفاف النص وارتفاع الصف مع دعم اتجاه الكتابة من اليمين إلى اليسار.',
];
const allRows: Row[] = Array.from({ length: 1000 }, (_, index) => ({
  id: `performance-row-${index + 1}`,
  title: `${index + 1}. ${titles[index % titles.length]}`,
  detail: Array.from({ length: [1, 3, 6][index % 3] }, () => details[index % details.length]).join(
    ' ',
  ),
  density: index % 3,
}));
const datasets = {
  24: allRows.slice(0, 24),
  200: allRows.slice(0, 200),
  1000: allRows,
};
const keyExtractor = (item: Row) => item.id;
const getItemType = (item: Row) => item.density;
const renderNativeItem = ({ item }: { item: Row }) => <PerformanceRow item={item} />;

/** Same native content in both renderers; only scroll/Host ownership differs. */
function PerformanceRow({ item }: Readonly<{ item: Row }>) {
  const colors = useThemeColors();
  return (
    <Column modifiers={nativeFillWidth} spacing={0} testID={item.id}>
      <Column modifiers={nativeFillWidth} spacing={spacing.xs} style={{ padding: spacing.lg }}>
        <UniversalTextContent variant="subtitle" testID={`${item.id}-title`}>
          {item.title}
        </UniversalTextContent>
        <UniversalTextContent tone="muted">{item.detail}</UniversalTextContent>
      </Column>
      <Column modifiers={nativeFillWidth} style={{ height: 1, backgroundColor: colors.divider }} />
    </Column>
  );
}

function PerformanceList({
  count,
  renderer,
  colorScheme,
  layoutDirection,
}: Readonly<PerformanceListProps>) {
  const colors = useThemeColors(colorScheme);
  const data = datasets[count];
  const renderItem = useCallback<ListRenderItem<Row>>(
    ({ item }) => (
      // Each recycled RN cell enters a native tree and needs its own intrinsic Host.
      <UniversalHost colorScheme={colorScheme} layoutDirection={layoutDirection}>
        <PerformanceRow item={item} />
      </UniversalHost>
    ),
    [colorScheme, layoutDirection],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }} testID="performance-list-fixture">
      <UniversalHost colorScheme={colorScheme} layoutDirection={layoutDirection}>
        <Column modifiers={nativeFillWidth} spacing={spacing.xs} style={{ padding: spacing.md }}>
          <UniversalTextContent variant="label" testID="performance-list-configuration">
            {`${renderer}: ${count} synthetic rows`}
          </UniversalTextContent>
          <UniversalTextContent tone="muted">
            Mixed heights and English, French, and Arabic text. Use system large text. This fixture
            establishes behavior; compare release builds for performance results.
          </UniversalTextContent>
        </Column>
      </UniversalHost>
      {renderer === 'native-scroll' ? (
        <UniversalHost
          colorScheme={colorScheme}
          layoutDirection={layoutDirection}
          matchContents={false}
          style={{ flex: 1 }}
        >
          <ScrollView testID="performance-list-native-scroll">
            <Column modifiers={nativeFillWidth} spacing={0}>
              {data.map((item) => (
                <PerformanceRow key={item.id} item={item} />
              ))}
            </Column>
          </ScrollView>
        </UniversalHost>
      ) : renderer === 'native-list' ? (
        <UniversalHost
          colorScheme={colorScheme}
          layoutDirection={layoutDirection}
          matchContents={false}
          style={{ flex: 1 }}
        >
          <List testID="performance-list-native-recycled">
            <ListForEach
              data={data}
              keyExtractor={keyExtractor}
              overscanCount={2}
              estimatedItemSize={160}
            >
              {renderNativeItem}
            </ListForEach>
          </List>
        </UniversalHost>
      ) : (
        <FlashList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemType={getItemType}
          testID="performance-list-flash-list"
          style={{ flex: 1 }}
        />
      )}
    </View>
  );
}

const meta = {
  title: 'Performance/Native Lists',
  component: PerformanceList,
  args: {
    count: 24,
    renderer: 'native-scroll',
    colorScheme: 'light',
    layoutDirection: 'leftToRight',
  },
  argTypes: {
    count: { control: 'radio', options: [24, 200, 1000] },
    renderer: { control: 'radio', options: ['native-scroll', 'flash-list', 'native-list'] },
    colorScheme: { control: 'radio', options: ['light', 'dark'] },
    layoutDirection: { control: 'radio', options: ['leftToRight', 'rightToLeft'] },
  },
} satisfies Meta<typeof PerformanceList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Native24: Story = {};
export const Native200: Story = { args: { count: 200 } };
export const Native1000: Story = { args: { count: 1000 } };
export const Recycled24: Story = { args: { renderer: 'flash-list' } };
export const Recycled200: Story = { args: { renderer: 'flash-list', count: 200 } };
export const Recycled1000: Story = { args: { renderer: 'flash-list', count: 1000 } };
export const RecycledRtl: Story = {
  args: { renderer: 'flash-list', count: 200, layoutDirection: 'rightToLeft' },
};
export const RecycledDark: Story = {
  args: { renderer: 'flash-list', count: 200, colorScheme: 'dark' },
};
export const NativeRecycled200: Story = { args: { renderer: 'native-list', count: 200 } };
export const NativeRecycled1000: Story = { args: { renderer: 'native-list', count: 1000 } };
export const NativeRecycledRtl: Story = {
  args: { renderer: 'native-list', count: 200, layoutDirection: 'rightToLeft' },
};
export const NativeRecycledDark: Story = {
  args: { renderer: 'native-list', count: 200, colorScheme: 'dark' },
};
