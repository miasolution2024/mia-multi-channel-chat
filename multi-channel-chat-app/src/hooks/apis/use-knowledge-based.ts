import { useState, useEffect, useCallback } from 'react';
import { getKnowledgeBasedList, deleteKnowledgeBased } from '@/actions/knowledge-based';
import { KnowledgeBased } from '@/sections/knowledge-based/types';
import { toast } from '@/components/snackbar';

interface UseKnowledgeBasedOptions {
  page?: number;
  pageSize?: number;
  autoFetch?: boolean;
}

interface UseKnowledgeBasedReturn {
  items: KnowledgeBased[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  deleteItem: (id: string | number) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useKnowledgeBased(options: UseKnowledgeBasedOptions = {}): UseKnowledgeBasedReturn {
  const { page = 1, pageSize = 20, autoFetch = true } = options;
  
  const [items, setItems] = useState<KnowledgeBased[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getKnowledgeBasedList(page, pageSize);
      setItems(response.data || []);
      setTotalCount(response.meta?.filter_count || 0);
    } catch (err) {
      const errorMessage = 'Không thể tải danh sách kiến thức';
      setError(errorMessage);
      console.error('Error fetching knowledge based:', err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  const deleteItem = useCallback(async (id: string | number) => {
    try {
      await deleteKnowledgeBased(id);
      toast.success('Xóa kiến thức thành công!');
      // Refetch data after successful deletion
      await fetchItems();
    } catch (err) {
      const errorMessage = 'Không thể xóa kiến thức';
      setError(errorMessage);
      console.error('Error deleting knowledge based:', err);
      toast.error(errorMessage);
      throw err; // Re-throw to allow caller to handle
    }
  }, [fetchItems]);

  const refetch = useCallback(async () => {
    await fetchItems();
  }, [fetchItems]);

  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [fetchItems, autoFetch]);

  return {
    items,
    totalCount,
    loading,
    error,
    fetchItems,
    deleteItem,
    refetch,
  };
}
