import axiosInstance from "@/utils/axios";

// Định nghĩa interface cho MediaGeneratedAi
export interface MediaGeneratedAiItem {
  id: number;
  ai_content_suggestions_id: number;
  directus_files_id: string;
}

// Định nghĩa interface cho API response
export interface ContentAssistantApiResponse {
  id: number;
  topic: string;
  post_type: string | null;
  main_seo_keyword: string;
  secondary_seo_keywords?: string[];
  customer_group: Array<{
    customer_group_id: {
      id: number;
      name: string;
    };
  }>;
  customer_journey: Array<{
    customer_journey_id: {
      id: number;
      name: string;
    };
  }>;
  ai_rule_based: Array<{
    ai_rule_based_id: {
      id: number;
      content: string;
    };
  }>;
  content_tone: Array<{
    content_tone_id: {
      id: number;
      tone_name: string | null;
      tone_description: string;
    };
  }>;
  additional_notes?: string;
  created_at?: string;
  status: string;
  description?: string;
  // Extended fields
  additional_notes_step_1?: string;
  omni_channels: Array<{
    omni_channels_id: number;
  }>;
  outline_post?: string;
  post_goal?: string;
  post_notes?: string;
  additional_notes_step_2?: string;
  content?: string;
  ai_notes_create_image_step_3?: string;
  media?: File[];
  media_generated_ai?: MediaGeneratedAiItem[];
  additional_notes_step_4?: string;
  post_html_format?: string;
  action?: string;
}

export interface ContentAssistantListResponse {
  data: ContentAssistantApiResponse[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ContentAssistantFilters {
  topic?: string;
  status?: string[];
  page?: number;
  pageSize?: number;
  id?: number;
}

// Lấy danh sách content assistant
export async function getContentAssistantList(
  filters: ContentAssistantFilters = {}
): Promise<ContentAssistantListResponse> {
  try {
    const params = new URLSearchParams();
    
    // Set limit (pageSize)
    const limit = filters.pageSize || 25;
    params.append('limit', limit.toString());
    
    // Set required fields
    const fields = [
      'main_seo_keyword',
      'post_type',
      'status',
      'topic',
      'customer_group.customer_group_id.id',
      'customer_group.customer_group_id.name',
      'content_tone.content_tone_id.id',
      'content_tone.content_tone_id.tone_name',
      'content_tone.content_tone_id.tone_description',
      'customer_journey.customer_journey_id.id',
      'customer_journey.customer_journey_id.name',
      'omni_channels.omni_channels_id',
      'ai_rule_based.ai_rule_based_id.id',
      'ai_rule_based.ai_rule_based_id.content',
      'id',
      'action',
      'outline_post',
      'post_goal' ,
      'post_notes',
      'post_content',
      'media.*',
      'media_generated_ai.*',
      'post_html_format'
    ];
    
    fields.forEach(field => {
      params.append('fields[]', field);
    });
    
    // Set sorting
    params.append('sort[]', '-date_updated');
    
    // Set meta to get all metadata
    params.append('meta', '*');
    
    // Set page
    if (filters.page !== undefined) {
      params.append('page', filters.page.toString());
    } else {
      params.append('page', '1');
    }
    
    // Set filter to exclude archived status
    params.append('filter[status][_neq]', 'archived');
    
    // Add id filter if provided
    if (filters.id) {
      params.append('filter[id][_eq]', filters.id.toString());
    }
    
    // Add topic filter if provided
    if (filters.topic) {
      params.append('filter[topic][_contains]', filters.topic);
    }
    
    // Add status filter if provided (and not archived)
    if (filters.status && filters.status.length > 0) {
      const nonArchivedStatuses = filters.status.filter(status => status !== 'archived');
      if (nonArchivedStatuses.length > 0) {
        params.append('filter[status][_in]', nonArchivedStatuses.join(','));
      }
    }

    const response = await axiosInstance.get(
      `/items/ai_content_suggestions?${params.toString()}`
    );

    return {
      data: response.data.data || [],
      total: response.data.meta?.total_count || 0,
      page: filters.page || 1,
      pageSize: limit,
    };
  } catch (error) {
    console.error('Error fetching content assistant list:', error);
    throw new Error('Không thể tải danh sách nội dung');
  }
}

// Lấy chi tiết content assistant theo ID
export async function getContentAssistantById(
  id: string | number
): Promise<ContentAssistantApiResponse> {
  try {
    const response = await axiosInstance.get(`/items/ai_content_suggestions/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching content assistant:', error);
    throw new Error('Không thể tải thông tin nội dung');
  }
}

// Xóa content assistant
export async function deleteContentAssistant(
  id: string | number
): Promise<void> {
  try {
    await axiosInstance.delete(`/items/ai_content_suggestions/${id}`);
  } catch (error) {
    console.error('Error deleting content assistant:', error);
    throw new Error('Không thể xóa nội dung');
  }
}

// Cập nhật trạng thái content assistant
export async function updateContentAssistantStatus(
  id: string | number,
  status: string
): Promise<ContentAssistantApiResponse> {
  try {
    const response = await axiosInstance.patch(
      `/items/ai_content_suggestions/${id}`,
      { status }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating content assistant status:', error);
    throw new Error('Không thể cập nhật trạng thái');
  }
}

// Tạo content assistant mới
export async function createContentAssistant(
  data: Partial<ContentAssistantApiResponse>
): Promise<ContentAssistantApiResponse> {
  try {
    const response = await axiosInstance.post('/items/ai_content_suggestions', data);
    return response.data;
  } catch (error) {
    console.error('Error creating content assistant:', error);
    throw new Error('Không thể tạo nội dung mới');
  }
}

// Cập nhật content assistant
export async function updateContentAssistant(
  id: string | number,
  data: Record<string, unknown>
): Promise<ContentAssistantApiResponse> {
  try {
    delete data.additional_notes_step_1;
    delete data.additional_notes_step_2;
    delete data.additional_notes_step_3;
    delete data.additional_notes_step_4;
    delete data.ai_notes_create_image_step_3;
    delete data.id;

    const response = await axiosInstance.patch(
      `/items/ai_content_suggestions/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Error updating content assistant:', error);
    throw new Error('Không thể cập nhật nội dung');
  }
}