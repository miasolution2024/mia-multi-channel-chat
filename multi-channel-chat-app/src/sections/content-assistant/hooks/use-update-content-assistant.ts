import { useState } from 'react';
import { toast } from '@/components/snackbar';
import { updateNewContentAssistant } from '@/actions/content-assistant';
import { UpdateContentAssistantRequest, UpdateContentAssistantResponse } from '../types/content-assistant-update';

export interface UseUpdateContentAssistantReturn {
  updateContentAssistant: (id: string | number, data: UpdateContentAssistantRequest) => Promise<UpdateContentAssistantResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateContentAssistant(): UseUpdateContentAssistantReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateContentAssistant = async (
    id: string | number,
    data: UpdateContentAssistantRequest,
  ): Promise<UpdateContentAssistantResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateNewContentAssistant(id, data);
      // toast.success('Cập nhật nội dung thành công');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật nội dung';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateContentAssistant,
    isLoading,
    error,
  };
}