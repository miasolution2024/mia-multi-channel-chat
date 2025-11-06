export interface WorkingSchedule {
  id: number;
  status: string; //draft, in_progress, published
  user_created: string | { id: string; first_name: string; last_name: string };
  user_created_name?: string;
  post_type: string;
  topic: string;
  date_created: string;
  scheduled_post_time: string | null;
  omni_channels: number[];
  campaign: number;
  campaign_name: string;
  is_schedule: boolean | null;
  omni_channel_name?: string;
  [key: string]: unknown;
}

export interface CampaignInfo {
  id: number;
  name: string;
}

export interface UserInfo {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface StatusChoices {
  id: number;
  value: string;
  title: string;
}

export interface OmniChoices {
  id: number;
  page_name: string;
  ai_content_suggestions: number[];
}

export interface CreatorsChoices {
  id: string;
  user_name: string;
  ai_content_suggestions: number[];
}
