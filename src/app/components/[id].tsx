import { useLocalSearchParams } from 'expo-router';
import ComponentScreen from '@/features/template/component-screen';

export default function ComponentRoute() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return <ComponentScreen key={id} id={id} />;
}
