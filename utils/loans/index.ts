export const getLoanStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return 'En Curso';
    case 'completed':
      return 'Completado';
    case 'defaulted':
      return 'Incumplido';
    case 'pending':
      return 'Desembolsado';
    default:
      return status;
  }
};

export const getLoanStatusStyle = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'defaulted':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getPaymentMethodText = (method: string) => {
  switch (method) {
    case 'cash':
      return 'Efectivo';
    case 'transfer':
      return 'Transferencia';
    case 'other':
      return 'Otro';
    default:
      return method;
  }
};

export const getPaymentFrequencyText = (frequency: string) => {
  switch (frequency) {
    case 'monthly':
      return 'Mensual';
    case 'biweekly':
      return 'Quincenal';
    case 'weekly':
      return 'Semanal';
    case 'daily':
      return 'Diario';
    default:
      return frequency;
  }
};
