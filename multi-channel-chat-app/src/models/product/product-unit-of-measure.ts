export interface ProductUnitOfMeasure {
  productUnitOfMeasureID: string;
  productID: string;
  barcode: string;
  unit: string;
  conversionFactor: number;
  purchasePrice: number;
  salePrice: number;
  isBaseUnit: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductUnitOfMeasureRequest {
  productID: string;
  barcode?: string;
  unit: string;
  conversionFactor?: number;
  purchasePrice?: number;
  salePrice?: number;
  isBaseUnit?: boolean;
}
