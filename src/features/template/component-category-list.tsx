import { Column, Icon, ListItem, Text, nativeFillWidth } from '@components/ui';
import { useTranslation } from 'react-i18next';
import { Platform } from 'react-native';
import { spacing } from '@/constants/layout';
import { componentCategories, type ComponentCategoryId } from './component-catalog';

const labelStyle = Platform.OS === 'ios' ? { paddingVertical: spacing.md } : undefined;

export function ComponentCategoryList({
  onSelect,
}: Readonly<{ onSelect: (id: ComponentCategoryId) => void }>) {
  const { t } = useTranslation();
  return (
    <Column spacing={0} modifiers={nativeFillWidth}>
      {componentCategories.map(({ id, icon }) => (
        <ListItem
          key={id}
          leading={<Icon name={icon} />}
          supportingText={t(`componentCatalog.categoryDescriptions.${id}`)}
          onPress={() => onSelect(id)}
          testID={`template-component-category-${id}`}
        >
          <Text style={labelStyle}>{t(`componentCatalog.categories.${id}`)}</Text>
        </ListItem>
      ))}
    </Column>
  );
}
