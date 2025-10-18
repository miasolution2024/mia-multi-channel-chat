import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { 
  getContentAssistantList, 
  ContentAssistantApiResponse,
  ContentAssistantFilters 
} from '@/actions/content-assistant';

export interface UseGetContentAssistantListParams {
  topic?: string;
  status?: string[];
  page?: number;
  pageSize?: number;
}

export interface UseGetContentAssistantListReturn {
  data: ContentAssistantApiResponse[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
}

export function useGetContentAssistantList(
  params: UseGetContentAssistantListParams & {
    postType?: string;
    omniChannel?: number;
    isNotLinkToCampaign?: boolean;
  } = {},
): UseGetContentAssistantListReturn {
  const [data, setData] = useState<ContentAssistantApiResponse[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { topic = '', status = [], page = 0, pageSize = 10, postType, omniChannel, isNotLinkToCampaign = false } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const filters: ContentAssistantFilters = {
        topic,
        status,
        page,
        pageSize,
        postType: postType || undefined,
        omniChannel: omniChannel || undefined,
        isNotLinkToCampaign,
      };

      const response = await getContentAssistantList(filters);
      setData(response.data || []);
      setTotal(response.total || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách trợ lý nội dung';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, status, page, pageSize, postType, omniChannel]);

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
    isLoading,
    error,
    fetchData,
    refetch,
  };
}