import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getCustomerJourneys } from '@/actions/customer-journey';

export interface UseGetCustomerJourneysParams {
  page?: number;
  limit?: number;
}

export interface CustomerJourneyData {
  id: string;
  name: string;
  description: string;
  ai_content_suggestions: unknown[];
}

export interface UseGetCustomerJourneysReturn {
  data: CustomerJourneyData[];
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
  const [data, setData] = useState<CustomerJourneyData[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25 } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCustomerJourneys(page, limit);
      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách customer journey';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching customer journeys:', err);
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