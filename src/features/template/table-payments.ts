export type PaymentStatus = 'success' | 'processing' | 'failed';
export type PaymentHistoryEvent = 'created' | PaymentStatus;

export type ExamplePayment = {
  id: string;
  email: string;
  amount: number;
  status: PaymentStatus;
  history: readonly PaymentHistoryEvent[];
};

export const paymentBadgeVariants = {
  success: 'default',
  processing: 'secondary',
  failed: 'destructive',
} as const;

export const initialPayments: readonly ExamplePayment[] = [
  {
    id: '1042',
    email: 'ken99@example.com',
    amount: 316,
    status: 'success',
    history: ['created', 'processing', 'success'],
  },
  {
    id: '1041',
    email: 'abe45@example.com',
    amount: 242,
    status: 'success',
    history: ['created', 'processing', 'success'],
  },
  {
    id: '1040',
    email: 'monserrat44@example.com',
    amount: 837,
    status: 'processing',
    history: ['created', 'processing'],
  },
  {
    id: '1039',
    email: 'silas22@example.com',
    amount: 874,
    status: 'success',
    history: ['created', 'processing', 'success'],
  },
  {
    id: '1038',
    email: 'carmella@example.com',
    amount: 721,
    status: 'failed',
    history: ['created', 'processing', 'failed'],
  },
];

/** A local demo snapshot travels with navigation; direct links use the initial row. */
export function paymentDetails(id?: string, historySnapshot?: string): ExamplePayment | undefined {
  const payment = initialPayments.find((row) => row.id === id);
  if (!payment || !historySnapshot) return payment;
  const events = historySnapshot.split(',');
  const status = events[events.length - 1];
  if (
    events[0] !== 'created' ||
    !events.slice(1).every(isPaymentStatus) ||
    !isPaymentStatus(status)
  )
    return payment;
  return { ...payment, status, history: ['created', ...events.slice(1).filter(isPaymentStatus)] };
}

function isPaymentStatus(value: string): value is PaymentStatus {
  return value === 'success' || value === 'processing' || value === 'failed';
}
