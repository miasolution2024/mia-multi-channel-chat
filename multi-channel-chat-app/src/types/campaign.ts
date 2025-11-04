// ----------------------------------------------------------------------

// API Response Types
export interface CampaignCustomerGroup {
  customer_group_id: {
    id: number;
    name: string;
  };
}

export interface CampaignService {
  services_id?: {
    id: number;
    name: string;
  };
}

export interface CampaignCustomerJourney {
  customer_journey_id?: {
    id: number;
    name: string;
  };
}

export interface CampaignContentTone {
  content_tone_id?: {
    id: number;
    tone_name: string | null;
  };
}

export interface CampaignAiRuleBased {
  ai_rule_based_id?: {
    id: number;
    content: string;
  };
}

export interface CampaignAiContentSuggestion {
  id: number;
  current_step: string;
  status: string;
  post_type: string;
}

export interface CampaignOmniChannel {
  id: number;
  page_name: string;
}

// Form Data Types for Create/Update
export interface CampaignRelationItem {
  campaign_id: string;
  customer_group_id?: { id: number };
  services_id?: { id: number };
  customer_journey_id?: { id: number };
  content_tone_id?: { id: number };
  ai_rule_based_id?: { id: number };
}

export interface CampaignRelations {
  create: CampaignRelationItem[];
  update: CampaignRelationItem[];
  delete: CampaignRelationItem[];
}

export interface CampaignAiContentSuggestions {
  create: CampaignAiContentSuggestion[];
  update: CampaignAiContentSuggestion[];
  delete: CampaignAiContentSuggestion[];
}

export interface CampaignAiContentSuggestions {
  create: CampaignAiContentSuggestion[];
  update: CampaignAiContentSuggestion[];
  delete: CampaignAiContentSuggestion[];
}

// Main Campaign Interface (API Response)
export interface Campaign {
  id: number;
  name: string;
  start_date: string;
  status: 'draft' | 'completed' | 'in_progress';
  target_post_count: string;
  end_date: string;
  date_created: string;
  date_updated: string | null;
  post_type: string;
  post_topic: string;
  objectives: string;
  description: string;
  main_seo_keyword: string;
  secondary_seo_keywords: string[];
  need_create_post_amount: string | null;
  ai_content_suggestions: CampaignAiContentSuggestion[];
  customer_group: CampaignCustomerGroup[];
  services: CampaignService[];
  customer_journey: CampaignCustomerJourney[];
  content_tone: CampaignContentTone[];
  ai_rule_based: CampaignAiRuleBased[];
  current_step: string;
  // Omni channels fields with specific aliases from API
  '704a9f83': {
    page_name: string;
  };
  '38a0c536': {
    id: number;
    page_name: string;
  };
}

export interface CampaignFormData {
  id?: number; // Add optional ID field for storing created campaign ID
  name: string;
  status: 'draft' | 'completed' | 'in_progress';
  target_post_count: string;
  start_date: string;
  end_date: string;
  customer_group: CampaignRelations;
  services: CampaignRelations;
  post_type: string;
  omni_channels: number;
  post_topic: string;
  objectives: string;
  description: string;
  ai_create_post_info_notes: string;
  main_seo_keyword: string;
  secondary_seo_keywords: string[];
  customer_journey: CampaignRelations;
  content_tone: CampaignRelations;
  ai_rule_based: CampaignRelations;
  post_notes: string;
  ai_create_post_list_notes: string;
  need_create_post_amount: string;
  ai_content_suggestions: CampaignAiContentSuggestions;
  ai_create_post_detail_notes: string;
}