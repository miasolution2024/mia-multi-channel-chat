export interface WorkingSchedule {
  id: number;
  status: string; //draft, in_progress, published
  user_created: string;
  post_type: string;
  topic: string;
  date_created: string;
  scheduled_post_time: string | null;
  omni_channels: number[];
  campaign: string;
  is_schedule: boolean | null;
  omni_channel_name?: string;
  [key: string]: unknown;
}

export interface StatusChoices {
  id: number;
  value: string;
  title: string;
}

export interface OmniChoices {
  id: number;
  page_name: string;
}
