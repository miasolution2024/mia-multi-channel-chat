// ----------------------------------------------------------------------

export interface AiRule {
  id: string;
  content: string;
  [key: string]: unknown;
}

export interface AiRuleFormData {
  content: string;
}