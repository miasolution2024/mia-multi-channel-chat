export interface Category {
  categoryID: string;
  categoryName: string;
  description: string;
}

export interface CategoryRequest {
  categoryName: string;
  description?: string;
}