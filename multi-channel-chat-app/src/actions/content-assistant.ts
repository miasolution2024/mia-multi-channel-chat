import axiosInstance from "@/utils/axios";
import { CreateContentAssistantRequest, CreateContentAssistantResponse } from "@/sections/content-assistant/types/content-assistant-create";
import { UpdateContentAssistantRequest, UpdateContentAssistantResponse } from "@/sections/content-assistant/types/content-assistant-update";

// Định nghĩa interface cho MediaGeneratedAi
export interface MediaGeneratedAiItem {
  id: number;
  ai_content_suggestions_id: number;
  directus_files_id: string;
}

// Định nghĩa interface cho API response
export interface ContentAssistantApiResponse {
  id: number;
  status: string;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  post_type: string | null;
  topic: string;
  main_seo_keyword: string;
  secondary_seo_keywords: string[];
  phase_goal: string | null;
  post_notes: string | null;
  scheduled_post_time: string | null;
  ai_content_schedule: string | null;
  post_title: string | null;
  post_html_format: string | null;
  post_content: string | null;
  outline_post: string | null;
  post_goal: string | null;
  video: string | null;
  platform_post_id: string | null;
  ai_notes_create_image: string | null;
  is_generated_by_AI: boolean;
  current_step: string;
  ai_notes_make_outline: string;
  ai_notes_write_article: string | null;
  ai_notes_html_coding: string | null;
  customer_journey: number[];
  content_tone: number[];
  media: unknown[];
  customer_group: number[];
  media_generated_ai: MediaGeneratedAiItem[];
  ai_rule_based: number[];
  omni_channels: number[];
  services: number[];
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
  postType?: string;
  omniChannel?: number;
  isNotLinkToCampaign?: boolean;
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
      'secondary_seo_keywords',
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
      'services.services_id.id',
      'services.services_id.name',
      'omni_channels.omni_channels_id',
      'ai_rule_based.ai_rule_based_id.id',
      'ai_rule_based.ai_rule_based_id.content',
      'id',
      'current_step',
      'outline_post',
      'post_goal' ,
      'post_notes',
      'post_content',
      'media.*',
      'media_generated_ai.*',
      'post_html_format',
      'ai_notes_make_outline',
      'ai_notes_write_article',
      'ai_notes_create_image',
      'video'
    ];
    
    fields.forEach(field => {
      params.append('fields[]', field);
    });
    
    // Set meta to get all metadata
    params.append('meta', '*');
    // Set sorting
    params.append('sort[]', '-date_updated');

    // Set page
    if (filters.page !== undefined) {
      params.append('page', filters.page.toString());
    } else {
      params.append('page', '1');
    }
    
    // Build filter conditions using nested _and structure
    let mainFilterIndex = 0;
    let nestedFilterIndex = 0;
    
    // Add omniChannel filter if provided
    if (filters.omniChannel) {
      params.append(`filter[_and][${mainFilterIndex}][_and][${nestedFilterIndex}][omni_channels][omni_channels_id][id][_eq]`, filters.omniChannel.toString());
      nestedFilterIndex++;
    }
    
    // Add postType filter if provided
    if (filters.postType) {
      params.append(`filter[_and][${mainFilterIndex}][_and][${nestedFilterIndex}][post_type][_eq]`, filters.postType);
      nestedFilterIndex++;
    }
    
    // Add status filter if provided (and not archived)
    if (filters.status && filters.status.length > 0) {
      const nonArchivedStatuses = filters.status.filter(status => status !== 'archived');
      if (nonArchivedStatuses.length > 0) {
        params.append(`filter[_and][${mainFilterIndex}][_and][${nestedFilterIndex}][status][_eq]`, nonArchivedStatuses.join(','));
        nestedFilterIndex++;
      }
    }

    // Add id filter if provided
    if (filters.id) {
      params.append(`filter[_and][${mainFilterIndex}][_and][${nestedFilterIndex}][id][_eq]`, filters.id.toString());
      nestedFilterIndex++;
    }
    
    // Add topic filter if provided
    if (filters.topic) {
      params.append(`filter[_and][${mainFilterIndex}][_and][${nestedFilterIndex}][topic][_contains]`, filters.topic);
      nestedFilterIndex++;
    }
    if (filters?.isNotLinkToCampaign) {
      params.append(`filter[_and][${mainFilterIndex}][_and][${nestedFilterIndex}][campaign][id][_null]`, 'true');
      nestedFilterIndex++;
    }
    
    // Always exclude archived status
    mainFilterIndex++;
    params.append(`filter[_and][${mainFilterIndex}][status][_neq]`, 'archived');
    
    

    const response = await axiosInstance.get(
      `/items/ai_content_suggestions?${params}`
    );

    // Check if any filters are applied (excluding page and pageSize)
    const hasFilters = !!(
      filters.omniChannel ||
      filters.postType ||
      (filters.status && filters.status.length > 0) ||
      filters.id ||
      filters.topic ||
      filters.isNotLinkToCampaign
    );

    // Use total_filter if filters are applied, otherwise use total_count
    const totalCount = hasFilters 
      ? response.data.meta?.filter_count || 0
      : response.data.meta?.total_count || 0;

    return {
      data: response.data.data || [],
      total: totalCount,
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
    return response.data.data;
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

// Tạo content assistant mới với API structure mới
export async function createNewContentAssistant(
  data: CreateContentAssistantRequest
): Promise<CreateContentAssistantResponse> {
  try {
    const response = await axiosInstance.post('/items/ai_content_suggestions', data);
    return response.data;
  } catch (error) {
    console.error('Error creating new content assistant:', error);
    throw new Error('Không thể tạo nội dung mới');
  }
}

// Cập nhật content assistant với API structure mới
export async function updateNewContentAssistant(
  id: string | number,
  data: UpdateContentAssistantRequest
): Promise<UpdateContentAssistantResponse> {
  try {
    const response = await axiosInstance.patch(`/items/ai_content_suggestions/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating new content assistant:', error);
    throw new Error('Không thể cập nhật nội dung');
  }
}