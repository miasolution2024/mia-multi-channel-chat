import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/components/snackbar';
import { getKnowledgeBasedList } from '@/actions/knowledge-based';
import { KnowledgeBased } from '@/sections/knowledge-based/types';

export interface UseGetKnowledgeBasedListParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface UseGetKnowledgeBasedListReturn {
  data: KnowledgeBased[];
  total: number;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  refetch: () => Promise<void>;
  options: { value: string; label: string }[];
}

export function useGetKnowledgeBasedList(
  params: UseGetKnowledgeBasedListParams = {}
): UseGetKnowledgeBasedListReturn {
  const [data, setData] = useState<KnowledgeBased[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { page = 1, limit = 25, status } = params;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await getKnowledgeBasedList(page, limit, status);
      setData(response.data || []);
      setTotal(response.meta?.total_count || 0);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải danh sách Kiến thức cơ sở';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching knowledge based:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, status]);

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
      label: item.content?.substring(0, 50) + (item.content?.length > 50 ? '...' : ''),
    })),
    isLoading,
    error,
    fetchData,
    refetch,
  };
}
