import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getCustomerInsights } from '@/actions/customer-insight';
import { CustomerInsight } from '@/sections/customer-insight/types';

export interface UseGetCustomerInsightsParams {
  page?: number;
  limit?: number;
  content?: string;
  id?: string | number;
}

export interface UseGetCustomerInsightsReturn {
  data: CustomerInsight[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  options: { value: string; label: string }[];
}

export function useGetCustomerInsights(
  params: UseGetCustomerInsightsParams = {}
): UseGetCustomerInsightsReturn {
  const [data, setData] = useState<CustomerInsight[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25, content = '', id } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCustomerInsights({ page, limit, content, id });
      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách hành vi khách hàng';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, content, id]);

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
      label: item.content,
    })),
    isLoading,
    error,
    fetchData,
    refetch,
  };
}