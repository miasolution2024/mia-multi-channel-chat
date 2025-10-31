import axiosInstance, { endpoints } from "@/utils/axios";
import {
  CustomerInsightFormData,
  CustomerInsightCreateData,
  CustomerGroupCustomerJourneyCreateData,
  CustomerGroupCustomerJourneyResponse,
} from "@/sections/customer-insight/types";

interface GetCustomerInsightsParams {
  page?: number;
  limit?: number;
  content?: string;
  id?: string | number;
}

/**
 * Get all customer insights with pagination and filters
 * @param params Object containing page, limit, content, and id filters
 */
export async function getCustomerInsights(
  params: GetCustomerInsightsParams = {}
) {
  try {
    const { page, limit = 25, content, id } = params;

    let url = endpoints.customerInsights.list;

    // Add pagination and field parameters
    const urlParams = new URLSearchParams();
    urlParams.append("limit", limit.toString());

    if (page !== undefined) {
      urlParams.append("page", page.toString());
    }

    urlParams.append("meta", "*");

    // Add specific fields
    urlParams.append("fields[]", "id");
    urlParams.append("fields[]", "content");
    urlParams.append("fields[]", "customer_group_customer_journey");
    urlParams.append("fields[]", "6475a12b.customer_group_id.name");
    urlParams.append("fields[]", "10769dd4.customer_journey_id.name");
    urlParams.append("fields[]", "6ddb5bbb.customer_group_id.id");
    urlParams.append("fields[]", "493d68fc.customer_journey_id.id");

    // Add aliases
    urlParams.append("alias[6475a12b]", "customer_group_customer_journey");
    urlParams.append("alias[10769dd4]", "customer_group_customer_journey");
    urlParams.append("alias[6ddb5bbb]", "customer_group_customer_journey");
    urlParams.append("alias[493d68fc]", "customer_group_customer_journey");

    // Add sorting
    urlParams.append("sort[]", "-id");

    // Add filters
    let filterIndex = 0;

    // Filter by content if provided
    if (content) {
      urlParams.append(
        `filter[_and][${filterIndex}][content][_contains]`,
        content
      );
      filterIndex++;
    }

    // Filter by ID if provided
    if (id) {
      urlParams.append(`filter[_and][${filterIndex}][id][_eq]`, id.toString());
      filterIndex++;
    }

    url = `${url}?${urlParams.toString()}`;

    const response = await axiosInstance.get(url);
    const hasFilters = content !== undefined || id !== undefined;

    const totalCount = hasFilters
      ? response.data.meta?.filter_count || 0
      : response.data.meta?.total_count || 0;

    return {
      data: response.data?.data || [],
      total: totalCount,
      page: page || 1,
      pageSize: limit,
    };
  } catch (error) {
    console.error("Error fetching customer insights:", error);
    throw error;
  }
}

/**
 * Create a new customer insight
 */
export async function createCustomerInsight(data: CustomerInsightCreateData) {
  try {
    const response = await axiosInstance.post(
      endpoints.customerInsights.create,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating customer insight:", error);
    throw error;
  }
}

/**
 * Update an existing customer insight
 */
export async function updateCustomerInsight(
  id: string | number,
  data: Partial<CustomerInsightFormData>
) {
  try {
    const response = await axiosInstance.patch(
      `${endpoints.customerInsights.update}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating customer insight with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a customer insight
 */
export async function deleteCustomerInsight(id: string) {
  try {
    const response = await axiosInstance.delete(
      `${endpoints.customerInsights.delete}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error deleting customer insight with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete multiple customer insights
 */
export async function deleteCustomerInsights(ids: string[]) {
  try {
    const response = await axiosInstance.delete(
      endpoints.customerInsights.delete,
      {
        data: { ids },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting multiple customer insights:", error);
    throw error;
  }
}

/**
 * Get customer group customer journey relationship
 */

interface GetCustomerGroupCustomerJourneysParams {
  customer_group_id?: string | number;
  customer_journey_process? : string | number
}

export async function getCustomerGroupCustomerJourneys(
  params: GetCustomerGroupCustomerJourneysParams = {}
) {
  try {
    const { customer_group_id, customer_journey_process } = params;

    let url = endpoints.customerGroupCustomerJourney.list;

    // Add pagination and field parameters
    const urlParams = new URLSearchParams();
    urlParams.append("limit", "25");
    urlParams.append("page", "1");

    // Add fields based on the Directus query structure
    urlParams.append("fields[]", "61557062.name");
    urlParams.append("fields[]", "id");
    urlParams.append("fields[]", "5b61221c");
    urlParams.append("fields[]", "ac97705");
    urlParams.append("fields[]", "53c5bc9");
    urlParams.append("fields[]", "2f787ce3.name");
    urlParams.append("fields[]", "1cc0c1c2.content");

    // Add aliases for proper field relationships
    urlParams.append("alias[61557062]", "customer_journey_id");
    urlParams.append("alias[5b61221c]", "customer_group_id");
    urlParams.append("alias[ac97705]", "customer_journey_id");
    urlParams.append("alias[53c5bc9]", "customer_insight");
    urlParams.append("alias[2f787ce3]", "customer_group_id");
    urlParams.append("alias[1cc0c1c2]", "customer_insight");

    // Add sorting
    urlParams.append("sort[]", "-id");

    // Add filters with proper indexing
    let filterIndex = 0;

    // Add filter for customer_group_id if provided
    if (customer_group_id) {
      urlParams.append(
        `filter[_and][${filterIndex}][customer_group_id][id][_eq]`,
        customer_group_id.toString()
      );
      filterIndex++;
    }

    // Add filter for customer_journey_process if provided
    if (customer_journey_process) {
      urlParams.append(
        `filter[_and][${filterIndex}][customer_journey_id][customer_journey_process][id][_eq]`,
        customer_journey_process.toString()
      );
      filterIndex++;
    }

    url = `${url}?${urlParams.toString()}`;

    const response = await axiosInstance.get(url);
    return {
      data: response.data?.data || [],
    }
  } catch (error) {
    console.error(
      `Error fetching customer group customer journey with params ${JSON.stringify(
        params
      )}:`,
      error
    );
    throw error;
  }
}

/**
 * Create customer group customer journey relationship
 */
export async function createCustomerGroupCustomerJourney(
  data: CustomerGroupCustomerJourneyCreateData
): Promise<CustomerGroupCustomerJourneyResponse> {
  try {
    const response = await axiosInstance.post(
      endpoints.customerGroupCustomerJourney.create,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating customer group customer journey:", error);
    throw error;
  }
}

/**
 * Update customer group customer journey relationship
 */
export async function updateCustomerGroupCustomerJourney(
  id: string | number,
  data: CustomerGroupCustomerJourneyCreateData
) {
  try {
    const response = await axiosInstance.patch(
      `${endpoints.customerGroupCustomerJourney.update}/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error updating customer group customer journey with ID ${id}:`,
      error
    );
    throw error;
  }
}

export async function deleteCustomerGroupCustomerJourney(
  id: string | number
) {
  try {
    const response = await axiosInstance.delete(
      `${endpoints.customerGroupCustomerJourney.delete}/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting customer group customer journey with ID ${id}:`,
      error
    );
    throw error;
  }
}
