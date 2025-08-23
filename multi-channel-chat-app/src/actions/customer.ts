import useSWR from "swr";
import axiosInstance, { endpoints, fetcher, swrConfig } from "@/utils/axios";
import { useMemo } from "react";
import { Customer, CustomerRequest } from "@/models/customer/customer";

// ----------------------------------------------------------------------

export function getCustomersByOmniChannelUrl(pageId: string) {
  if (!pageId) return "";
  const queryParams = new URLSearchParams({
    "filter[omni_channel][page_id][_eq]": pageId,
    fields: ["name", "phone_number", "email"].join(","),
  }).toString();
  return `${endpoints.customers.list}?${queryParams}`;
}

export function useGetCustomersByOmniChannel(pageId: string) {
  const { data, isLoading, error, isValidating } = useSWR(
    getCustomersByOmniChannelUrl(pageId),
    fetcher,
    swrConfig
  );

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
export function useGetCustomers() {
  const { data, isLoading, error, isValidating } = useSWR(
    endpoints.customers.list,
    fetcher,
    swrConfig
  );

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
