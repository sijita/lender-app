export interface UpcomingPayment {
  clientName: string;
  amount: number;
  paymentDate: string;
  transactionId: number;
  status: 'on_time' | 'at_risk' | 'overdue';
}
