export interface InventoryTransaction {
  transactionID: string;
  productID: string;
  productName: string;
  transactionType: TransactionType;
  quantityChange: number;
  transactionDate: string;
  documentID: string;
  documentDetailID: string;
  productBatchID: string;
  notes: string;
}

export enum TransactionType {
  Purchase = "Purchase",
  Sale = "Sale",
  Adjustment = "Adjustment",
  Return = "Return",
}
