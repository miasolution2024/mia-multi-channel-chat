import { useState } from 'react';
import { toast } from '@/components/snackbar';
import { getContentAssistantById, ContentAssistantApiResponse } from '@/actions/content-assistant';

export interface UseGetContentAssistantByIdReturn {
  getContentAssistant: (id: string | number) => Promise<ContentAssistantApiResponse | null>;
  isLoading: boolean;
  error: string | null;
  data: ContentAssistantApiResponse | null;
}

export function useGetContentAssistantById(): UseGetContentAssistantByIdReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ContentAssistantApiResponse | null>(null);

  const getContentAssistant = async (
    id: string | number
  ): Promise<ContentAssistantApiResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getContentAssistantById(id);
      setData(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin nội dung';
      setError(errorMessage);
      toast.error(errorMessage);
      setData(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getContentAssistant,
    isLoading,
    error,
    data,
  };
}