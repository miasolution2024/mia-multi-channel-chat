import axiosInstance from '@/utils/axios';
import { ContentToneFormData } from '@/sections/content-tone/types';

// Define content tone endpoints
const contentToneEndpoints = {
  list: '/items/content_tone',
  create: '/items/content_tone',
  update: '/items/content_tone',
  delete: '/items/content_tone',
};

/**
 * Get all content tones with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 */
export async function getContentTones(page?: number, limit: number = 20) {
  try {
    let url = contentToneEndpoints.list;
    
    // Add pagination parameters
    const offset = page !== undefined ? (page - 1) * limit : 0; // Calculate offset based on page and limit
    url = `${url}?limit=${limit}&offset=${offset}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching content tones:', error);
    throw error;
  }
}

/**
 * Get a content tone by ID
 */
export async function getContentTone(id: string) {
  try {
    const response = await axiosInstance.get(`${contentToneEndpoints.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching content tone with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new content tone
 */
export async function createContentTone(data: ContentToneFormData) {
  try {
    const response = await axiosInstance.post(contentToneEndpoints.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating content tone:', error);
    throw error;
  }
}

/**
 * Update an existing content tone
 */
export async function updateContentTone(id: string, data: ContentToneFormData) {
  try {
    const response = await axiosInstance.patch(`${contentToneEndpoints.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating content tone with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a content tone
 */
export async function deleteContentTone(id: string) {
  try {
    const response = await axiosInstance.delete(`${contentToneEndpoints.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting content tone with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete multiple content tones
 */
export async function deleteContentTones(ids: string[]) {
  try {
    const response = await axiosInstance.delete(contentToneEndpoints.delete, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple content tones:', error);
    throw error;
  }
}