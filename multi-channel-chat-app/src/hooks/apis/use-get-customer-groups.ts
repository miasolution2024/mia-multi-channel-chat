import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getCustomerGroups } from '@/actions/customer-group';

export interface UseGetCustomerGroupsParams {
  page?: number;
  limit?: number;
}

export interface CustomerGroupData {
  id: string;
  name: string;
  action: string;
  descriptions: string;
  services: string[];
}

export interface UseGetCustomerGroupsReturn {
  data: CustomerGroupData[];
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
  const [data, setData] = useState<CustomerGroupData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25 } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCustomerGroups(page, limit);
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
  }, [page, limit]);

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
      value: item.id,
      label: item.name,
    })),
    isLoading,
    error,
    fetchData,
    refetch,
  };
}