import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getCampaigns } from '@/actions/campaign';
import { Campaign } from '@/types/campaign';

export interface UseGetCampaignsParams {
  page?: number;
  pageSize?: number;
  id?: string | number;
  name?: string;
}

export interface UseGetCampaignsReturn {
  data: Campaign[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  options: { value: string; label: string }[];
}

export function useGetCampaignList(
  params: UseGetCampaignsParams = {}
): UseGetCampaignsReturn {
  const [data, setData] = useState<Campaign[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { page = 0, pageSize = 10, name } = params;



  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
        const filters = {
        page,
        pageSize,
        name
      };
      const response = await getCampaigns(filters);
      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách chiến dịch';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching campaigns:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, pageSize, name]);

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
      value: item.id.toString(),
      label: item.name,
    })),
    isLoading,
    error,
    fetchData,
    refetch,
  };
}