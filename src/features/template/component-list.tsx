import { spacing } from '@/constants/layout';
import { Column, Icon, ListItem, Text, nativeFillWidth } from '@components/ui';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import type { componentCatalog, ComponentId } from './component-catalog';

// Padding the label gives the plain SwiftUI button a taller, fully tappable row.
const labelStyle = Platform.OS === 'ios' ? { paddingVertical: spacing.md } : undefined;

export function ComponentList({
  items,
  onSelect,
  testIDPrefix,
}: Readonly<{
  items: Readonly<typeof componentCatalog>;
  onSelect: (id: ComponentId) => void;
  testIDPrefix: string;
}>) {
  const { t } = useTranslation();

  return (
    <Column spacing={0} modifiers={nativeFillWidth}>
      {items.map(({ id, icon }) => (
        <ListItem
          key={id}
          leading={<Icon name={icon} />}
          supportingText={t(`componentCatalog.descriptions.${id}`)}
          onPress={() => onSelect(id)}
          testID={`${testIDPrefix}-${id}`}
        >
          <Text style={labelStyle}>{t(`componentCatalog.names.${id}`)}</Text>
        </ListItem>
      ))}
    </Column>
  );
}
