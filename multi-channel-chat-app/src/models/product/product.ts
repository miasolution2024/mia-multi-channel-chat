import { ProductUnitOfMeasure } from "./product-unit-of-measure";

export interface Product {
  productID: string;
  productName: string;
  productCode: string;
  categoryID: string;
  supplierID: string;
  unit: string;
  purchasePrice: number;
  salePrice: number;
  stockQuantity: number;
  minimumStock: number;
  description: string;
  tags: string[];
  productUnitOfMeasures: ProductUnitOfMeasure[];
}

export interface ProductRequest {
  productName: string;
  productCode?: string;
  categoryID?: string;
  supplierID?: string;
  unit?: string;
  purchasePrice?: number;
  salePrice?: number;
  stockQuantity?: number;
  minimumStock?: number;
  description?: string;
  tags?: string[];
}
