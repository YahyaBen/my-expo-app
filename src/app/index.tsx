import { Redirect, useLocalSearchParams } from 'expo-router';
import { storybookEnabled } from '@/config/developer-tools';
import TemplateScreen from '@/features/template/template-screen';

export default function Index() {
  const { preview } = useLocalSearchParams<{ preview?: string }>();
  if (storybookEnabled && preview !== 'true') return <Redirect href="/storybook" />;
  return <TemplateScreen showBack={storybookEnabled && preview === 'true'} />;
}
