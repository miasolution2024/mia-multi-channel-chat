import axiosInstance, { endpoints } from '@/utils/axios';
import { ServiceFormData } from '@/sections/service/types';

/**
 * Get all services with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 * @param name Optional name filter
 * @param id Optional ID filter
 */
export async function getServices(page?: number, limit: number = 25, name?: string, id?: string) {  
  try {
    let url = endpoints.services.list;
    
    // Add pagination and field parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (page !== undefined) {
      params.append('page', page.toString());
    }
    
    // Add specific fields based on API response
    params.append('fields[]', 'id');
    params.append('fields[]', 'name');
    params.append('fields[]', 'price');
    params.append('fields[]', 'tags');
    params.append('fields[]', 'description');
    params.append('fields[]', 'file_training.id');
    params.append('fields[]', 'file_training.directus_files_id');
    params.append('fields[]', 'note');
    params.append('fields[]', 'created_at');
    params.append('fields[]', 'updated_at');
    params.append('fields[]', 'duration');
    params.append('fields[]', 'omni_channels.id');
    params.append('fields[]', 'omni_channels.omni_channels_id.page_name');
    params.append('fields[]', 'omni_channels.omni_channels_id.id');

    params.append('meta', '*');
    
    // Add sorting
    // params.append('sort[]', 'omni_channels.omni_channels_id.page_name');
        params.append('sort[]', '-created_at');


    // filter id if provided
    if(id){
      params.append('filter[_and][0][id][_eq]', id);
    }
    
    // filter name if provided
    if(name){
      params.append('filter[_and][0][name][_icontains]', name);
    }
    
    url = `${url}?${params.toString()}`;
    
    const response = await axiosInstance.get(url);
    
    return {
      data: response.data.data || [],
      total: response.data.meta?.filter_count || 0,
    };
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
}

/**
 * Get a single service by ID
 * @param id Service ID
 */
export async function getService(id: string) {
  try {
    const response = await axiosInstance.get(`${endpoints.services.list}/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
}

/**
 * Create a new service
 * @param data Service form data
 */
export async function createService(data: ServiceFormData) {
  try {
    const response = await axiosInstance.post(endpoints.services.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

/**
 * Update an existing service
 * @param id Service ID
 * @param data Partial service form data
 */
export async function updateService(id: string | number, data: Partial<ServiceFormData>) {
  try {
    const response = await axiosInstance.patch(`${endpoints.services.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
}

/**
 * Delete a single service
 * @param id Service ID
 */
export async function deleteService(id: string) {
  try {
    const response = await axiosInstance.delete(`${endpoints.services.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
}

/**
 * Delete multiple services
 * @param ids Array of service IDs
 */
export async function deleteServices(ids: string[]) {
  try {
    const response = await axiosInstance.delete(endpoints.services.delete, {
      data: { keys: ids }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting services:', error);
    throw error;
  }
}