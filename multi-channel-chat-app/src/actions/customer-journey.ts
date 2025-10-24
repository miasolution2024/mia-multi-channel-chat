import axiosInstance, { endpoints } from '@/utils/axios';
import { CustomerJourneyFormData } from '@/sections/customer-journey/types';

/**
 * Get all customer journeys with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 * @param name Optional name filter
 * @param isNotInCustomerJourneyProcess Optional filter to get customer journeys not in any process
 */
export async function getCustomerJourneys(page?: number, limit: number = 25, name?: string, isNotInCustomerJourneyProcess?: boolean) {
  try {
    let url = endpoints.customerJourneys.list;
    
    // Add pagination and field parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (page !== undefined) {
      params.append('page', page.toString());
    }
    
    // Add specific fields
    params.append('fields[]', 'ai_content_suggestions');
    params.append('fields[]', 'description');
    params.append('fields[]', 'name');
    params.append('fields[]', 'id');
    params.append("fields[]", "date_created");
    params.append("fields[]", "date_updated");
    params.append("fields[]", "active");
    params.append('fields[]', 'customer_journey_process');


    params.append('meta', '*');
    
    // Add sorting
    params.append('sort[]', 'id');

    // filter name if provided
    if(name){
      params.append('filter[_and][0][name][_contains]', name);
    }
    // filter customer journeys not in any process if provided
    if(isNotInCustomerJourneyProcess){
      params.append('filter[_and][0][customer_journey_process][_null]', 'true');
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
    console.error('Error fetching customer journeys:', error);
    throw error;
  }
}

/**
 * Get a customer journey by ID
 */
export async function getCustomerJourney(id: string) {
  try {
    const response = await axiosInstance.get(`${endpoints.customerJourneys.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer journey with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new customer journey
 */
export async function createCustomerJourney(data: CustomerJourneyFormData) {
  try {
    const response = await axiosInstance.post(endpoints.customerJourneys.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating customer journey:', error);
    throw error;
  }
}

/**
 * Update an existing customer journey
 */
export async function updateCustomerJourney(id: string | number, data: Partial<CustomerJourneyFormData>) {
  try {
    const response = await axiosInstance.patch(`${endpoints.customerJourneys.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer journey with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a customer journey
 */
export async function deleteCustomerJourney(id: string) {
  try {
    const response = await axiosInstance.delete(`${endpoints.customerJourneys.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer journey with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete multiple customer journeys
 */
export async function deleteCustomerJourneys(ids: string[]) {
  try {
    const response = await axiosInstance.delete(endpoints.customerJourneys.delete, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple customer journeys:', error);
    throw error;
  }
}