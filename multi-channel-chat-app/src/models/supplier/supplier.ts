export interface Supplier {
  supplierID: string;
  supplierName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  salePersonPhone: string;
}

export interface SupplierRequest {
  supplierName: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  contactPerson?: string;
  salePersonPhone?: string;
}
