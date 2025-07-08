export interface SalesOrder {
  orderID: string;
  customerID: string;
  customerName: string;
  customerEmail: string;
  orderDate: string;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: SalesOrderStatus;
  notes: string;
  discount: number;
  taxes: number;
  subtotal: number;
  createdAt: string;
  salesOrderDetails: SalesOrderDetail[];
}

export interface SalesOrderDetail {
  orderDetailID: string;
  productID: string;
  productName?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal?: number;
}

export enum SalesOrderStatus {
  All = "all",
  DRAFT = "Draft",
  PENDING = "Pending",
  PAID = "Paid",
  CANCELLED = "Cancelled",
  OVERDUE = "Overdue",
}

export interface SalesOrderRequest {
  customerID: string;
  notes: string;
  discount: number;
  taxes: number;
  subtotal: number;
  salesOrderDetails: SalesOrderDetailRequest[];
}

export interface SalesOrderDetailRequest {
  productID: string;
  quantity: number;
  unitPrice: number;
  unit: string;
}
