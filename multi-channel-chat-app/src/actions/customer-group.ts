import axiosInstance, { endpoints } from '@/utils/axios';
import { CustomerGroupFormData } from '@/sections/customer-group/types';

/**
 * Get all customer groups with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 */
export async function getCustomerGroups(page?: number, limit: number = 25) {
  try {
    let url = endpoints.customerGroups.list;
    
    // Add pagination and field parameters
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    
    if (page !== undefined) {
      params.append('page', page.toString());
    }
    
    // Add specific fields
    params.append('fields[]', 'name');
    params.append('fields[]', 'action');
    params.append('fields[]', 'descriptions');
    params.append('fields[]', 'services');
    params.append('fields[]', 'id');
    
    // Add sorting
    params.append('sort[]', 'id');
    
    url = `${url}?${params.toString()}`;
    
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching customer groups:', error);
    throw error;
  }
}

/**
 * Get a customer group by ID
 */
export async function getCustomerGroup(id: string) {
  try {
    const response = await axiosInstance.get(`${endpoints.customerGroups.list}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching customer group with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new customer group
 */
export async function createCustomerGroup(data: CustomerGroupFormData) {
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
 */
export async function updateCustomerGroup(id: string, data: CustomerGroupFormData) {
  try {
    const response = await axiosInstance.patch(`${endpoints.customerGroups.update}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating customer group with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a customer group
 */
export async function deleteCustomerGroup(id: string) {
  try {
    const response = await axiosInstance.delete(`${endpoints.customerGroups.delete}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer group with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete multiple customer groups
 */
export async function deleteCustomerGroups(ids: string[]) {
  try {
    const response = await axiosInstance.delete(endpoints.customerGroups.delete, {
      data: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting multiple customer groups:', error);
    throw error;
  }
}