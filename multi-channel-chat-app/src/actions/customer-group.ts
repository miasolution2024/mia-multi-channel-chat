import axiosInstance, { endpoints } from '@/utils/axios';
import { CustomerGroupCreateData } from '@/sections/customer-group/types';

interface GetCustomerGroupsParams {
  page?: number;
  limit?: number;
  name?: string;
  id?: string | number;
}

/**
 * Get all customer groups with pagination and filters
 * @param params Object containing page, limit, name, and id filters
 */
export async function getCustomerGroups(params: GetCustomerGroupsParams = {}) {
  try {
    const { page, limit = 25, name, id } = params;
    
    let url = endpoints.customerGroups.list;
    
    // Add pagination and field parameters
    const urlParams = new URLSearchParams();
    urlParams.append('limit', limit.toString());
    
    if (page !== undefined) {
      urlParams.append('page', page.toString());
    }
    
    urlParams.append('meta', '*');
    
    // Add specific fields
    urlParams.append('fields[]', 'id');
    urlParams.append('fields[]', 'name');
    urlParams.append('fields[]', 'action');
    urlParams.append('fields[]', 'descriptions');
    urlParams.append('fields[]', 'services.services_id.id');
     urlParams.append('fields[]', 'services.services_id.name');
     urlParams.append('fields[]', 'ai_note_analysis_context');
     urlParams.append('fields[]', 'customer_journey_process.id');

    urlParams.append('fields[]', 'ai_note_analysis_need');
     urlParams.append('fields[]', 'who');
     urlParams.append('fields[]', 'what');
     urlParams.append('fields[]', 'where');
     urlParams.append('fields[]', 'why');
     urlParams.append('fields[]', 'When');
     urlParams.append('fields[]', 'How');

     urlParams.append('fields[]', 'ai_note_propose_solution');
     urlParams.append('fields[]', 'context');
     urlParams.append('fields[]', 'main_job');
     urlParams.append('fields[]', 'related_job');
     urlParams.append('fields[]', 'emotional_job');

      urlParams.append('fields[]', 'ai_note_create_insight');
     urlParams.append('fields[]', 'expected_outcome');
     urlParams.append('fields[]', 'pain_point');
     urlParams.append('fields[]', 'trigger');
     urlParams.append('fields[]', 'solution_idea');

    // Add sorting
    urlParams.append('sort[]', '-id');

    // Add filters
    let filterIndex = 0;
    
    // Filter by name if provided
    if (name) {
      urlParams.append(`filter[_and][${filterIndex}][name][_contains]`, name);
      filterIndex++;
    }
    
    // Filter by ID if provided
    if (id) {
      urlParams.append(`filter[_and][${filterIndex}][id][_eq]`, id.toString());
      filterIndex++;
    }

    // Append query parameters to URL
    if (urlParams.toString()) {
      url += `?${urlParams.toString()}`;
    }

    const response = await axiosInstance.get(url);
    const hasFilters = name !== undefined || id !== undefined;

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
    console.error('Error fetching customer groups:', error);
    throw error;
  }
}

/**
 * Get a single customer group by ID
 * @param id Customer group ID
 */
export async function getCustomerGroup(id: string | number) {
  try {
    const response = await axiosInstance.get(`${endpoints.customerGroups.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer group:', error);
    throw error;
  }
}

/**
 * Create a new customer group
 * @param data Customer group data
 */
export async function createCustomerGroup(data: CustomerGroupCreateData) {
  try {
    const response = await axiosInstance.post(endpoints.customerGroups.create, data);
    return response.data;
  } catch (error) {
    console.error('Error creating customer group:', error);
    throw error;
  }
}

/**
 * Update an existing customer group
 * @param id Customer group ID
 * @param data Partial customer group data
 */
export async function updateCustomerGroup(id: string | number, data: Partial<CustomerGroupCreateData>) {
  try {
    const response = await axiosInstance.patch(`${endpoints.customerGroups.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating customer group:', error);
    throw error;
  }
}

/**
 * Delete a customer group
 * @param id Customer group ID
 */
export async function deleteCustomerGroup(id: string) {
  try {
    const response = await axiosInstance.delete(`${endpoints.customerGroups.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting customer group:', error);
    throw error;
  }
}

/**
 * Delete multiple customer groups
 * @param ids Array of customer group IDs
 */
export async function deleteCustomerGroups(ids: string[]) {
  try {
    const deletePromises = ids.map(id => 
      axiosInstance.delete(`${endpoints.customerGroups.delete}/${id}`)
    );
    
    const responses = await Promise.all(deletePromises);
    return responses.map(response => response.data);
  } catch (error) {
    console.error('Error deleting customer groups:', error);
    throw error;
  }
}