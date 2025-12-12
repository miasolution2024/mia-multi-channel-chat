import axiosInstance, { endpoints } from '@/utils/axios';
import { OmniChannelUpdateData, OmniChannelCreateData } from '@/sections/omni-channel/types';

// ----------------------------------------------------------------------

export async function getOmniChannels(options: {
  page?: number;
  limit?: number;
  status?: string;
  source?: string;
  pageName?: string;
  id?: string;
}) {
  const { page, limit = 50, status, source, pageName, id } = options; 
  try {
    // Add pagination and field parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (page !== undefined) {
      params.append('page', page.toString());
    }
    
    // Add specific fields
    params.append('fields[]', 'is_enabled');
    params.append('fields[]', 'hasPostsocial');
    params.append('fields[]', 'id');
    params.append('fields[]', 'note');
    params.append('fields[]', 'page_name');
    params.append('fields[]', 'page_id');
    params.append('fields[]', 'source');
    params.append('fields[]', 'date_created');
    params.append('fields[]', 'date_updated');
    params.append('fields[]', 'domain_directus.public_directus_url');
    params.append('fields[]', 'domain_directus.version_release.version_number');
    params.append('fields[]', 'domain_directus.id');
    params.append('fields[]', 'token');
    params.append('fields[]', 'phone_number');
    params.append('fields[]', 'is_enabled_reply_comment');

    params.append('meta', '*');

    // Add sorting
    params.append('sort[]', '-id');

    // Add status filter if provided
    if (status) {
      params.append('filter[status][_neq]', status);
    } else {
      // Default filter to exclude archived items
      params.append('filter[status][_neq]', 'archived');
    }
    
    // Add id filter if provided
    if (id) params.append('filter[_and][0][_and][0][id][_eq]', id);

    if (source) params.append('filter[source][_eq]', source);
    if (pageName) params.append('filter[_and][0][_and][0][page_name][_icontains]', pageName);

    const response = await axiosInstance.get(endpoints.omniChannels.list, { params });
    return {
      data: response.data.data || [],
      total: response.data.meta?.filter_count || 0,
    };
  } catch (error) {
    console.error('Error fetching omni channels:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function deleteOmniChannel(id: string) {
  try {
    await axiosInstance.delete(`${endpoints.omniChannels.delete}/${id}`);
  } catch (error) {
    console.error('Error deleting omni channel:', error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function updateOmniChannel(id: string | number, data: Partial<OmniChannelUpdateData>) {
  try {
    const response = await axiosInstance.patch(`${endpoints.omniChannels.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating omni channel with ID ${id}:`, error);
    throw error;
  }
}

// ----------------------------------------------------------------------

export async function createOmniChannel(data: OmniChannelCreateData) {
  try {
    const response = await axiosInstance.post(endpoints.omniChannels.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating omni channel:', error);
    throw error;
  }
}