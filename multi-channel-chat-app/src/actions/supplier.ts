import useSWR from "swr";
import axiosInstance, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import { Supplier, SupplierRequest } from "@/models/supplier/supplier";

// ----------------------------------------------------------------------

export function useGetSuppliers() {
  const url = endpoints.suppliers.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      suppliers: (data?.data as Supplier[]) || [],
      suppliersLoading: isLoading,
      suppliersError: error,
      suppliersValidating: isValidating,
      suppliersEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function updateSupplierAsync(
  supplierID: string,
  request: SupplierRequest
) {
  try {
    await axiosInstance.put(
      `${endpoints.suppliers.update}/${supplierID}`,
      request
    );
  } catch (error) {
    console.error("Error during update supplier:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createSupplierAsync(request: SupplierRequest) {
  try {
    await axiosInstance.post(endpoints.suppliers.create, request);
  } catch (error) {
    console.error("Error during create supplier:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteSupplierAsync(supplierID: string) {
  try {
    await axiosInstance.delete(`${endpoints.suppliers.delete}/${supplierID}`);
  } catch (error) {
    console.error("Error during delete supplier:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteBulkSupplierAsync(supplierIDs: string[]) {
  try {
    await axiosInstance.delete(endpoints.suppliers.deleteBulk, {
      data: supplierIDs,
    });
  } catch (error) {
    console.error("Error during delete supplier:", error);
    throw error;
  }
}
