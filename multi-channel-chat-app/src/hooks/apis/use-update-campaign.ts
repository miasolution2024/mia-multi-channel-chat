import { useState } from 'react';
import { toast } from '@/components/snackbar';
import { updateCampaign } from '@/actions/campaign';
import { Campaign } from '@/types/campaign';
import { CampaignFormData } from '@/sections/marketing-campaign/utils';
import { CampaignStep2Data, CampaignStep3Data } from '@/sections/marketing-campaign/types';

export interface UseUpdateCampaignReturn {
  updateCampaign: (id: string | number, data: CampaignFormData | CampaignStep2Data | CampaignStep3Data) => Promise<Campaign>;
  isLoading: boolean;
  error: string | null;
}

export function useUpdateCampaign(): UseUpdateCampaignReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCampaignHandler = async (
    id: string | number,
    data: CampaignFormData | CampaignStep2Data | CampaignStep3Data,
  ): Promise<Campaign> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateCampaign(id.toString(), data as CampaignFormData);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật chiến dịch';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateCampaign: updateCampaignHandler,
    isLoading,
    error,
  };
}