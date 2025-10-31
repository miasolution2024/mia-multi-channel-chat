import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getCustomerGroups } from '@/actions/customer-group';
import type { CustomerGroup } from '@/sections/customer-group/types';

export interface UseGetCustomerGroupsParams {
  page?: number;
  limit?: number;
  name?: string;
  id?: number;
}

export interface UseGetCustomerGroupsReturn {
  data: CustomerGroup[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  options: { value: string; label: string }[];
}

export function useGetCustomerGroups(
  params: UseGetCustomerGroupsParams = {}
): UseGetCustomerGroupsReturn {
  const [data, setData] = useState<CustomerGroup[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25 } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCustomerGroups({
        page, 
        limit,
        name: params.name,
        id: params.id
      });
      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách nhóm khách hàng';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching customer groups:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, params.name, params.id]);

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
    options: data.map((item) => ({
      value: String(item.id),
      label: item.name,
    })),
    isLoading,
    error,
    fetchData,
    refetch,
  };
}