// Types for creating content assistant

export interface CreateContentAssistantRequest {
  post_type: string;
  topic: string;
  main_seo_keyword: string;
  secondary_seo_keywords?: string[];
  ai_rule_based?: {
    create: Array<{
      ai_content_suggestions_id: string;
      ai_rule_based_id: {
        id: number;
      };
    }>;
    update: unknown[];
    delete: unknown[];
  };
  content_tone?: {
    create: Array<{
      ai_content_suggestions_id: string;
      content_tone_id: {
        id: number;
      };
    }>;
    update: unknown[];
    delete: unknown[];
  };
  omni_channels?: {
    create: Array<{
      ai_content_suggestions_id: string;
      omni_channels_id: {
        id: number;
      };
    }>;
    update: unknown[];
    delete: unknown[];
  };
  is_generated_by_AI?: boolean;
  ai_notes_make_outline?: string;
  customer_journey?: {
    create: Array<{
      ai_content_suggestions_id: string;
      customer_journey_id: {
        id: number;
      };
    }>;
    update: unknown[];
    delete: unknown[];
  };
  customer_group?: {
    create: Array<{
      ai_content_suggestions_id: string;
      customer_group_id: {
        id: number;
      };
    }>;
    update: unknown[];
    delete: unknown[];
  };
}

export interface CreateContentAssistantResponse {
  data: {
    id: number;
    status: string;
    user_created: string;
    date_created: string;
    user_updated: string | null;
    date_updated: string | null;
    post_type: string;
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
    video: unknown | null;
    platform_post_id: string | null;
    ai_notes_create_image: string | null;
    is_generated_by_AI: boolean;
    current_step: string;
    ai_notes_make_outline: string | null;
    ai_notes_write_article: string | null;
    ai_notes_html_coding: string | null;
    customer_journey: number[];
    content_tone: number[];
    media: unknown[];
    customer_group: number[];
    media_generated_ai: unknown[];
    ai_rule_based: number[];
    omni_channels: number[];
  };
}