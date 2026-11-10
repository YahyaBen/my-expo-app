import { PageScreen, PageSection, UniversalTextContent as Text } from '@components/ui';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { componentCatalog, componentCategories, type ComponentId } from './component-catalog';
import { ComponentList } from './component-list';

export default function ComponentCategoryScreen({ id }: Readonly<{ id?: string }>) {
  const { t } = useTranslation();
  const navigating = useRef(false);
  useFocusEffect(
    useCallback(() => {
      navigating.current = false;
    }, []),
  );
  const category = componentCategories.find((item) => item.id === id);
  if (!category) {
    return (
      <PageScreen title={t('template.components')}>
        <PageSection>
          <Text>{t('recovery.notFoundDescription')}</Text>
        </PageSection>
      </PageScreen>
    );
  }

  function navigateToComponent(componentId: ComponentId) {
    if (navigating.current) return;
    navigating.current = true;
    router.push({ pathname: '/components/[id]', params: { id: componentId } });
  }

  return (
    <PageScreen
      title={t(`componentCatalog.categories.${category.id}`)}
      description={t(`componentCatalog.categoryDescriptions.${category.id}`)}
    >
      <PageSection testID={`component-category-${category.id}`}>
        <Text variant="caption" tone="muted">
          {t('componentCatalog.categoryCount', { count: category.components.length })}
        </Text>
        <ComponentList
          items={componentCatalog.filter((item) => item.category === category.id)}
          onSelect={navigateToComponent}
          testIDPrefix="template-component"
        />
      </PageSection>
    </PageScreen>
  );
}
