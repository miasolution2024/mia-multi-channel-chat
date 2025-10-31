import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getCustomerJourneyProcesses } from '@/actions/customer-journey-process';
import { CustomerJourneyProcess } from '@/sections/customer-journey-process/types';

export interface UseGetCustomerJourneyProcessParams {
  page?: number;
  limit?: number;
  name?: string;
  id?: string;
  status?: string;
}

export interface UseGetCustomerJourneyProcessReturn {
  data: CustomerJourneyProcess[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  options: { value: string; label: string }[];
}

export function useGetCustomerJourneyProcess(
  params: UseGetCustomerJourneyProcessParams = {}
): UseGetCustomerJourneyProcessReturn {
  const [data, setData] = useState<CustomerJourneyProcess[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25, name = '', id = '', status = '' } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCustomerJourneyProcesses(page, limit, name, id, status);
      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách customer journey process';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, name, id]);

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