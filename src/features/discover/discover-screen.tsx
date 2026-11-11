import { spacing } from '@/constants/layout';
import {
  Badge,
  ButtonContent,
  Column,
  Icon,
  PageScreen,
  PageSection,
  Row,
  UniversalTextContent,
  nativeFillWidth,
  nativeRowWeight,
  useHostColorScheme,
  type PageScreenProps,
} from '@components/ui';
import { useTranslation } from 'react-i18next';
import {
  componentCategories,
  componentIds,
  type ComponentCategoryId,
} from '@/features/template/component-catalog';
import { useThemeColors } from '@/hooks/use-theme';

const steps = ['explore', 'compose', 'personalize'] as const;

/** Template introduction and catalog, composed in the shell's existing native page Host. */
export default function DiscoverScreen({
  onBrowseComponents,
  onSelectCategory,
  onScrollGeometryChange,
}: Readonly<{
  onBrowseComponents: () => void;
  onSelectCategory: (id: ComponentCategoryId) => void;
  onScrollGeometryChange?: PageScreenProps['onScrollGeometryChange'];
}>) {
  const { t } = useTranslation();
  const colors = useThemeColors(useHostColorScheme());

  return (
    <PageScreen tab title={t('discover.title')} onScrollGeometryChange={onScrollGeometryChange}>
      <PageSection spacing={spacing.xl} testID="discover-screen">
        <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
          <UniversalTextContent variant="caption" tone="muted" textStyle={{ letterSpacing: 1.5 }}>
            {t('discover.eyebrow')}
          </UniversalTextContent>
          <UniversalTextContent variant="heading" fontSize={32} testID="discover-title">
            {t('discover.headline')}
          </UniversalTextContent>
          <UniversalTextContent variant="body" tone="muted">
            {t('discover.description')}
          </UniversalTextContent>
        </Column>

        <Column
          spacing={spacing.xl}
          modifiers={nativeFillWidth}
          style={{ padding: spacing.xl, borderRadius: 24, backgroundColor: colors.text }}
          testID="discover-featured"
        >
          <Badge label={t('discover.featured.badge')} variant="secondary" />
          <Icon
            name={Icon.select({ ios: 'square.grid.2x2', android: 'widgets' })}
            size={48}
            color={colors.surface}
          />
          <Column spacing={spacing.md} modifiers={nativeFillWidth}>
            <UniversalTextContent
              variant="heading"
              fontSize={36}
              textStyle={{ color: colors.surface }}
            >
              {t('discover.featured.title')}
            </UniversalTextContent>
            <UniversalTextContent variant="body" textStyle={{ color: colors.surface }}>
              {t('discover.featured.description', {
                total: componentIds.length,
                categories: componentCategories.length,
              })}
            </UniversalTextContent>
          </Column>
          <UniversalTextContent variant="caption" textStyle={{ color: colors.surface }}>
            {t('discover.featured.caption')}
          </UniversalTextContent>
          <ButtonContent
            variant="primary"
            fullWidth
            color={colors.surface}
            contentColor={colors.text}
            label={t('home.browseComponents')}
            onPress={onBrowseComponents}
            testID="discover-browse-components"
          />
        </Column>

        <Column spacing={spacing.lg} modifiers={nativeFillWidth} testID="discover-topics">
          <Column spacing={spacing.sm} modifiers={nativeFillWidth}>
            <UniversalTextContent variant="title">
              {t('discover.componentsTitle')}
            </UniversalTextContent>
            <UniversalTextContent variant="body" tone="muted">
              {t('discover.componentsDescription')}
            </UniversalTextContent>
          </Column>
          {componentCategories.map(({ id, icon, components }) => (
            <Column
              key={id}
              spacing={spacing.lg}
              modifiers={nativeFillWidth}
              style={{
                padding: spacing.lg,
                borderRadius: 20,
                backgroundColor: colors.surfaceVariant,
              }}
              testID={`discover-category-${id}`}
            >
              <Row spacing={spacing.md} alignment="center" modifiers={nativeFillWidth}>
                <Icon name={icon} size={28} />
                <Column spacing={spacing.xs} modifiers={nativeRowWeight}>
                  <UniversalTextContent variant="subtitle">
                    {t(`componentCatalog.categories.${id}`)}
                  </UniversalTextContent>
                  <UniversalTextContent variant="caption" tone="muted">
                    {t('componentCatalog.categoryCount', { count: components.length })}
                  </UniversalTextContent>
                </Column>
              </Row>
              <UniversalTextContent variant="body" tone="muted">
                {components
                  .map((component) => t(`componentCatalog.names.${component}`))
                  .join(' · ')}
              </UniversalTextContent>
              <ButtonContent
                variant="secondary"
                fullWidth
                label={t('discover.exploreCategory', {
                  category: t(`componentCatalog.categories.${id}`),
                })}
                onPress={() => onSelectCategory(id)}
                testID={`discover-explore-${id}`}
              />
            </Column>
          ))}
        </Column>

        <Column spacing={spacing.sm} modifiers={nativeFillWidth} testID="discover-ideas">
          <UniversalTextContent variant="title">{t('discover.stepsTitle')}</UniversalTextContent>
          <UniversalTextContent variant="body" tone="muted">
            {t('discover.stepsDescription')}
          </UniversalTextContent>
          {steps.map((id, index) => (
            <Row
              key={id}
              spacing={spacing.lg}
              modifiers={nativeFillWidth}
              style={{ paddingVertical: spacing.lg }}
              testID={`discover-step-${id}`}
            >
              <UniversalTextContent variant="title" tone="muted">
                {String(index + 1).padStart(2, '0')}
              </UniversalTextContent>
              <Column spacing={spacing.sm} modifiers={nativeRowWeight}>
                <UniversalTextContent variant="subtitle">
                  {t(`discover.steps.${id}.title`)}
                </UniversalTextContent>
                <UniversalTextContent variant="body" tone="muted">
                  {t(`discover.steps.${id}.description`)}
                </UniversalTextContent>
              </Column>
            </Row>
          ))}
        </Column>
      </PageSection>
    </PageScreen>
  );
}
