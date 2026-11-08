import { Stack, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import TablePaymentScreen from '@/features/template/table-payment-screen';
import { paymentDetails } from '@/features/template/table-payments';

export default function TablePaymentRoute() {
  const { t } = useTranslation();
  const { id, history } = useLocalSearchParams<{
    id?: string | string[];
    history?: string | string[];
  }>();
  const paymentId = typeof id === 'string' ? id : undefined;
  const payment = paymentDetails(paymentId);
  return (
    <>
      <Stack.Screen
        options={{
          title: payment
            ? t('componentCatalog.tables.detailsFor', { id: payment.id })
            : t('componentCatalog.tables.title'),
        }}
      />
      <TablePaymentScreen
        key={paymentId}
        id={paymentId}
        historySnapshot={typeof history === 'string' ? history : undefined}
      />
    </>
  );
}
