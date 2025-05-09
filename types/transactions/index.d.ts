export interface Transaction {
  id: number;
  amount: number;
  type: string;
  notes: string | null;
  created_at: string;
  loan_id: number;
  payment_id: number | null;
  loan?: {
    client: {
      name: string;
      last_name: string;
    };
  };
}

export interface TransactionDetail extends Transaction {
  loan: {
    id: number;
    amount: number;
    interest_rate: number;
    term: number;
    due_date: string;
    payment_frequency: string;
    status: string;
    total_amount: number;
    outstanding: number;
    paid_amount: number;
    pending_quotas: number;
    quota: number;
    payment_date: string;
    client: {
      id: number;
      name: string;
      last_name: string;
      email: string;
      phone: string;
      address: string;
      sub_address?: string;
      document_type: string;
      document_number: number;
      created_at: string;
    };
  };
  payment?: {
    id: number;
    amount: number;
    date: string;
    method: string;
  };
}
