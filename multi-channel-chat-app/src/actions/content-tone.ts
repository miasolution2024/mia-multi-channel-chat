import axiosInstance from "@/utils/axios";
import { ContentToneFormData } from "@/sections/content-tone/types";

export interface ContentToneFilters {
  tone_name?: string;
  tone_description?: string;
  // searchTerm?: string;
  page?: number;
  pageSize?: number;
  id?: string;
}

export interface ContentToneListResponse {
  data: ContentToneApiResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ContentToneApiResponse {
  id: string;
  tone_name: string | null;
  tone_description: string;
  ai_content_suggestions?: unknown[];
}

// Define content tone endpoints
const contentToneEndpoints = {
  list: "/items/content_tone",
  create: "/items/content_tone",
  update: "/items/content_tone",
  delete: "/items/content_tone",
};

/**
 * Get content tones list with filters
 * @param filters Filter parameters
 */
export async function getContentToneList(
  filters: ContentToneFilters = {}
): Promise<ContentToneListResponse> {
  try {
    const params = new URLSearchParams();

    //Set limit (pageSize)
    const limit = filters.pageSize || 25;
    params.append("limit", limit.toString());

    const fields = [
      "tone_description",
      "tone_name",
      "ai_content_suggestions",
      "id",
    ];

    fields.forEach((field) => {
      params.append("field[]", field);
    });

    //Set sorting
    params.append("sort[]", "id");

    //Set page
    if (filters.page !== undefined)
      params.append("page", filters.page.toString());
    else params.append("page", "1");

    // if (filters.searchTerm) {
    //   params.append(
    //     "filter[_or][0][tone_description][_contains]",
    //     filters.searchTerm
    //   );
    //   params.append("filter[_or][1][id][_contains]", filters.searchTerm);
    // }

    // //Add id filter if provided
    // if (filters.id && !filters.searchTerm)
    //   params.append("filter[id][_eq]", filters.id);

    // //Add tone_description filter if provided
    // if (filters.tone_description && !filters.searchTerm)
    //   params.append(
    //     "filter[tone_description][_contains]",
    //     filters.tone_description
    //   );

    if (filters.id) params.append("filter[id][_eq]", filters.id);

    //Add tone_description filter if provided
    if (filters.tone_description)
      params.append(
        "filter[tone_description][_contains]",
        filters.tone_description
      );

    const response = await axiosInstance.get(
      `${contentToneEndpoints.list}?${params.toString()}`
    );

    return {
      data: response.data.data || [],
      total: response.data.meta?.total_count || 0,
      page: filters.page || 1,
      pageSize: limit,
    };
  } catch (error) {
    console.error("Error fetching content assistant list:", error);
    throw new Error("Không thể tải danh sách nội dung");
  }
}

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
    console.error("Error fetching content tones:", error);
    throw error;
  }
}

/**
 * Get a content tone by ID
 */
export async function getContentTone(id: string) {
  try {
    const response = await axiosInstance.get(
      `${contentToneEndpoints.list}/${id}`
    );
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
    const response = await axiosInstance.post(
      contentToneEndpoints.create,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating content tone:", error);
    throw error;
  }
}

/**
 * Update an existing content tone
 */
export async function updateContentTone(id: string, data: ContentToneFormData) {
  try {
    const response = await axiosInstance.patch(
      `${contentToneEndpoints.update}/${id}`,
      data
    );
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
    const response = await axiosInstance.delete(
      `${contentToneEndpoints.delete}/${id}`
    );
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
    console.error("Error deleting multiple content tones:", error);
    throw error;
  }
}
