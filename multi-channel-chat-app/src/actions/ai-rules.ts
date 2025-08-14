import axiosInstance, { endpoints } from '@/utils/axios';
import { AiRuleFormData } from '@/sections/ai-rules/types';

/**
 * Get all AI rules with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 */
export async function getAiRules(page?: number, limit: number = 20) {
  try {
    let url = endpoints.aiRules.list;
    
    // Add pagination parameters
    const offset = page !== undefined ? (page - 1) * limit : 0; // Calculate offset based on page and limit
    url = `${url}?limit=${limit}&offset=${offset}&meta=*&sort[]=-created_at`;
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching AI rules:', error);
    throw error;
  }
}

/**
 * Get an AI rule by ID
 */
export async function getAiRule(id: string) {
  try {
    const response = await axiosInstance.get(`${endpoints.aiRules.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching AI rule with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new AI rule
 */
export async function createAiRule(data: AiRuleFormData) {
  try {
    const response = await axiosInstance.post(endpoints.aiRules.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating AI rule:', error);
    throw error;
  }
}

/**
 * Update an existing AI rule
 */
export async function updateAiRule(id: string, data: AiRuleFormData) {
  try {
    const response = await axiosInstance.patch(`${endpoints.aiRules.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating AI rule with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete an AI rule
 */
export async function deleteAiRule(id: string) {
  try {
    const response = await axiosInstance.delete(`${endpoints.aiRules.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting AI rule with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete multiple AI rules
 */
export async function deleteAiRules(ids: string[]) {
  try {
    const response = await axiosInstance.delete(endpoints.aiRules.delete, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple AI rules:', error);
    throw error;
  }
}