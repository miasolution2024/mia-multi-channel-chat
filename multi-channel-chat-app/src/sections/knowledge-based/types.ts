// ----------------------------------------------------------------------

export interface OmniChannel {
  page_name: string;
  id: number;
}

export interface OmniChannelRelation {
  omni_channels_id: OmniChannel;
}

export interface KnowledgeBased {
  id: number;
  code: string | null;
  content: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SUSPENDED';
  omni_channels?: OmniChannelRelation[];
  [key: string]: unknown;
}

export interface KnowledgeBasedFormData {
  code?: string | null;
  content: string;
  status: 'PUBLISHED' | 'DRAFT' | 'SUSPENDED';
  omni_channels?: number[]; // Array of omni_channel IDs
}

export const STATUS_OPTIONS = [
  { value: 'PUBLISHED', label: 'Đã đào tạo' },
  { value: 'DRAFT', label: 'Bản nháp' },
  { value: 'SUSPENDED', label: 'Ngưng đào tạo' },
] as const;
