import { useState, useCallback } from 'react';
import { toast } from '@/components/snackbar';
import { getCampaign } from '@/actions/campaign';
import { Campaign } from '@/types/campaign';

export interface UseGetCampaignByIdReturn {
  data: Campaign | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (id: string) => Promise<void>;
  refetch: (id: string) => Promise<void>;
}

export function useGetCampaignById(): UseGetCampaignByIdReturn {
  const [data, setData] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (id: string) => {
    if (!id) {
      setError('ID chiến dịch không hợp lệ');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCampaign(id);
      setData(response.data || null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin chiến dịch';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching campaign by id:', err);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async (id: string) => {
    await fetchData(id);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    refetch,
  };
}