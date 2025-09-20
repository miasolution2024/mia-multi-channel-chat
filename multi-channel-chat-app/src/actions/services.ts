import { ServicesFormData } from '@/sections/services/types';
import axiosInstance, { endpoints } from '@/utils/axios';

/**
 * Get all customer services with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 */
export async function getServices(page?: number, limit: number = 25) {
  try {
    let url = endpoints.services.list;
    
    // Add pagination and field parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (page !== undefined) {
      params.append('page', page.toString());
    }
    
    // Add specific fields
    params.append('fields[]', 'name');
    params.append('fields[]', 'description');
    params.append('fields[]', 'id');
    
    // Add sorting
    params.append('sort[]', 'id');
    
    url = `${url}?${params.toString()}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

/**
 * Get a customer service by ID
 */
export async function getCustomerService(id: string) {
  try {
    const response = await axiosInstance.get(`${endpoints.services.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer service with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new customer service
 */
export async function createCustomerService(data: ServicesFormData) {
  try {
    const response = await axiosInstance.post(endpoints.services.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating customer service:', error);
    throw error;
  }
}

/**
 * Update an existing customer service
 */
export async function updateCustomerService(id: string, data: ServicesFormData) {
  try {
    const response = await axiosInstance.patch(`${endpoints.services.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer service with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a customer service
 */
export async function deleteCustomerService(id: string) {
  try {
    const response = await axiosInstance.delete(`${endpoints.services.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer service with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete multiple customer services
 */
export async function deleteservices(ids: string[]) {
  try {
    const response = await axiosInstance.delete(endpoints.services.delete, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple customer services:', error);
    throw error;
  }
}