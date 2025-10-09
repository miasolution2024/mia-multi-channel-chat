// Define the data structure for ai_content_suggestions
export interface CustomerJourneyItem {
  customer_journey_id: {
    name: string;
  };
}

export interface ContentToneItem {
  content_tone_id: {
    id?: string;
    tone_description: string;
  };
}

export interface ContentSuggestionItem {
  id: string;
  topic: string;
  main_seo_keyword: string;
  secondary_seo_keywords: string[];
  customer_journey: CustomerJourneyItem[];
  post_type: string | null;
  content_tone: ContentToneItem[];
  ai_notes_write_article: string | null;
  [key: string]: unknown; // Add index signature to match DataItem interface
}