// ----------------------------------------------------------------------

export interface OmniChannel {
  omni_channels_id: {
    id: number;
    page_name: string | null;
  } | null;
}

export interface Service {
  id: number;
  name: string;
  price: string;
  duration: number;
  tags: string | null;
  description: string | null;
  note: string | null;
  created_at: string;
  omni_channels: OmniChannel[];
  file_training: unknown[];
  [key: string]: unknown; // Index signature for compatibility with DataItem
}

export interface ServiceFormData {
  name: string;
  price: string;
  duration: number;
  tags?: string;
  description?: string;
  note?: string;
  omni_channels?: number[];
}