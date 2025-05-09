import { UpcomingPayment } from '@/types/payments';

export const getStatusColor = (status: UpcomingPayment['status']) => {
  switch (status) {
    case 'on_time':
      return 'text-green-500';
    case 'at_risk':
      return 'text-red-500';
    case 'overdue':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
};

export const getStatusText = (status: UpcomingPayment['status']) => {
  switch (status) {
    case 'on_time':
      return 'A tiempo';
    case 'at_risk':
      return 'Crítico';
    case 'overdue':
      return 'Vencido';
    default:
      return '';
  }
};
