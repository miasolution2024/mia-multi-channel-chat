import useSWR from "swr";
import axiosInstance, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import { Customer, CustomerRequest } from "@/models/customer/customer";

// ----------------------------------------------------------------------

export function useGetCustomers() {
  const url = endpoints.customers.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      customers: (data?.data as Customer[]) || [],
      customersLoading: isLoading,
      customersError: error,
      customersValidating: isValidating,
      customersEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function updateCustomerAsync(
  customerID: string,
  request: CustomerRequest
) {
  try {
    await axiosInstance.put(
      `${endpoints.customers.update}/${customerID}`,
      request
    );
  } catch (error) {
    console.error("Error during update customer:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createCustomerAsync(request: CustomerRequest) {
  try {
    await axiosInstance.post(endpoints.customers.create, request);
  } catch (error) {
    console.error("Error during create customer:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteCustomerAsync(customerID: string) {
  try {
    await axiosInstance.delete(`${endpoints.customers.delete}/${customerID}`);
  } catch (error) {
    console.error("Error during delete customer:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteBulkCustomerAsync(customerIDs: string[]) {
  try {
    await axiosInstance.delete(endpoints.customers.deleteBulk, {
      data: customerIDs,
    });
  } catch (error) {
    console.error("Error during delete customer:", error);
    throw error;
  }
}
