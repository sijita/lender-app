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
    };
  };
}
