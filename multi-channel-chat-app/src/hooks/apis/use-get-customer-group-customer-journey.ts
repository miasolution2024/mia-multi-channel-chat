import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getCustomerGroupCustomerJourneys } from '@/actions/customer-insight';
import { CustomerInsight } from '@/sections/customer-insight/types';

export interface UseGetCustomerGroupCustomerJourneysParams {
  customer_group_id?: string | number;
  customer_journey_process? : string | number

}

export interface UseGetCustomerGroupCustomerJourneysReturn {
  data: CustomerInsight[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useGetCustomerGroupCustomerJourneys(
  params: UseGetCustomerGroupCustomerJourneysParams = {}
): UseGetCustomerGroupCustomerJourneysReturn {
  const [data, setData] = useState<CustomerInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { customer_group_id, customer_journey_process } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCustomerGroupCustomerJourneys({ customer_group_id, customer_journey_process });
      setData(response.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách hành vi khách hàng';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [customer_group_id, customer_journey_process]);

  // Auto-fetch when parameters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  return {
    data,
    isLoading,
    error,
    fetchData,
    refetch,
  };
}