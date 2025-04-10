import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function useCalculateDueDate() {
  const dueDate = ({
    startDate,
    term,
    paymentFrequency,
  }: {
    startDate: string;
    term: number;
    paymentFrequency: string;
  }) => {
    const calculatedDueDate = new Date(startDate);

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

    return {
      dateObject: calculatedDueDate,
      date: format(calculatedDueDate, 'dd/MM/yyyy', { locale: es }),
      formattedDate: format(calculatedDueDate, "dd 'de' MMMM, yyyy", {
        locale: es,
      }),
    };
  };

  return { dueDate };
}
