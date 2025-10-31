// ----------------------------------------------------------------------

export interface CustomerInsight {
  id: number | string;
  content: string;
  customer_group_customer_journey: number;
  "6475a12b": {
    customer_group_id: {
      name: string;
    };
  } | null;
  "10769dd4": {
    customer_journey_id: {
      name: string;
    };
  } | null;
  "6ddb5bbb": {
    customer_group_id: {
      id: number;
    };
  } | null;
  "493d68fc": {
    customer_journey_id: {
      id: number;
    };
  } | null;
  [key: string]: unknown;
}

export interface CustomerInsightFormData {
  content: string;
  customer_journey_id: string;
  customer_group_id: string;
}

export interface CustomerInsightCreateData {
  content: string;
  customer_group_customer_journey: number;
}

export interface CustomerGroupCustomerJourneyCreateData {
  customer_group_id: number;
  customer_journey_id: number;
}

export interface CustomerGroupCustomerJourneyResponse {
  data: {
    id: number;
    customer_group_id: number;
    customer_journey_id: number;
    customer_insight: unknown[];
  };
}