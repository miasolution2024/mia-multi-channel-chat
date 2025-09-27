import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getServices } from '@/actions/services';

export interface UseGetServicesParams {
  page?: number;
  limit?: number;
}

export interface ServiceData {
  id: string;
  name: string;
  description: string;
}

export interface UseGetServicesReturn {
  data: ServiceData[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  options: { value: string; label: string }[];
}

export function useGetServices(
  params: UseGetServicesParams = {}
): UseGetServicesReturn {
  const [data, setData] = useState<ServiceData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25 } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getServices(page, limit);
      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách dịch vụ';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching services:', err);
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