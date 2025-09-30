import { useState } from 'react';
import { toast } from '@/components/snackbar';
import { createCampaign } from '@/actions/campaign';
import { Campaign } from '@/types/campaign';
import { CampaignApiData, CampaignStep1Data } from '@/sections/marketing-campaign/types';

interface CreateCampaignResponse {
  data: Campaign;
}

export interface UseCreateCampaignReturn {
  createCampaignHandler: (data: CampaignApiData | CampaignStep1Data) => Promise<CreateCampaignResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export function useCreateCampaign(): UseCreateCampaignReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCampaignHandler = async (
    data: CampaignApiData | CampaignStep1Data
  ): Promise<CreateCampaignResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createCampaign(data as CampaignApiData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo chiến dịch';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error creating campaign:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCampaignHandler,
    isLoading,
    error,
  };
}