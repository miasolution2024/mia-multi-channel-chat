export interface ContentTone {
  id: string;
  tone_description: string;
  [key: string]: unknown; // Index signature for compatibility
}

export interface ContentToneFormData {
  tone_description: string;
}