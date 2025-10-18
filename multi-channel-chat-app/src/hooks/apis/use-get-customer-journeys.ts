import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getCustomerJourneys } from '@/actions/customer-journey';
import { CustomerJourney } from '@/sections/customer-journey/types';

export interface UseGetCustomerJourneysParams {
  page?: number;
  limit?: number;
  name?: string;
}

export interface UseGetCustomerJourneysReturn {
  data: CustomerJourney[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  options: { value: string; label: string }[];
}

export function useGetCustomerJourneys(
  params: UseGetCustomerJourneysParams = {}
): UseGetCustomerJourneysReturn {
  const [data, setData] = useState<CustomerJourney[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25, name= '' } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCustomerJourneys(page, limit, name);
      setData(response.data?.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách customer journey';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, name]);

  // Auto-fetch when parameters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);
  return {
    data,
    total,
    options: data?.map((item) => ({
      value: item.id.toString(),
      label: item.name,
    })),
    isLoading,
    error,
    fetchData,
    refetch,
  };
}