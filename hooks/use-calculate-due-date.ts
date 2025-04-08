import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface CalculateDueDateParams {
  dueDate?: string;
  term?: number;
  paymentFrequency?: string;
}

export default function useCalculateDueDate() {
  const calculateActualDueDate = ({
    dueDate,
    term,
    paymentFrequency,
  }: CalculateDueDateParams) => {
    if (!dueDate || !term || !paymentFrequency) {
      return 'Fecha desconocida';
    }

    const startDate = new Date(dueDate);

    // Clone the start date
    const calculatedDueDate = new Date(startDate);

    // Add time based on frequency and term
    switch (paymentFrequency) {
      case 'daily':
        calculatedDueDate.setDate(calculatedDueDate.getDate() + term);
        break;
      case 'weekly':
        calculatedDueDate.setDate(calculatedDueDate.getDate() + term * 7);
        break;
      case 'biweekly':
        calculatedDueDate.setDate(calculatedDueDate.getDate() + term * 14);
        break;
      case 'monthly':
        calculatedDueDate.setMonth(calculatedDueDate.getMonth() + term);
        break;
      default:
        calculatedDueDate.setDate(calculatedDueDate.getDate() + term * 7); // Default to weekly
    }

    return format(calculatedDueDate, "dd 'de' MMMM, yyyy", { locale: es });
  };

  return { calculateActualDueDate };
}
