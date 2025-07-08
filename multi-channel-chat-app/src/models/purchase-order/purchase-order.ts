export interface PurchaseOrder {
  purchaseOrderID: string;
  invoiceID: string;
  supplierID: string;
  supplierName: string;
  supplierAddress: string;
  supplierPhone: string;
  purchaseOrderDate: string;
  orderStatus: PurchaseOrderStatus;
  notes: string;
  totalAmount: number;
  subtotal: number;
  discount: number;
  taxes: number;
  createdAt: string;
  purchaseOrderDetails: PurchaseOrderDetail[];
}

export interface PurchaseOrderDetail {
  purchaseOrderDetailID: string;
  purchaseOrderID: string;
  productID: string;
  productName: string;
  quantity: number;
  purchasePrice: number;
  subtotal: number;
  expiredDate: Date;
  unit: string;
}

export interface PurchaseOrderRequest {
  supplierID: string;
  supplierName?: string;
  purchaseOrderDate: string | Date | null | number;
  orderStatus: string;
  notes?: string;
  totalAmount?: number;
  subtotal?: number;
  discount?: number;
  taxes?: number;
  purchaseOrderDetails: PurchaseOrderDetailRequest[];
}

export interface PurchaseOrderDetailRequest {
  purchaseOrderID?: string;
  purchaseOrderDetailID?: string;
  productID: string;
  productName?: string;
  quantity: number;
  purchasePrice: number;
  subtotal: number;
  expiredDate?: Date;
  unit: string;
}

export enum PurchaseOrderStatus {
  DRAFT = "Draft",
  PENDING = "Pending",
  PAID = "Paid",
  CANCELLED = "Cancelled",
  OVERDUE = "Overdue",
}
