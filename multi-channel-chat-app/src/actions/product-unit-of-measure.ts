import useSWR from "swr";
import axiosInstance, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import {
  ProductUnitOfMeasure,
  ProductUnitOfMeasureRequest,
} from "@/models/product/product-unit-of-measure";

// ----------------------------------------------------------------------

export function useGetProductUnitOfMeasures(productId: string) {
  
  const url = productId
    ? `${endpoints.productUnitOfMeasure.list}/${productId}`
    : "";

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      productUnitOfMeasures: (data?.data as ProductUnitOfMeasure[]) || [],
      productUnitOfMeasuresLoading: isLoading,
      productUnitOfMeasuresError: error,
      productUnitOfMeasuresValidating: isValidating,
      productUnitOfMeasuresEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function updateProductUnitOfMeasureAsync(
  productunitofmeasureID: string,
  request: ProductUnitOfMeasureRequest
) {
  try {
    await axiosInstance.put(
      `${endpoints.productUnitOfMeasure.update}/${productunitofmeasureID}`,
      request
    );
  } catch (error) {
    console.error("Error during update product unit of measure:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createProductUnitOfMeasureAsync(
  request: ProductUnitOfMeasureRequest
) {
  try {
    await axiosInstance.post(endpoints.productUnitOfMeasure.create, request);
  } catch (error) {
    console.error("Error during create product unit of measure:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteProductUnitOfMeasureAsync(
  productunitofmeasureID: string
) {
  try {
    await axiosInstance.delete(
      `${endpoints.productUnitOfMeasure.delete}/${productunitofmeasureID}`
    );
  } catch (error) {
    console.error("Error during delete product unit of measure:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteBulkProductUnitOfMeasureAsync(
  productunitofmeasureIDs: string[]
) {
  try {
    await axiosInstance.delete(endpoints.productUnitOfMeasure.deleteBulk, {
      data: productunitofmeasureIDs,
    });
  } catch (error) {
    console.error("Error during delete product unit of measure:", error);
    throw error;
  }
}
