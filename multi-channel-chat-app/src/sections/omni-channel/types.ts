// ----------------------------------------------------------------------

export interface OmniChannel {
  is_enabled?: boolean;
  is_enabled_reply_comment?: boolean;
  demo_account?: string | null;
  id?: number;
  sub_domain_id?: number;
  hasPostsocial?: boolean;
  note?: string | null;
  page_id?: string;
  page_name?: string;
  source?: string;
  date_created?: string;
  date_updated?: string;
  token?: string | null;
  phone_number?: string | null;
  domain_directus?: {
    public_directus_url?: string;
    id?: number;
    version_release?: {
      version_number?: number;
    };
  };
}
export interface OmniChannelsResponse {
  data: OmniChannel[];
}

export type OmniChannelUpdateData = {
  is_enabled_reply_comment?: boolean;
  is_enabled?: boolean;
  source?: string;
  phone_number?: string;
  page_name?: string;
};

export type OmniChannelCreateData = {
  page_id: string;
  source: string;
  phone_number: string;
  token: string;
  page_name: string;
  is_enabled: boolean;
  is_enabled_reply_comment: boolean;
};