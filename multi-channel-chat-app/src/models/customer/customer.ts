export interface Customer {
  customerID: string;
  customerName: string;
  address: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerRequest {
  customerName: string;
  address?: string;
  phone?: string;
  email?: string;
}
