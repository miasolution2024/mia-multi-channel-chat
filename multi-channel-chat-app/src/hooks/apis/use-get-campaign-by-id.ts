import { useState, useCallback } from 'react';
import { toast } from '@/components/snackbar';
import { getCampaign } from '@/actions/campaign';
import { Campaign } from '@/types/campaign';

export interface UseGetCampaignByIdReturn {
  data: Campaign | null;
  isLoading: boolean;
  error: string | null;
  fetchData: (id: string) => Promise<Campaign | null>;
  refetch: (id: string) => Promise<Campaign | null>;
}

export function useGetCampaignById(): UseGetCampaignByIdReturn {
  const [data, setData] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (id: string): Promise<Campaign | null> => {
    if (!id) {
      setError('ID chiến dịch không hợp lệ');
      setIsLoading(false);
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getCampaign(id);
      const campaignData = response.data || null;
      setData(campaignData);
      return campaignData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải thông tin chiến dịch';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching campaign by id:', err);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetch = useCallback(async (id: string): Promise<Campaign | null> => {
    return await fetchData(id);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    refetch,
  };
}