// Type for Step 2 campaign update
export interface CampaignStep2Data {
  main_seo_keyword: string;
  secondary_seo_keywords: string[];
  customer_journey: {
    create: Array<{
      campaign_id: string;
      customer_journey_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  content_tone: {
    create: Array<{
      campaign_id: string;
      content_tone_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  ai_rule_based: {
    create: Array<{
      campaign_id: string;
      ai_rule_based_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  post_notes: string;
  ai_create_post_list_notes: string;
}

// Type for Step 3 campaign update
export interface CampaignStep3Data {
  status: 'in_progress';
  ai_content_suggestions: {
    create: never[];
    update: Array<{
      campaign: string;
      id: number;
    }>;
    delete: never[];
  };
}

// Type for Step 1 campaign creation
export interface CampaignStep1Data {
  name: string;
  status: string;
  target_post_count: number;
  start_date: Date | null;
  end_date: Date | null;
  post_type: string;
  post_topic: string;
  objectives: string;
  description: string;
  ai_create_post_info_notes: string;
  customer_group: {
    create: Array<{
      campaign_id: string;
      customer_group_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  services: {
    create: Array<{
      campaign_id: string;
      services_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  omni_channels: {
    create: Array<{
      campaign_id: string;
      omni_channels_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
}

// Type for API data structure
export interface CampaignApiData {
  name: string;
  status: string;
  target_post_count: number;
  start_date: Date | null;
  end_date: Date | null;
  post_type: string;
  post_topic: string;
  objectives: string;
  description: string;
  ai_create_post_info_notes: string;
  main_seo_keyword: string;
  secondary_seo_keywords: string[];
  ai_create_post_list_notes: string;
  need_create_post_amount: number;
  ai_create_post_detail_notes: string;
  customer_group: {
    create: Array<{
      campaign_id: string;
      customer_group_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  services: {
    create: Array<{
      campaign_id: string;
      services_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  customer_journey: {
    create: Array<{
      campaign_id: string;
      customer_journey_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  ai_rule_based: {
    create: Array<{
      campaign_id: string;
      ai_rule_based_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  content_tone: {
    create: Array<{
      campaign_id: string;
      content_tone_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  omni_channels: {
    create: Array<{
      campaign_id: string;
      omni_channels_id: { id: number };
    }>;
    update: never[];
    delete: never[];
  };
  ai_content_suggestions: {
    create: Array<{
      campaign_id: string;
      ai_content_suggestion: string;
      ai_create_post_detail_notes: string;
    }>;
    update: never[];
    delete: never[];
  };
}