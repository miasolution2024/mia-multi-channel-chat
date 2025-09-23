import { useState, useEffect, useCallback } from 'react';
import { getAiRules, deleteAiRule } from '@/actions/ai-rules';
import { AiRule } from '@/sections/ai-rules/types';
import { toast } from '@/components/snackbar';

interface UseAiRulesOptions {
  page?: number;
  pageSize?: number;
  autoFetch?: boolean;
}

interface UseAiRulesReturn {
  rules: AiRule[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  fetchRules: () => Promise<void>;
  deleteRule: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useAiRules(options: UseAiRulesOptions = {}): UseAiRulesReturn {
  const { page = 1, pageSize = 20, autoFetch = true } = options;
  
  const [rules, setRules] = useState<AiRule[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getAiRules(page, pageSize);
      setRules(response.data || []);
      setTotalCount(response.meta?.total_count || 0);
    } catch (err) {
      const errorMessage = 'Không thể tải danh sách quy tắc AI';
      setError(errorMessage);
      console.error('Error fetching AI rules:', err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const deleteRule = useCallback(async (id: string) => {
    try {
      await deleteAiRule(id);
      toast.success('Xóa quy tắc thành công!');
      // Refetch data after successful deletion
      await fetchRules();
    } catch (err) {
      const errorMessage = 'Không thể xóa quy tắc AI';
      setError(errorMessage);
      console.error('Error deleting AI rule:', err);
      toast.error(errorMessage);
      throw err; // Re-throw to allow caller to handle
    }
  }, [fetchRules]);

  const refetch = useCallback(async () => {
    await fetchRules();
  }, [fetchRules]);

  useEffect(() => {
    if (autoFetch) {
      fetchRules();
    }
  }, [fetchRules, autoFetch]);

  return {
    rules,
    totalCount,
    loading,
    error,
    fetchRules,
    deleteRule,
    refetch,
  };
}