import { OmniChannelsResponse } from '@/sections/omni-channel/types';
import axiosInstance, { endpoints } from '@/utils/axios';

/**
 * Interface for omni channel data
 */


/**
 * Interface for omni channels API response
 */


/**
 * Get all omni channels with pagination and filtering
 * @param page Page number (1-based)
 * @param limit Number of items per page
 * @param status Filter status (optional)
 */
export async function getOmniChannels(
  page?: number,
  limit: number = 25,
  status?: string,
  source?: string
): Promise<OmniChannelsResponse> {
  try {
    let url = endpoints.omniChannels?.list || '/items/omni_channels';
    
    // Add pagination and field parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (page !== undefined) {
      params.append('page', page.toString());
    }
    
    // Add specific fields
    params.append('fields[]', 'is_enabled');
    params.append('fields[]', 'is_enabled_reply_comment');
    params.append('fields[]', 'demo_account');
    params.append('fields[]', 'id');
    params.append('fields[]', 'sub_domain_id');
    params.append('fields[]', 'note');
    params.append('fields[]', 'page_id');
    params.append('fields[]', 'page_name');
    params.append('fields[]', 'source');
    params.append('fields[]', 'date_created');
    params.append('fields[]', 'date_updated');
    params.append('fields[]', 'domain_directus.public_directus_url');
    params.append('fields[]', 'domain_directus.version_release.version_number');
    params.append('fields[]', 'domain_directus.id');
    params.append('fields[]', 'token');
    
    // Add sorting
    params.append('sort[]', '-date_created');
    
    // Add status filter if provided
    if (status) {
      params.append('filter[status][_neq]', status);
    } else {
      // Default filter to exclude archived items
      params.append('filter[status][_neq]', 'archived');
    }

    if (source) params.append("filter[source][_eq]", source);

    url = `${url}?${params.toString()}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching omni channels:', error);
    throw error;
  }
}