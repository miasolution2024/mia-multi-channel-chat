// ----------------------------------------------------------------------

export interface CustomerJourney {
  id: number | string;
  name: string;
  description: string;
  ai_content_suggestions: unknown[];
  date_created: string;
  date_updated: string;
  active: boolean;
  [key: string]: unknown;
}

export interface CustomerJourneyFormData {
  name: string;
  description: string;
  active: boolean;
  ai_content_suggestions?: unknown[];
}
