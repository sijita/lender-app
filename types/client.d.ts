export interface Client {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  sub_address: string | null;
  document_type: string;
  document_number: number;
  notes: string | null;
  outstanding: number;
  status: 'free' | 'pending';
  created_at: string;
}
