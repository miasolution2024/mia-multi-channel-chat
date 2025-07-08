import useSWR from "swr";
import axiosInstance, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import { SalesOrder, SalesOrderRequest } from "@/models/sales-order/sales-order";


// ----------------------------------------------------------------------

export function useGetSalesOrders() {
  const url = endpoints.salesOrders.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      salesOrders: (data?.data as SalesOrder[]) || [],
      salesOrdersLoading: isLoading,
      salesOrdersError: error,
      salesOrdersValidating: isValidating,
      salesOrdersEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export async function getSalesOrderByIdAsync(salesOrderID: string) {
  try {
    const response = await axiosInstance.get(
      `${endpoints.salesOrders.list}/${salesOrderID}`
    );
    return response.data as SalesOrder;
  } catch (error) {
    console.error("Error during get sales order:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateSalesOrderStatusAsync(
  salesorderID: string,
  status: string
) {
  try {
    await axiosInstance.put(
      `${endpoints.salesOrders.update}/${salesorderID}/status?status=${status}`
    );
  } catch (error) {
    console.error("Error during update sales order status:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createSalesOrderAsync(request: SalesOrderRequest) {
  try {
    await axiosInstance.post(endpoints.salesOrders.create, request);
  } catch (error) {
    console.error("Error during create sales order:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateSalesOrderAsync(
  salesOrderID: string,
  request: SalesOrderRequest
) {
  try {
    await axiosInstance.put(
      `${endpoints.salesOrders.update}/${salesOrderID}`,
      request
    );
  } catch (error) {
    console.error("Error during update sales order:", error);
    throw error;
  }
}