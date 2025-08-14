// ----------------------------------------------------------------------

export interface CustomerJourney {
  id: number;
  name: string;
  description: string;
  ai_content_suggestions: unknown[];
  [key: string]: unknown;
}

export interface CustomerJourneyFormData {
  name: string;
  description: string;
  ai_content_suggestions?: unknown[];
}