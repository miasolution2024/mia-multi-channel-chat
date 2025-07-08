import useSWR from "swr";
import  { endpoints, fetcher } from "@/utils/axios";
import { useMemo } from "react";
import { InventoryTransaction } from "@/models/inventory-transaction/inventory-transaction";

// ----------------------------------------------------------------------

export function useGetInventoryTransactions() {
  const url = endpoints.inventoryTransactions.list;

  const { data, isLoading, error, isValidating } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      inventoryTransactions: (data?.data as InventoryTransaction[]) || [],
      inventoryTransactionsLoading: isLoading,
      inventoryTransactionsError: error,
      inventoryTransactionsValidating: isValidating,
      inventoryTransactionsEmpty: !isLoading && !data?.data.length,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// ----------------------------------------------------------------------
