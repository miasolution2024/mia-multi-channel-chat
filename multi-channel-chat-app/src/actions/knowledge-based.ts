import axiosInstance, { endpoints } from '@/utils/axios';
import { KnowledgeBasedFormData } from '@/sections/knowledge-based/types';

interface KnowledgeBasedPayload {
  code?: string | null;
  content: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SUSPENDED';
  omni_channels?: Array<{ omni_channels_id: number }>;
}

/**
 * Get all knowledge based items with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 * @param status Optional status filter (e.g., "PUBLISHED")
 */
export async function getKnowledgeBasedList(page?: number, limit: number = 20, status?: string) {
  try {
    let url = endpoints.knowledgeBased.list;
    
    // Add pagination parameters
    const offset = page !== undefined ? (page - 1) * limit : 0;
    url = `${url}?limit=${limit}&offset=${offset}&meta=*&sort[]=-id&fields=*,omni_channels.omni_channels_id.*`;
    
    // Add status filter if provided
    if (status) {
      url += `&filter[_and][0][status][_eq]=${status}`;
    }
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching knowledge based:', error);
    throw error;
  }
}

/**
 * Get a knowledge based item by ID
 */
export async function getKnowledgeBased(id: string | number) {
  try {
    const response = await axiosInstance.get(`${endpoints.knowledgeBased.list}/${id}?fields=*,omni_channels.omni_channels_id.*`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching knowledge based with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new knowledge based item
 */
export async function createKnowledgeBased(data: KnowledgeBasedFormData) {
  try {
    // Transform omni_channels array to relation format if provided
    const payload: KnowledgeBasedPayload = {
      code: data.code,
      content: data.content,
      status: data.status,
    };

    if (data.omni_channels && data.omni_channels.length > 0) {
      payload.omni_channels = data.omni_channels.map(id => ({
        omni_channels_id: id
      }));
    }

    const response = await axiosInstance.post(endpoints.knowledgeBased.create, payload);
    return response.data;
  } catch (error) {
    console.error('Error creating knowledge based:', error);
    throw error;
  }
}

/**
 * Update an existing knowledge based item
 */
export async function updateKnowledgeBased(id: string | number, data: KnowledgeBasedFormData) {
  try {
    // Transform omni_channels array to relation format if provided
    const payload: KnowledgeBasedPayload = {
      code: data.code,
      content: data.content,
      status: data.status,
    };

    if (data.omni_channels && data.omni_channels.length > 0) {
      payload.omni_channels = data.omni_channels.map(id => ({
        omni_channels_id: id
      }));
    }

    const response = await axiosInstance.patch(`${endpoints.knowledgeBased.update}/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating knowledge based with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a knowledge based item
 */
export async function deleteKnowledgeBased(id: string | number) {
  try {
    const response = await axiosInstance.delete(`${endpoints.knowledgeBased.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting knowledge based with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete multiple knowledge based items
 */
export async function deleteKnowledgeBasedMultiple(ids: (string | number)[]) {
  try {
    const response = await axiosInstance.delete(endpoints.knowledgeBased.delete, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple knowledge based:', error);
    throw error;
  }
}
