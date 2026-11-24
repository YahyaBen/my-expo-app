import { PageScreen, PageSection, UniversalTextContent as Text } from '@components/ui';
import { openURL } from 'expo-linking';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  componentCatalog,
  componentCategories,
  componentHref,
  type ComponentId,
} from './component-catalog';
import { ComponentList } from './component-list';

const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=33.5731%2C-7.5898';

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

    if (componentId === 'google-map') {
      void openURL(googleMapsUrl).then(
        () => {
          navigating.current = false;
        },
        () => router.push(componentHref(componentId)),
      );
      return;
    }

    router.push(componentHref(componentId));
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
