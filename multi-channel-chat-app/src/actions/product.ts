import useSWR from "swr";
import axiosInstance, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import { ProductRequest } from "@/models/product/product";
import { Product } from "@/models/product/product";

// ----------------------------------------------------------------------

export function useGetProducts() {
  const url = endpoints.products.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      products: (data?.data as Product[]) || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
      productsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export function useGetProductTags() {
  const url = endpoints.products.tags;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      productTags: (data?.data as string[]) || [],
      productTagsLoading: isLoading,
      productTagsError: error,
      productTagsValidating: isValidating,
      productTagsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export async function updateProductAsync(
  productID: string,
  request: ProductRequest
) {
  try {
    await axiosInstance.put(
      `${endpoints.products.update}/${productID}`,
      request
    );
  } catch (error) {
    console.error("Error during update product:", error);
    throw error;
  }
}
// ----------------------------------------------------------------------

export async function getProductByIdAsync(id: string) {
  try {
    const response = await axiosInstance.get(
      `${endpoints.products.list}/${id}`
    );
    return response.data as Product;
  } catch (error) {
    console.error("Error during get product:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createProductAsync(request: ProductRequest) {
  try {
    await axiosInstance.post(endpoints.products.create, request);
  } catch (error) {
    console.error("Error during create product:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteProductAsync(productID: string) {
  try {
    await axiosInstance.delete(`${endpoints.products.delete}/${productID}`);
  } catch (error) {
    console.error("Error during delete product:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteBulkProductAsync(productIDs: string[]) {
  try {
    await axiosInstance.delete(endpoints.products.deleteBulk, {
      data: productIDs,
    });
  } catch (error) {
    console.error("Error during delete product:", error);
    throw error;
  }
}
