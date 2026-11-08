import { useLocalSearchParams } from 'expo-router';
import TablePaymentScreen from '@/features/template/table-payment-screen';

export default function TablePaymentRoute() {
  const { id, history } = useLocalSearchParams<{
    id?: string | string[];
    history?: string | string[];
  }>();
  const paymentId = typeof id === 'string' ? id : undefined;
  return (
    <TablePaymentScreen
      key={paymentId}
      id={paymentId}
      historySnapshot={typeof history === 'string' ? history : undefined}
    />
  );
}
