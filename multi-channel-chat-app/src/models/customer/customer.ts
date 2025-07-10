export interface Customer {
  id: string;
  name: string;
  gender: string;
  phone_number: string;
  email: string;
  status: string;
  customer_source: string;
  created_at: Date;
  updated_at: Date;
}

export interface CustomerRequest {
  customerName: string;
  address?: string;
  phone?: string;
  email?: string;
}
