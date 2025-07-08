import useSWR from "swr";
import axiosInstance, { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import {
  PurchaseOrder,
  PurchaseOrderRequest,
} from "@/models/purchase-order/purchase-order";

// ----------------------------------------------------------------------

export function useGetPurchaseOrders() {
  const url = endpoints.purchaseOrders.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      purchaseOrders: (data?.data as PurchaseOrder[]) || [],
      purchaseOrdersLoading: isLoading,
      purchaseOrdersError: error,
      purchaseOrdersValidating: isValidating,
      purchaseOrdersEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------

export async function updatePurchaseOrderAsync(
  purchaseOrderID: string,
  request: PurchaseOrderRequest
) {
  try {
    await axiosInstance.put(
      `${endpoints.purchaseOrders.update}/${purchaseOrderID}`,
      request
    );
  } catch (error) {
    console.error("Error during update purchase order:", error);
    throw error;
  }
}
// ----------------------------------------------------------------------

export async function getPurchaseOrderByIdAsync(purchaseOrderID: string) {
  try {
    const response = await axiosInstance.get(
      `${endpoints.purchaseOrders.list}/${purchaseOrderID}`
    );
    return response.data as PurchaseOrder;
  } catch (error) {
    console.error("Error during get purchase order:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createPurchaseOrderAsync(request: PurchaseOrderRequest) {
  try {
    await axiosInstance.post(endpoints.purchaseOrders.create, request);
  } catch (error) {
    console.error("Error during create purchase order:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deletePurchaseOrderAsync(purchaseOrderID: string) {
  try {
    await axiosInstance.delete(
      `${endpoints.purchaseOrders.delete}/${purchaseOrderID}`
    );
  } catch (error) {
    console.error("Error during delete purchase order:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteBulkPurchaseOrderAsync(purchaseorderIDs: string[]) {
  try {
    await axiosInstance.delete(endpoints.purchaseOrders.deleteBulk, {
      data: purchaseorderIDs,
    });
  } catch (error) {
    console.error("Error during delete purchase order:", error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updatePurchaseOrderStatusAsync(
  purchaseorderID: string,
  status: string
) {
  try {
    await axiosInstance.put(
      `${endpoints.purchaseOrders.update}/${purchaseorderID}/status?status=${status}`
    );
  } catch (error) {
    console.error("Error during update purchase order status:", error);
    throw error;
  }
}