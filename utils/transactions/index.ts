export const getTransactionTypeText = (type: string) => {
  switch (type) {
    case 'loan_disbursement':
      return 'Desembolso';
    case 'payment':
      return 'Pago';
    case 'fee':
      return 'Comisión';
    case 'interest':
      return 'Interés';
    default:
      return type;
  }
};

export const getTransactionTypeStyle = (type: string) => {
  switch (type) {
    case 'loan_disbursement':
      return 'bg-yellow-100 text-yellow-800';
    case 'payment':
      return 'bg-green-100 text-green-800';
    case 'fee':
      return 'bg-orange-100 text-orange-800';
    case 'interest':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
