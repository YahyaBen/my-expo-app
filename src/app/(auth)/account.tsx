import { Redirect } from 'expo-router';
import DemoHomeScreen from '@/features/home/demo-home-screen';
import { useAuthGuards } from '@/guards/auth-guards';

export default function AccountExample() {
  const { requireAuth } = useAuthGuards();
  return requireAuth ? <DemoHomeScreen /> : <Redirect href="/components/login" />;
}
