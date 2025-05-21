export interface UpcomingPayment {
  clientName: string;
  amount: number;
  paymentDate: string;
  transactionId: number;
  status: 'on_time' | 'at_risk' | 'overdue';
}

export interface RecentPayment {
  id: number;
  name: string;
  type: 'payment_received';
  amount: number;
  date: string;
}
