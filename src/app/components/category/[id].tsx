import { useLocalSearchParams } from 'expo-router';
import ComponentCategoryScreen from '@/features/template/component-category-screen';

export default function ComponentCategoryRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <ComponentCategoryScreen key={id} id={id} />;
}
