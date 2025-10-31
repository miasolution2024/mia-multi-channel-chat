import axiosInstance, { endpoints } from '@/utils/axios';
import { CustomerJourneyProcessFormData, CustomerJourneyProcessFormDataInternal } from '@/sections/customer-journey-process/types';

/**
 * Get all customer journey processes with pagination
 * @param page Page number (1-based)
 * @param limit Number of items per page
 * @param name Optional name filter
 * @param id Optional id filter
 * @param status Optional status filter
 */
export async function getCustomerJourneyProcesses(page?: number, limit: number = 25, name?: string, id?: string, status?: string) {
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
    params.append('fields[]', 'customer_journey.id');

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
    
    // filter status
    if(status){
      params.append(`filter[_and][0][_and][${filterIndex}][status][_eq]`, status);
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
export async function createCustomerJourneyProcess(data: CustomerJourneyProcessFormDataInternal) {
  try {
    // Transform internal form data to API format
    const apiData: CustomerJourneyProcessFormData = {
      name: data.name,
      status: data.status,
      customer_journey: {
        create: data.customer_journey.map(id => ({
          customer_journey_process_id: "+",
          customer_journey_id: {
            id: id
          }
        })),
        update: [],
        delete: []
      }
    };

    const response = await axiosInstance.post(endpoints.customerJourneyProcess.create, apiData);
    return response.data;
  } catch (error) {
    console.error('Error creating customer journey process:', error);
    throw error;
  }
}

/**
 * Update an existing customer journey process
 */
export async function updateCustomerJourneyProcess(id: string | number, data: Partial<CustomerJourneyProcessFormDataInternal>, originalData?: { customer_journey: number[], customer_journey_relationship_map?: Record<number, number> }) {
  try {
    // Transform internal form data to API format if customer_journey is provided
    let apiData: Partial<CustomerJourneyProcessFormData>;
    
    if (data.customer_journey !== undefined) {
      const newJourneyIds = data.customer_journey || [];
      const originalJourneyIds = originalData?.customer_journey || [];
      const relationshipMap = originalData?.customer_journey_relationship_map || {};
      
      // Find items to create (new items not in original)
      const toCreate = newJourneyIds.filter(journeyId => !originalJourneyIds.includes(journeyId));
      
      // Find items to delete (original items not in new)
      const toDelete = originalJourneyIds.filter(journeyId => !newJourneyIds.includes(journeyId));
      
      // Get relationship IDs for items to delete
      const deleteRelationshipIds = toDelete.map(journeyId => relationshipMap[journeyId]).filter(Boolean);
      
      apiData = {
        name: data.name,
        status: data.status,
        customer_journey: {
          create: toCreate.map(journeyId => ({
            customer_journey_process_id: "+",
            customer_journey_id: {
              id: journeyId
            }
          })),
          update: [],
          delete: deleteRelationshipIds
        }
      };
    } else {
      // If no customer_journey, just pass other fields
      apiData = {
        name: data.name,
        status: data.status
      };
    }

    const response = await axiosInstance.patch(`${endpoints.customerJourneyProcess.update}/${id}`, apiData);
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