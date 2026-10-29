import { PageScreen, PageSection, SkeletonContent, UniversalTextContent } from '@components/ui';
import { useTranslation } from 'react-i18next';
import { getAppBrand } from '@/config/brand';

/** The only release page: a neutral starting point for the next application. */
export default function TemplateScreen({ showBack = false }: Readonly<{ showBack?: boolean }>) {
  const { t } = useTranslation();
  const brand = getAppBrand();
  return (
    <PageScreen title={brand.name} description="" showBack={showBack}>
      <PageSection testID="template-wireframe">
        <UniversalTextContent variant="title">{t('template.title')}</UniversalTextContent>
        <UniversalTextContent tone="muted">{t('template.description')}</UniversalTextContent>
        <SkeletonContent style={{ height: 160 }} testID="template-card-placeholder" />
        <SkeletonContent style={{ height: 20 }} />
        <SkeletonContent style={{ height: 16 }} />
        <SkeletonContent style={{ height: 16 }} />
      </PageSection>
    </PageScreen>
  );
}
