import { useState } from 'react';
import { toast } from '@/components/snackbar';
import { createNewContentAssistant } from '@/actions/content-assistant';
import { CreateContentAssistantRequest, CreateContentAssistantResponse } from '../types/content-assistant-create';

export interface UseCreateContentAssistantReturn {
  createContentAssistant: (data: CreateContentAssistantRequest) => Promise<CreateContentAssistantResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export function useCreateContentAssistant(): UseCreateContentAssistantReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createContentAssistant = async (
    data: CreateContentAssistantRequest
  ): Promise<CreateContentAssistantResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createNewContentAssistant(data);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo nội dung';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createContentAssistant,
    isLoading,
    error,
  };
}