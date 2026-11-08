import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import ComponentScreen from '@/features/template/component-screen';
import { isComponentId } from '@/features/template/component-catalog';

export default function ComponentRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { t } = useTranslation();
  const title = isComponentId(id) ? t(`componentCatalog.names.${id}`) : t('template.components');
  return (
    <>
      <Stack.Screen options={{ title }} />
      <ComponentScreen key={id} id={id} />
    </>
  );
}
