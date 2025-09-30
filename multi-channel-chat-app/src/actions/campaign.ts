import axiosInstance, { endpoints } from '@/utils/axios';
import { CampaignFormData } from '@/sections/marketing-campaign/utils';
import { CampaignApiData } from '@/sections/marketing-campaign/types';

/**
 * Get all campaigns with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 */
export async function getCampaigns(page?: number, limit: number = 25) {
  try {
    let url = endpoints.campaign.list;
    
    // Add pagination and field parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (page !== undefined) {
      params.append('page', page.toString());
    }
    
    // Add specific fields based on actual API response
    params.append('fields[]', 'name');
    params.append('fields[]', 'start_date');
    params.append('fields[]', 'status');
    params.append('fields[]', 'target_post_count');
    params.append('fields[]', 'end_date');
    params.append('fields[]', 'date_created');
    params.append('fields[]', 'date_updated');
    params.append('fields[]', 'post_type');
    params.append('fields[]', '704a9f83.page_name');
    params.append('fields[]', 'post_topic');
    params.append('fields[]', 'objectives');
    params.append('fields[]', 'description');
    params.append('fields[]', 'main_seo_keyword');
    params.append('fields[]', 'secondary_seo_keywords');
    params.append('fields[]', 'need_create_post_amount');
    params.append('fields[]', 'ai_content_suggestions.id');
    params.append('fields[]', 'ai_content_suggestions.current_step');
    params.append('fields[]', 'ai_content_suggestions.status');
    params.append('fields[]', 'ai_content_suggestions.post_type');
    params.append('fields[]', 'customer_group.customer_group_id.id');
    params.append('fields[]', 'customer_group.customer_group_id.name');
    params.append('fields[]', 'services.services_id.id');
    params.append('fields[]', 'services.services_id.name');
    params.append('fields[]', '38a0c536.id');
    params.append('fields[]', '38a0c536.page_name');
    params.append('fields[]', 'customer_journey.customer_journey_id.id');
    params.append('fields[]', 'customer_journey.customer_journey_id.name');
    params.append('fields[]', 'content_tone.content_tone_id.id');
    params.append('fields[]', 'content_tone.content_tone_id.tone_name');
    params.append('fields[]', 'ai_rule_based.ai_rule_based_id.id');
    params.append('fields[]', 'ai_rule_based.ai_rule_based_id.content');
    params.append('fields[]', 'id');
    
    // Add aliases for omni channels
    params.append('alias[704a9f83]', 'omni_channels');
    params.append('alias[38a0c536]', 'omni_channels');
    
    // Add sorting
    params.append('sort[]', 'id');
    
    url = `${url}?${params.toString()}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    throw error;
  }
}

/**
 * Get a campaign by ID
 */
export async function getCampaign(id: string) {
  try {
    const response = await axiosInstance.get(`${endpoints.campaign.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching campaign with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new campaign
 */
export async function createCampaign(data: CampaignApiData) {
  try {
    const response = await axiosInstance.post(endpoints.campaign.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}

/**
 * Update an existing campaign
 */
export async function updateCampaign(id: string, data: CampaignFormData) {
  try {
    const response = await axiosInstance.patch(`${endpoints.campaign.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating campaign with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a campaign
 */
export async function deleteCampaign(id: string) {
  try {
    const response = await axiosInstance.delete(`${endpoints.campaign.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting campaign with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete multiple campaigns
 */
export async function deleteCampaigns(ids: string[]) {
  try {
    const response = await axiosInstance.delete(endpoints.campaign.delete, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple campaigns:', error);
    throw error;
  }
}