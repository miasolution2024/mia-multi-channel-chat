// ----------------------------------------------------------------------

export interface OmniChannel {
  id: number;
  name: string;
  description: string;
  [key: string]: unknown;
}

export interface OmniChannelFormData {
  name: string;
  description: string;
}
export interface OmniChannel {
  is_enabled: boolean;
  is_enabled_reply_comment: boolean;
  demo_account: string | null;
  id: number;
  sub_domain_id: number;
  note: string | null;
  page_id: string;
  page_name: string;
  source: string;
  date_created: string;
  date_updated: string;
  token: string | null;
  domain_directus: {
    public_directus_url: string;
    id: number;
    version_release: {
      version_number: number;
    };
  };
}
export interface OmniChannelsResponse {
  data: OmniChannel[];
}