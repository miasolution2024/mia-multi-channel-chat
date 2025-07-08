import useSWR from "swr";
import axiosInstance, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import { Category, CategoryRequest } from "@/models/category/category";

// ----------------------------------------------------------------------

export function useGetCategories() {
  const url = endpoints.categories.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      categories: (data?.data as Category[]) || [],
      categoriesLoading: isLoading,
      categoriesError: error,
      categoriesValidating: isValidating,
      categoriesEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function updateCategoryAsync(
  categoryID: string,
  request: CategoryRequest
) {
  try {
    await axiosInstance.put(
      `${endpoints.categories.update}/${categoryID}`,
      request
    );
  } catch (error) {
    console.error("Error during update category:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createCategoryAsync(request: CategoryRequest) {
  try {
    await axiosInstance.post(endpoints.categories.create, request);
  } catch (error) {
    console.error("Error during create category:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteCategoryAsync(categoryID: string) {
  try {
    await axiosInstance.delete(`${endpoints.categories.delete}/${categoryID}`);
  } catch (error) {
    console.error("Error during delete category:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteBulkCategoryAsync(categoryIDs: string[]) {
  try {
    await axiosInstance.delete(endpoints.categories.deleteBulk, {
      data: categoryIDs,
    });
  } catch (error) {
    console.error("Error during delete category:", error);
    throw error;
  }
}
