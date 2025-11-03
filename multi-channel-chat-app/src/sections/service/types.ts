// ----------------------------------------------------------------------

export interface OmniChannel {
  id: number; // ID của record trong junction table
  omni_channels_id: {
    id: number;
    page_name: string | null;
  } | null;
}

export interface FileTraining {
  id: number; // ID của record trong junction table
  directus_files_id: string;
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
  file_training: FileTraining[];
  [key: string]: unknown; // Index signature for compatibility with DataItem
}

export interface ServiceFormData {
  name: string;
  price: number;
  duration: number;
  tags?: string;
  description?: string;
  note?: string;
  omni_channels?: number[];
  file_training: (string | File)[];
}