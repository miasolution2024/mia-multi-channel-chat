import axiosInstance, { endpoints } from '@/utils/axios';
import { CustomerJourneyProcessFormData } from '@/sections/customer-journey-process/types';

/**
 * Get all customer journey processes with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 * @param name Optional name filter
 * @param id Optional id filter
 */
export async function getCustomerJourneyProcesses(page?: number, limit: number = 25, name?: string, id?: string) {
  try {
    let url = endpoints.customerJourneyProcess.list;
    
    // Add pagination and field parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (page !== undefined) {
      params.append('page', page.toString());
    }
    
    // Add specific fields
    params.append('fields[]', 'id');
    params.append('fields[]', 'name');
    params.append('fields[]', 'status');
    params.append('fields[]', 'customer_journey.customer_journey_id.id');
    params.append('fields[]', 'customer_journey.customer_journey_id.name');

    params.append('fields[]', 'date_created');
    params.append('fields[]', 'date_updated');

    params.append('meta', '*');
    
    // Add sorting
    params.append('sort[]', 'id');

    // Apply filters using correct nested _and structure
    let filterIndex = 0;
    
    // filter id
    if(id){
      params.append(`filter[_and][0][_and][${filterIndex}][id][_eq]`, id);
      filterIndex++;
    }
    
    // filter name
    if(name){
      params.append(`filter[_and][0][_and][${filterIndex}][name][_contains]`, name);
      filterIndex++;
    }
    
    url = `${url}?${params.toString()}`;
    

    const response = await axiosInstance.get(url);
    const hasFilters = name !== undefined;

       const totalCount = hasFilters 
      ? response.data.meta?.filter_count || 0
      : response.data.meta?.total_count || 0;
    
    return {
      data: response.data?.data || [],
      total: totalCount,
      page: page || 1,
      pageSize: limit,
    }
  } catch (error) {
    console.error('Error fetching customer journey processes:', error);
    throw error;
  }
}

/**
 * Get a customer journey process by ID
 */
export async function getCustomerJourneyProcess(id: string) {
  try {
    const response = await axiosInstance.get(`${endpoints.customerJourneyProcess.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer journey process with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new customer journey process
 */
export async function createCustomerJourneyProcess(data: CustomerJourneyProcessFormData) {
  try {
    const response = await axiosInstance.post(endpoints.customerJourneyProcess.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating customer journey process:', error);
    throw error;
  }
}

/**
 * Update an existing customer journey process
 */
export async function updateCustomerJourneyProcess(id: string | number, data: Partial<CustomerJourneyProcessFormData>) {
  try {
    const response = await axiosInstance.patch(`${endpoints.customerJourneyProcess.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer journey process with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a customer journey process
 */
export async function deleteCustomerJourneyProcess(id: string) {
  try {
    const response = await axiosInstance.delete(`${endpoints.customerJourneyProcess.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer journey process with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete multiple customer journey processes
 */
export async function deleteCustomerJourneyProcesses(ids: string[]) {
  try {
    const response = await axiosInstance.delete(endpoints.customerJourneyProcess.delete, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple customer journey processes:', error);
    throw error;
  }
}